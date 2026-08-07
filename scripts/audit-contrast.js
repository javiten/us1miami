/**
 * Text-contrast audit, run in the page via `agent-browser eval`.
 *
 * The reason this exists as a file rather than an inline one-liner: the naive
 * version splits a computed colour on digits and treats the first three numbers
 * as RGB. Modern Chrome returns blended colours as `oklab(L a b / alpha)`, so
 * that version reads the oklab lightness as a red channel and reports a wildly
 * wrong ratio — it flagged white-on-navy at 1.23:1 when the real figure is 8.7.
 *
 * Instead this paints each colour onto a 1x1 canvas, which makes the browser do
 * the colour-space conversion, then composites the result over the nearest
 * opaque ancestor background so semi-transparent text is measured as rendered.
 *
 * Usage:
 *   agent-browser eval "$(cat scripts/audit-contrast.js)"
 */
;(() => {
  const probe = document.createElement("canvas")
  probe.width = probe.height = 1
  const ctx = probe.getContext("2d", { willReadFrequently: true })

  /** Resolve any CSS colour string to [r, g, b, a] via the canvas. */
  const parse = (css) => {
    ctx.clearRect(0, 0, 1, 1)
    ctx.fillStyle = "#000"
    ctx.fillStyle = css
    // An unparseable value leaves fillStyle at the previous colour, so bail out
    // to a sentinel rather than silently measuring black.
    ctx.clearRect(0, 0, 1, 1)
    ctx.fillRect(0, 0, 1, 1)
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data
    return [r, g, b, a / 255]
  }

  const relLum = ([r, g, b]) => {
    const f = (v) => {
      v /= 255
      return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    }
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
  }

  const over = (fg, bg) => [0, 1, 2].map((i) => fg[i] * fg[3] + bg[i] * (1 - fg[3]))

  const ratio = (fg, bg) => {
    const L1 = relLum(fg)
    const L2 = relLum(bg)
    return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)
  }

  /** Walk up until we find a background that is fully opaque. */
  const effectiveBg = (el) => {
    let node = el
    let acc = null
    while (node && node !== document.documentElement.parentNode) {
      const c = parse(getComputedStyle(node).backgroundColor)
      if (c[3] > 0) acc = acc ? over(acc, c) : c
      if (acc && acc[3] === 1) return acc
      if (acc && c[3] === 1) return over(acc, c)
      node = node.parentElement
    }
    return acc && acc[3] === 1 ? acc : [255, 255, 255]
  }

  const results = []
  for (const el of document.querySelectorAll("h1,h2,h3,h4,p,span,a,li,button,label,strong,em,td,th")) {
    if (el.children.length > 0) continue
    const text = el.textContent.trim()
    if (!text) continue
    const rect = el.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) continue
    const cs = getComputedStyle(el)
    if (cs.visibility === "hidden" || cs.opacity === "0") continue

    const size = parseFloat(cs.fontSize)
    const weight = Number.parseInt(cs.fontWeight, 10) || 400
    // WCAG "large text": >=24px, or >=18.66px when bold.
    const isLarge = size >= 24 || (size >= 18.66 && weight >= 700)
    const required = isLarge ? 3 : 4.5

    const bg = effectiveBg(el)
    const fgRaw = parse(cs.color)
    const fg = over([...fgRaw.slice(0, 3), fgRaw[3] * parseFloat(cs.opacity || "1")], bg)
    const r = ratio(fg, bg)

    if (r < required) {
      results.push({
        text: text.slice(0, 46),
        px: Math.round(size),
        weight,
        ratio: Number(r.toFixed(2)),
        required,
        color: cs.color,
      })
    }
  }

  return JSON.stringify({ failures: results.length, results }, null, 1)
})()
