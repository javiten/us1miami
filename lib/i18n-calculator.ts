import { SHIPPING_RATES, formatUsd } from "@/lib/shipping-rates"
import type { WhatsappQuoteDetails } from "@/lib/calculator"

/**
 * Copy for /calculator, in English and Spanish.
 *
 * `calculatorEs` is typed as `CalculatorDictionary` (derived from the English
 * object) so a missing or misspelled key is a compile-time error rather than a
 * blank string next to a price.
 *
 * Every rate in this file is interpolated from `SHIPPING_RATES` — no figure is
 * typed twice. That matters more here than on the vertical pages: the category
 * options advertise a rate *and* the engine charges one, and if the label and
 * the arithmetic could drift apart the calculator would quote a number the
 * customer did not agree to.
 *
 * `{pct}` and `{rate}` tokens are filled at render time by the components, which
 * keeps the sentence order translatable instead of concatenated in JSX.
 */

const {
  automotivePerKg,
  clothingUnder10Kg,
  clothing10KgOrMore,
  clothingVolumeThresholdKg,
  automotiveAssistedPurchasePercent,
  consumerProductsPerKg,
} = SHIPPING_RATES

export const calculatorEn = {
  meta: {
    title: "Calculate your shipping | US1 Miami",
    description:
      "Estimate the cost of shipping your purchase from Miami to Argentina. Choose a category, enter the weight, and get an instant estimate.",
    home: "Home",
    breadcrumb: "Calculate shipping",
  },

  hero: {
    eyebrow: "SHIPPING ESTIMATE",
    title: "Calculate your shipping",
    body: "Enter your purchase details and get an estimated cost to ship it to Argentina.",
    /** Sits under the lede as a reassurance, not a legal disclaimer. */
    note: "No sign-up required. Nothing is charged here.",
  },

  form: {
    heading: "Your shipment",
    categoryLabel: "Category",
    categoryHint: "Pick the option that matches what you are shipping.",

    categories: {
      automotive: { label: "Auto parts", rate: `USD $${automotivePerKg}/kg` },
      clothingLight: { label: `Apparel — under ${clothingVolumeThresholdKg} kg`, rate: `USD $${clothingUnder10Kg}/kg` },
      clothingHeavy: {
        label: `Apparel — ${clothingVolumeThresholdKg} kg or more`,
        rate: `USD $${clothing10KgOrMore}/kg`,
      },
      electronics: { label: "Electronics", rate: "Based on weight and value" },
      // The only category with a `subtitle`. It is the catch-all, so it has to
      // show what belongs in it — the other four are self-describing.
      consumerProducts: {
        label: "Consumer Products",
        subtitle: "Makeup / Toys / Cases / Other",
        rate: `USD $${consumerProductsPerKg}/kg`,
      },
      japan: { label: "Purchases from Japan", rate: "Custom quote" },
    },

    weightLabel: "Total weight",
    weightUnit: "kg",
    weightPlaceholder: "2.5",
    weightHelp: "Decimals are fine — for example 2.5.",

    valueLabel: "Total purchase value",
    valuePrefix: "USD $",
    valuePlaceholder: "150.00",
    valueHelp:
      "Enter the final amount paid for the purchase, including the product, sales tax and seller shipping. Do not enter only the product price.",

    assistedLegend: "Would you like US1 Miami to make the purchase for you?",
    assistedNo: "No, I buy it myself",
    assistedYes: "Yes, buy it for me",
    assistedNote: "Enter the purchase total including the product, tax and the seller's shipping.",

    errors: {
      weightRequired: "Enter the total weight.",
      weightInvalid: "Enter a weight greater than 0.",
      valueRequired: "Enter the total purchase value.",
      valueInvalid: "Enter an amount greater than 0.",
    },
  },

  /**
   * Escape hatch below the category grid, for anything the five categories do
   * not cover.
   *
   * Deliberately not a sixth radio option: selecting it would put the form into
   * a state that can never produce an estimate, which is a dead end dressed up
   * as a choice. It is a link out to a human instead.
   */
  unlisted: {
    heading: "Is your product not listed in these categories?",
    body: "Send us an inquiry and we'll confirm the applicable rate and shipping conditions.",
    cta: "Send inquiry",
    /**
     * Prefilled WhatsApp message. The category tag the spec asks for rides in
     * the message body, which is the only way it actually reaches us — the site
     * has no intake form with a category field to populate.
     */
    inquiryMessage: "Hello US1 Miami, I'd like a shipping quote.\n\nCategory: Unlisted product\n\nMy product is:",
  },

  /**
   * Shown when the entered weight lands in a different apparel tier than the one
   * selected. The rate always follows the weight, so this explains a switch that
   * has already been applied rather than asking the customer to correct it.
   */
  tierNotice: {
    toHeavy: `Shipments of ${clothingVolumeThresholdKg} kg or more use our USD $${clothing10KgOrMore}/kg rate, so we applied it.`,
    toLight: `The USD $${clothing10KgOrMore}/kg rate needs ${clothingVolumeThresholdKg} kg or more, so this estimate uses the USD $${clothingUnder10Kg}/kg rate.`,
  },

  japan: {
    heading: "Japan is quoted individually",
    body: "Purchases from Japan need a custom quote based on the product, its origin and the shipping method.",
    cta: "Request a Japan quote",
  },

  result: {
    /** Panel heading, kept constant so the box does not retitle itself mid-typing. */
    heading: "Your estimate",
    empty: "Fill in the details to calculate your shipping.",
    label: "Estimated cost",
    /**
     * Spoken-only summaries for the live region. The visual panel updates
     * silently, so without these a screen reader user who changes the weight or
     * category is never told the price moved — and on a calculator the output is
     * the entire point. Kept to one short sentence because a polite region
     * re-reads the whole string on every settled change.
     */
    announce: (total: string) => `Estimated cost: ${total}.`,
    announceQuoted: "This category is quoted individually. Request a custom quote.",
    lineShipping: "Shipping",
    lineAssisted: `Assisted purchase (${automotiveAssistedPurchasePercent}%)`,
    lineTotal: "Estimated total",
    disclaimer:
      "This calculation is an estimate. The final price may vary depending on volumetric weight, dimensions, product restrictions, inspection and the particular conditions of the shipment.",
    ctaPrimary: "Continue on WhatsApp",
    /** Japan has no calculated price, so the action is to ask rather than to proceed. */
    ctaPrimaryQuoted: "Ask on WhatsApp",
    ctaSecondary: "Create my Miami address",

    /**
     * WhatsApp message assembled from the live calculator state.
     *
     * Each line is written only when its field arrived defined, so the
     * per-category rules live in the caller rather than here: apparel sends
     * `rate` and no `assisted`, automotive sends `assisted` and no `rate`. A
     * missing field does not print a blank line — it prints nothing.
     *
     * Electronics is the sensitive case: it sends only the total. The internal
     * weight-vs-percentage comparison never leaves this app.
     */
    whatsappMessage: (d: WhatsappQuoteDetails) => {
      // With no total there is no shipment to "move forward" with — Japan is an
      // enquiry. The greeting follows the CTA ("Ask on WhatsApp") instead of
      // contradicting it.
      const lines = [
        d.total === undefined
          ? "Hello US1 Miami! I'd like to ask about a shipment."
          : "Hello US1 Miami! I'd like to move forward with this shipment.",
        "",
        `Category: ${d.categoryLabel}`,
      ]
      if (d.weight) lines.push(`Total weight: ${d.weight} kg`)
      if (d.rate) lines.push(`Applicable rate: ${d.rate}`)
      if (d.commercialValue !== undefined) lines.push(`Total purchase value: USD ${formatUsd(d.commercialValue)}`)
      if (d.assisted !== undefined) lines.push(`Assisted purchase: ${d.assisted ? "Yes" : "No"}`)
      if (d.assistedFee !== undefined) {
        lines.push(`Assisted purchase fee (${automotiveAssistedPurchasePercent}%): USD ${formatUsd(d.assistedFee)}`)
      }
      if (d.shipping !== undefined) lines.push(`Estimated shipping: USD ${formatUsd(d.shipping)}`)
      if (d.total !== undefined) lines.push(`Estimated total: USD ${formatUsd(d.total)}`)
      lines.push(
        "",
        d.total === undefined
          ? "I'm sending these details from the US1 Miami calculator. I'd like to confirm the rate, availability and conditions."
          : "This calculation was generated from the US1 Miami calculator. I'd like to confirm availability, conditions and move forward with the shipment.",
      )
      return lines.join("\n")
    },
  },

  visual: {
    eyebrow: "WHAT HAPPENS NEXT",
    title: "Weighed, consolidated and flown",
    body: "Your estimate is based on the same weight we measure at our Miami warehouse. Once your package arrives we photograph it, confirm the weight and consolidate it with anything else waiting for you.",
    imageAlt: "A US1 Miami warehouse operator weighing a parcel on a digital scale before consolidation",
    // `label`/`detail` matches VerticalHandlingBand's `points` prop so this
    // section reuses that component instead of adapting its shape in JSX.
    points: [
      { label: "Received and weighed", detail: "We record the real weight and dimensions the moment your package lands." },
      { label: "Consolidated", detail: "Several purchases travel as one shipment, so you pay the weight once." },
      { label: "Flown to Argentina", detail: "Air cargo out of Miami with tracking from our warehouse to your door." },
    ],
  },

  finalCta: {
    title: "Ready to send it?",
    body: "Request a quote with your real details and we will confirm the final cost before anything ships.",
    primary: "Request my quote",
    secondary: "Create my Miami address",
  },
}

// No `as const` on the object above, matching the other dictionaries. It would
// narrow every value to its own literal type, so the Spanish copy could not
// satisfy this type and the `points` arrays would come out readonly.
export type CalculatorDictionary = typeof calculatorEn

export const calculatorEs: CalculatorDictionary = {
  meta: {
    title: "Calculá tu envío | US1 Miami",
    description:
      "Estimá el costo de enviar tu compra desde Miami a Argentina. Elegí la categoría, ingresá el peso y obtené una estimación al instante.",
    home: "Inicio",
    breadcrumb: "Calculá tu envío",
  },

  hero: {
    eyebrow: "COSTO ESTIMADO",
    title: "Calculá tu envío",
    body: "Ingresá los datos de tu compra y obtené un costo estimado de envío a Argentina.",
    note: "No necesitás registrarte. Acá no se cobra nada.",
  },

  form: {
    heading: "Tu envío",
    categoryLabel: "Categoría",
    categoryHint: "Elegí la opción que corresponde a lo que vas a enviar.",

    categories: {
      automotive: { label: "Repuestos de auto", rate: `USD $${automotivePerKg}/kg` },
      clothingLight: {
        label: `Indumentaria — menos de ${clothingVolumeThresholdKg} kg`,
        rate: `USD $${clothingUnder10Kg}/kg`,
      },
      clothingHeavy: {
        label: `Indumentaria — ${clothingVolumeThresholdKg} kg o más`,
        rate: `USD $${clothing10KgOrMore}/kg`,
      },
      electronics: { label: "Electrónica", rate: "Según peso y valor" },
      consumerProducts: {
        label: "Productos de consumo",
        subtitle: "Maquillaje / Juguetes / Fundas / Otros",
        rate: `USD $${consumerProductsPerKg}/kg`,
      },
      japan: { label: "Compras desde Japón", rate: "Cotización personalizada" },
    },

    weightLabel: "Peso total",
    weightUnit: "kg",
    weightPlaceholder: "2,5",
    weightHelp: "Podés usar decimales — por ejemplo 2,5.",

    valueLabel: "Valor total de la compra",
    valuePrefix: "USD $",
    valuePlaceholder: "150,00",
    valueHelp:
      "Ingresá el total final pagado por la compra, incluyendo producto, impuestos (tax) y envío del vendedor. No ingreses solamente el precio del producto.",

    assistedLegend: "¿Querés que US1 Miami realice la compra por vos?",
    assistedNo: "No, yo realizo la compra",
    assistedYes: "Sí, comprar por mí",
    assistedNote: "Ingresá el total de la compra incluyendo producto, tax y envío del proveedor.",

    errors: {
      weightRequired: "Ingresá el peso total.",
      weightInvalid: "Ingresá un peso mayor a 0.",
      valueRequired: "Ingresá el valor total de la compra.",
      valueInvalid: "Ingresá un monto mayor a 0.",
    },
  },

  unlisted: {
    heading: "¿Tu producto no figura en estas categorías?",
    body: "Envianos una consulta y te confirmamos la tarifa y condiciones aplicables.",
    cta: "Enviar consulta",
    inquiryMessage: "Hola US1 Miami, quiero cotizar un envío.\n\nCategoría: Producto no listado\n\nMi producto es:",
  },

  tierNotice: {
    toHeavy: `Para envíos de ${clothingVolumeThresholdKg} kg o más aplica nuestra tarifa desde USD $${clothing10KgOrMore}/kg, así que la usamos.`,
    toLight: `La tarifa de USD $${clothing10KgOrMore}/kg requiere ${clothingVolumeThresholdKg} kg o más, así que esta estimación usa la tarifa de USD $${clothingUnder10Kg}/kg.`,
  },

  japan: {
    heading: "Japón se cotiza de forma individual",
    body: "Las compras desde Japón requieren una cotización personalizada según el producto, origen y método de envío.",
    cta: "Solicitar cotización Japón",
  },

  result: {
    heading: "Tu estimación",
    empty: "Completá los datos para calcular tu envío.",
    label: "Costo estimado",
    announce: (total: string) => `Costo estimado: ${total}.`,
    announceQuoted: "Esta categoría se cotiza de forma individual. Pedí una cotización personalizada.",
    lineShipping: "Envío",
    lineAssisted: `Compra asistida (${automotiveAssistedPurchasePercent}%)`,
    lineTotal: "Total estimado",
    disclaimer:
      "Este cálculo es una estimación. El precio final puede variar según peso volumétrico, dimensiones, restricciones del producto, inspección y condiciones particulares del envío.",
    ctaPrimary: "Continuar por WhatsApp",
    /** Japón no tiene precio calculado, así que la acción es consultar, no continuar. */
    ctaPrimaryQuoted: "Consultar por WhatsApp",
    ctaSecondary: "Crear mi dirección en Miami",

    /**
     * Mensaje de WhatsApp armado con los datos vivos de la calculadora.
     *
     * Cada línea se escribe sólo si su campo llegó definido, así que las reglas
     * por categoría viven en quien llama, no acá: indumentaria manda `rate` y no
     * `assisted`, automotor manda `assisted` y no `rate`. Un campo ausente no
     * imprime una línea vacía — no imprime nada.
     *
     * Electrónica es el caso delicado: manda sólo el total. La comparación
     * interna entre peso y porcentaje del valor nunca sale de acá.
     */
    whatsappMessage: (d: WhatsappQuoteDetails) => {
      // Sin total no hay envío que "avanzar" — Japón se consulta. El saludo
      // acompaña al CTA ("Consultar por WhatsApp") en lugar de contradecirlo.
      const lines = [
        d.total === undefined
          ? "Hola US1 Miami! Quiero consultar por un envío."
          : "Hola US1 Miami! Quiero avanzar con este envío.",
        "",
        `Categoría: ${d.categoryLabel}`,
      ]
      if (d.weight) lines.push(`Peso total: ${d.weight} kg`)
      if (d.rate) lines.push(`Tarifa aplicada: ${d.rate}`)
      if (d.commercialValue !== undefined) lines.push(`Valor total de la compra: USD ${formatUsd(d.commercialValue)}`)
      if (d.assisted !== undefined) lines.push(`Compra asistida: ${d.assisted ? "Sí" : "No"}`)
      if (d.assistedFee !== undefined) {
        lines.push(`Cargo compra asistida (${automotiveAssistedPurchasePercent}%): USD ${formatUsd(d.assistedFee)}`)
      }
      if (d.shipping !== undefined) lines.push(`Envío estimado: USD ${formatUsd(d.shipping)}`)
      if (d.total !== undefined) lines.push(`Total estimado: USD ${formatUsd(d.total)}`)
      lines.push(
        "",
        d.total === undefined
          ? "Envío estos datos desde la calculadora de US1 Miami. Quiero confirmar la tarifa, disponibilidad y condiciones."
          : "Este cálculo fue generado desde la calculadora de US1 Miami. Quiero confirmar disponibilidad, condiciones y avanzar con el envío.",
      )
      return lines.join("\n")
    },
  },

  visual: {
    eyebrow: "QUÉ PASA DESPUÉS",
    title: "Pesado, consolidado y despachado",
    body: "Tu estimación usa el mismo peso que medimos en nuestro depósito de Miami. Cuando tu paquete llega lo fotografiamos, confirmamos el peso y lo consolidamos con todo lo que te esté esperando.",
    imageAlt: "Un operario de US1 Miami pesando un paquete en una balanza digital antes de consolidarlo",
    points: [
      {
        label: "Recibido y pesado",
        detail: "Registramos el peso y las dimensiones reales en el momento en que llega tu paquete.",
      },
      { label: "Consolidado", detail: "Varias compras viajan como un solo envío, así pagás el peso una sola vez." },
      {
        label: "Enviado a Argentina",
        detail: "Carga aérea desde Miami con seguimiento desde nuestro depósito hasta tu puerta.",
      },
    ],
  },

  finalCta: {
    title: "¿Listo para enviarlo?",
    body: "Pedí tu cotización con los datos reales y confirmamos el costo final antes de despachar.",
    primary: "Pedir mi cotización",
    secondary: "Crear mi dirección en Miami",
  },
}
