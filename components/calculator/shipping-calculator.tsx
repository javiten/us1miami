"use client"

import { useId, useMemo, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "motion/react"
import { ArrowRight, Info } from "lucide-react"

import { useI18n } from "@/components/language-provider"
import { CONTAINER, ctaClasses } from "@/components/editorial/primitives"
import { CALCULATOR_ANCHOR } from "@/lib/calculator"
import { JAPAN_PATH, JAPAN_REQUEST_ANCHOR } from "@/lib/japan"
import {
  MAX_QUOTE_VALUE_USD,
  MAX_QUOTE_WEIGHT_KG,
  QUOTE_CATEGORIES,
  calculateQuote,
  formatUsd,
  parseAmount,
  requiresCommercialValue,
  type QuoteCategory,
} from "@/lib/shipping-rates"
import { track } from "@/lib/analytics"
import { cn } from "@/lib/utils"

/**
 * The /calculator widget.
 *
 * All arithmetic lives in `calculateQuote` (lib/shipping-rates.ts) — this file
 * only collects input and renders the result. Keeping the split means the
 * pricing rules are unit-testable without a DOM, and a copy change here can
 * never alter a number.
 *
 * The result recomputes on every keystroke via `useMemo`, so there is no
 * "Calculate" button and no page reload. Errors are held back until a field has
 * been blurred, so the form does not scold you for a half-typed number.
 */
export function ShippingCalculator() {
  const { t } = useI18n()
  const c = t.calculator
  const uid = useId()

  const [category, setCategory] = useState<QuoteCategory>("automotive")
  const [weight, setWeight] = useState("")
  const [commercialValue, setCommercialValue] = useState("")
  const [assistedPurchase, setAssistedPurchase] = useState(false)
  const [touched, setTouched] = useState<{ weight?: boolean; commercialValue?: boolean }>({})

  const isJapan = category === "japan"
  const needsValue = requiresCommercialValue(category, assistedPurchase)

  const result = useMemo(
    () => calculateQuote({ category, weight, commercialValue, assistedPurchase }),
    [category, weight, commercialValue, assistedPurchase],
  )

  /**
   * A field is only in error once it has been blurred AND holds unusable text.
   * An empty untouched field is merely incomplete, which the result panel
   * already communicates without turning the form red.
   */
  const fieldError = (field: "weight" | "commercialValue") => {
    if (!touched[field]) return null
    const raw = field === "weight" ? weight : commercialValue
    const max = field === "weight" ? MAX_QUOTE_WEIGHT_KG : MAX_QUOTE_VALUE_USD
    if (!raw.trim()) {
      return field === "weight" ? c.form.errors.weightRequired : c.form.errors.valueRequired
    }
    if (parseAmount(raw, max) === null) {
      return field === "weight" ? c.form.errors.weightInvalid : c.form.errors.valueInvalid
    }
    return null
  }

  const weightError = fieldError("weight")
  const valueError = needsValue ? fieldError("commercialValue") : null

  const selectCategory = (next: QuoteCategory) => {
    setCategory(next)
    // Automotive owns the assisted-purchase question. Leaving the flag set while
    // on another category would silently require a value field that the new
    // category never shows.
    if (next !== "automotive") setAssistedPurchase(false)
    track("calculator_category_select", { category: next })
  }

  return (
    <section id={CALCULATOR_ANCHOR} className="scroll-mt-28 pb-20 sm:pb-28">
      <div className={CONTAINER}>
        {/* Inputs left, result right on desktop; single column with the result
            directly below the inputs on mobile, which is the reading order the
            DOM already has. */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
          <div className="rounded-[1.75rem] border border-border bg-white p-6 shadow-[0_24px_60px_-40px_rgba(7,27,58,0.35)] sm:p-8">
            <h2 className="font-display text-2xl leading-tight text-navy sm:text-3xl">{c.form.heading}</h2>

            <fieldset className="mt-8">
              <legend className="text-sm font-semibold text-navy">{c.form.categoryLabel}</legend>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{c.form.categoryHint}</p>

              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {QUOTE_CATEGORIES.map((key) => {
                  const option = c.form.categories[key]
                  const selected = category === key
                  return (
                    <label
                      key={key}
                      className={cn(
                        "group relative flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
                        selected
                          ? "border-primary bg-primary/[0.06]"
                          : "border-border bg-white hover:border-primary/40 hover:bg-muted/50",
                      )}
                    >
                      <input
                        type="radio"
                        name={`${uid}-category`}
                        value={key}
                        checked={selected}
                        onChange={() => selectCategory(key)}
                        className="peer sr-only"
                      />
                      {/* Custom control, but the real radio above still receives
                          focus — the ring is mirrored here via peer-focus. */}
                      <span
                        aria-hidden
                        className={cn(
                          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2",
                          selected ? "border-primary" : "border-muted-foreground/40",
                        )}
                      >
                        {selected ? <span className="h-2 w-2 rounded-full bg-primary" /> : null}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-navy">{option.label}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">{option.rate}</span>
                      </span>
                    </label>
                  )
                })}
              </div>
            </fieldset>

            {/* Japan publishes no rate, so the numeric fields are removed rather
                than disabled — there is nothing to compute from them. */}
            {isJapan ? (
              <JapanPanel heading={c.japan.heading} body={c.japan.body} cta={c.japan.cta} />
            ) : (
              <>
                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <NumberField
                    id={`${uid}-weight`}
                    label={c.form.weightLabel}
                    suffix={c.form.weightUnit}
                    placeholder={c.form.weightPlaceholder}
                    help={c.form.weightHelp}
                    value={weight}
                    error={weightError}
                    onChange={setWeight}
                    onBlur={() => setTouched((s) => ({ ...s, weight: true }))}
                  />

                  {needsValue ? (
                    <NumberField
                      id={`${uid}-value`}
                      label={c.form.valueLabel}
                      prefix={c.form.valuePrefix}
                      placeholder={c.form.valuePlaceholder}
                      help={c.form.valueHelp}
                      value={commercialValue}
                      error={valueError}
                      onChange={setCommercialValue}
                      onBlur={() => setTouched((s) => ({ ...s, commercialValue: true }))}
                    />
                  ) : null}
                </div>

                {category === "automotive" ? (
                  <fieldset className="mt-8 border-t border-border pt-8">
                    <legend className="sr-only">{c.form.assistedLegend}</legend>
                    <p className="text-sm font-semibold text-navy">{c.form.assistedLegend}</p>
                    <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                      {[
                        { value: false, label: c.form.assistedNo },
                        { value: true, label: c.form.assistedYes },
                      ].map((opt) => (
                        <label
                          key={String(opt.value)}
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm font-medium transition-colors",
                            assistedPurchase === opt.value
                              ? "border-primary bg-primary/[0.06] text-navy"
                              : "border-border bg-white text-muted-foreground hover:border-primary/40 hover:bg-muted/50",
                          )}
                        >
                          <input
                            type="radio"
                            name={`${uid}-assisted`}
                            checked={assistedPurchase === opt.value}
                            onChange={() => {
                              setAssistedPurchase(opt.value)
                              track("calculator_assisted_toggle", { assisted: opt.value })
                            }}
                            className="peer sr-only"
                          />
                          <span
                            aria-hidden
                            className={cn(
                              "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2",
                              assistedPurchase === opt.value ? "border-primary" : "border-muted-foreground/40",
                            )}
                          >
                            {assistedPurchase === opt.value ? (
                              <span className="h-2 w-2 rounded-full bg-primary" />
                            ) : null}
                          </span>
                          {opt.label}
                        </label>
                      ))}
                    </div>

                    <AnimatePresence initial={false}>
                      {assistedPurchase ? (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
                          className="overflow-hidden text-sm leading-relaxed text-muted-foreground"
                        >
                          <span className="mt-3 flex gap-2">
                            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                            {c.form.assistedNote}
                          </span>
                        </motion.p>
                      ) : null}
                    </AnimatePresence>
                  </fieldset>
                ) : null}
              </>
            )}
          </div>

          {/* Sticky on desktop so the figure stays beside the fields being
              edited; static on mobile, immediately below the inputs. */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ResultPanel result={result} category={category} />
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * Numeric input with an optional prefix or suffix affordance.
 *
 * `inputMode="decimal"` brings up the numeric keypad on mobile while still
 * accepting a comma separator, which an Argentine keyboard produces and
 * `parseAmount` normalises. A `type="number"` input would reject the comma
 * outright and silently blank the field.
 */
function NumberField({
  id,
  label,
  value,
  onChange,
  onBlur,
  help,
  error,
  prefix,
  suffix,
  placeholder,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  onBlur: () => void
  help: string
  error: string | null
  prefix?: string
  suffix?: string
  placeholder?: string
}) {
  const helpId = `${id}-help`
  const errorId = `${id}-error`

  return (
    <div className="min-w-0">
      <label htmlFor={id} className="text-sm font-semibold text-navy">
        {label}
      </label>
      <div
        className={cn(
          "mt-2 flex items-center gap-2 rounded-xl border bg-white px-3.5 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
          error ? "border-destructive" : "border-border",
        )}
      >
        {prefix ? <span className="shrink-0 text-sm font-medium text-muted-foreground">{prefix}</span> : null}
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-describedby={error ? `${errorId} ${helpId}` : helpId}
          aria-invalid={error ? true : undefined}
          className="min-w-0 flex-1 bg-transparent py-3 text-base text-navy outline-none placeholder:text-muted-foreground/50"
        />
        {suffix ? <span className="shrink-0 text-sm font-medium text-muted-foreground">{suffix}</span> : null}
      </div>

      {/* The live region is always in the DOM so a message added to it later is
          announced. Rendering the <p> only on error would insert a new region
          that assistive tech has not been observing, and the text would be
          missed. Empty, it collapses to nothing. */}
      <p id={errorId} aria-live="polite">
        {error ? <span className="mt-2 block text-sm font-medium text-destructive">{error}</span> : null}
      </p>
      <p id={helpId} className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {help}
      </p>
    </div>
  )
}

/** Japan's manual-quote panel, shown in place of the numeric fields. */
function JapanPanel({ heading, body, cta }: { heading: string; body: string; cta: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="mt-8 rounded-2xl border border-primary/20 bg-primary/[0.05] p-6"
    >
      <h3 className="font-display text-xl leading-tight text-navy">{heading}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
      <Link
        href={`${JAPAN_PATH}#${JAPAN_REQUEST_ANCHOR}`}
        onClick={() => track("calculator_japan_cta_click", {})}
        className={ctaClasses("primary", "mt-5")}
      >
        {cta}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </Link>
    </motion.div>
  )
}

/**
 * The estimate.
 *
 * Electronics compares a per-kilo figure against a share of declared value and
 * charges the higher one. That comparison is intentionally absent here: this
 * panel renders one total and, for assisted automotive purchases, the two rows
 * that genuinely add up to it. The customer never sees a losing calculation or
 * the phrase "whichever is greater".
 */
function ResultPanel({
  result,
  category,
}: {
  result: ReturnType<typeof calculateQuote>
  category: QuoteCategory
}) {
  const { t } = useI18n()
  const c = t.calculator
  const lineLabel = { shipping: c.result.lineShipping, assistedPurchase: c.result.lineAssisted }

  return (
    <div className="overflow-hidden rounded-[1.75rem] bg-navy text-white shadow-[0_30px_70px_-40px_rgba(7,27,58,0.6)]">
      <div className="p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">{c.result.heading}</p>

        {/* Spoken announcement of the outcome.
            
            Deliberately a separate node from the figure below rather than
            aria-live on the figure itself: the figure sits inside an
            AnimatePresence keyed on the total, so every change unmounts one
            element and mounts another. A live region that is itself being torn
            down and recreated announces unreliably, and can read out the removal
            as well as the addition. This node is never unmounted — only its text
            changes — which is exactly what a live region needs.

            It stays mounted and empty in the initial state rather than appearing
            with the first result, because assistive tech only announces
            mutations to regions it was already observing.

            The empty state is not announced: it is static instructional text, so
            re-reading it on every keystroke would be noise, not feedback. */}
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {result.status === "priced"
            ? c.result.announce(formatUsd(result.total))
            : result.status === "manual"
              ? c.result.announceQuoted
              : ""}
        </p>

        {result.status === "priced" ? (
          <>
            {/* Keyed on the total so the figure animates when it changes rather
                than only on first mount. */}
            <AnimatePresence mode="wait">
              <motion.div
                key={result.total}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="mt-5"
              >
                <p className="text-sm text-white/65">{c.result.label}</p>
                <p className="mt-1 font-display text-5xl leading-none tracking-[-0.01em] sm:text-6xl">
                  {formatUsd(result.total)}
                </p>
              </motion.div>
            </AnimatePresence>

            {result.lines.length > 1 ? (
              <dl className="mt-7 space-y-2.5 border-t border-white/12 pt-5 text-sm">
                {result.lines.map((line) => (
                  <div key={line.id} className="flex items-baseline justify-between gap-4">
                    <dt className="text-white/65">{lineLabel[line.id]}</dt>
                    <dd className="font-medium tabular-nums">{formatUsd(line.amount)}</dd>
                  </div>
                ))}
                <div className="flex items-baseline justify-between gap-4 border-t border-white/12 pt-2.5">
                  <dt className="font-semibold">{c.result.lineTotal}</dt>
                  <dd className="font-semibold tabular-nums">{formatUsd(result.total)}</dd>
                </div>
              </dl>
            ) : null}

            {/* Explains a tier the weight already forced, so the number above
                never looks like it ignored the selected option. */}
            {result.appliedTier && result.appliedTier !== category ? (
              <p className="mt-6 flex gap-2 rounded-xl bg-white/[0.07] p-4 text-sm leading-relaxed text-white/80">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-white/70" aria-hidden />
                {result.appliedTier === "clothingHeavy" ? c.tierNotice.toHeavy : c.tierNotice.toLight}
              </p>
            ) : null}
          </>
        ) : (
          <p className="mt-5 text-lg leading-relaxed text-white/70">
            {result.status === "manual" ? c.japan.body : c.result.empty}
          </p>
        )}

        <p className="mt-7 border-t border-white/12 pt-5 text-xs leading-relaxed text-white/50">
          {c.result.disclaimer}
        </p>

        <div className="mt-7 flex flex-col gap-3">
          <Link
            href="/#quote"
            onClick={() => track("calculator_quote_cta_click", { category })}
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-navy transition-transform hover:-translate-y-0.5"
          >
            {c.result.ctaPrimary}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
          <Link
            href="/registro"
            onClick={() => track("calculator_register_cta_click", { category })}
            className="inline-flex items-center justify-center rounded-xl border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            {c.result.ctaSecondary}
          </Link>
        </div>
      </div>
    </div>
  )
}
