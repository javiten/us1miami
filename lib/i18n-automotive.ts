/**
 * Translations for the US1 Miami Automotive vertical (/automotive) and the
 * automotive homepage hero slide.
 *
 * Kept in its own module so `lib/i18n.ts` stays readable. `automotiveEn` is the
 * source of truth for the shape; `automotiveEs` must satisfy the same type, so
 * TypeScript fails the build if a string is ever left untranslated.
 *
 * Commercial values (49/kg, 3%) are interpolated from `lib/automotive.ts` —
 * never typed literally into copy.
 */

import { ASSISTED_PURCHASE_FEE_PCT, AUTOMOTIVE_RATE_PER_KG, VIN_LENGTH } from "@/lib/automotive"

const RATE = `USD ${AUTOMOTIVE_RATE_PER_KG}`
const FEE = `${ASSISTED_PURCHASE_FEE_PCT}%`

export const automotiveEn = {
  meta: {
    title: "Automotive Parts from the USA to Argentina | US1 Miami",
    description: `Purchase automotive parts in the United States and ship them to Argentina with US1 Miami. Shipping from ${RATE}/kg and optional assisted purchasing for a ${FEE} fee.`,
    ogTitle: "US1 Miami Automotive — U.S. Parts, Delivered in Argentina",
    ogDescription: `Source, buy and ship automotive parts from the U.S. market. Miami receiving, optional assisted purchasing at ${FEE}, air freight to Argentina from ${RATE}/kg.`,
    breadcrumb: "Automotive",
    home: "Home",
  },

  hero: {
    eyebrow: "US1 Miami Automotive",
    title: "The parts you need, directly from the United States.",
    description:
      "Access automotive parts, accessories and components available in the U.S. market. We can receive your purchases in Miami or purchase them on your behalf and coordinate delivery to Argentina.",
    primaryCta: "Request a Parts Quote",
    secondaryCta: "How It Works",
    shippingLabel: "Shipping from",
    shippingValue: `${RATE}`,
    perKg: "/kg",
    assistedLabel: "Assisted purchasing",
    assistedValue: FEE,
    assistedUnit: "per transaction",
    qualifier:
      "Rates are subject to the part type, weight, dimensions, category and applicable import conditions.",
    imageAlt:
      "Organized automotive parts warehouse with shelving, plain parts boxes, a brake rotor, a coil spring and an air filter arranged as a technical display",
    routeFrom: "Miami, FL",
    routeTo: "Argentina",
  },

  trust: [
    {
      title: "Specialized Suppliers",
      desc: "Access to U.S. platforms and distributors beyond the usual retail catalog.",
    },
    {
      title: "Miami Receiving",
      desc: "Your order arrives at our warehouse, where we log and photograph it.",
    },
    {
      title: "Assisted Purchasing",
      desc: `Optional ${FEE} service when you prefer us to place the order for you.`,
    },
    {
      title: "Shipping to Argentina",
      desc: `Air freight for eligible automotive shipments from ${RATE}/kg.`,
    },
  ],

  brands: {
    label: "Automotive brands and suppliers",
    disclaimer:
      "The brands shown are examples of products our customers commonly request. US1 Miami is an independent courier and assisted-purchasing service, and is not an authorized distributor of these brands. Displaying these names does not imply any affiliation with, authorization by, or sponsorship from their respective owners. All trademarks belong to their respective owners.",
  },

  intro: {
    eyebrow: "More options for your vehicle",
    title: "The U.S. automotive market, now within reach.",
    body: "US1 Miami Automotive connects customers, repair shops and professionals in Argentina with the extensive availability of parts in the U.S. market. We combine our operating experience, Miami infrastructure and access to specialized platforms to simplify sourcing, purchasing, receiving and shipping.",
    highlights: [
      { title: "For repair shops", desc: "Recurring orders, part-number sourcing and centralized tracking." },
      { title: "For professionals", desc: "Compatibility research support before you authorize a purchase." },
      { title: "For enthusiasts", desc: "Specialty and hard-to-find components from U.S. sellers." },
    ],
    imageAlt: "Automotive components and parts boxes organized on warehouse shelving in Miami",
  },

  options: {
    eyebrow: "Two ways to buy",
    title: "Choose how you want to purchase.",
    subtitle: "Both options use the same Miami warehouse and the same shipping service to Argentina.",
    self: {
      title: "Purchase directly",
      desc: "Complete the purchase through your preferred store or platform and use your US1 Miami address for delivery.",
      points: [
        "Use your personal Miami address",
        "We receive the order at our warehouse",
        "We verify the received package",
        "We coordinate shipment to Argentina",
        "No assisted-purchase fee",
      ],
      cta: "Get My Miami Address",
    },
    assisted: {
      label: "Optional service",
      title: "We purchase for you",
      desc: "Send us the link or part information. We confirm availability, price and the compatibility information provided before processing the purchase.",
      feeValue: FEE,
      feeUnit: "transaction fee",
      points: [
        "Sourcing assistance",
        "Purchase through our available accounts",
        "Cost confirmation before payment",
        "Direct receipt at our warehouse",
        "Centralized tracking",
      ],
      cta: "Request Assisted Purchase",
      note: `The ${FEE} fee applies to the merchandise transaction only. It is separate from shipping, taxes, supplier fees and any other applicable charges.`,
    },
  },

  how: {
    eyebrow: "How it works",
    title: "From sourcing the part to final delivery",
    steps: [
      {
        title: "Identify the part",
        desc: "Send the part number, VIN, product link or a clear description of what you need.",
      },
      {
        title: "Choose how to purchase",
        desc: "Buy it yourself, or ask US1 Miami to process the purchase on your behalf.",
      },
      {
        title: "We confirm the details",
        desc: "We review supplier, price, availability and the compatibility information available.",
      },
      {
        title: "We receive it in Miami",
        desc: "The order arrives at our warehouse, where we log and process the package.",
      },
      {
        title: "We prepare the shipment",
        desc: "We calculate weight, dimensions and applicable conditions before dispatch.",
      },
      {
        title: "You receive it in Argentina",
        desc: "We coordinate shipping and delivery according to the service available for your order.",
      },
    ],
  },

  categories: {
    eyebrow: "Parts categories",
    title: "What kind of parts can you request?",
    items: {
      engine: "Engine and Components",
      brakes: "Brakes",
      suspension: "Suspension and Steering",
      sensors: "Sensors and Electronics",
      transmission: "Transmission and Differential",
      filters: "Filters and Maintenance",
      lighting: "Lighting",
      airConditioning: "Air Conditioning",
      accessories: "Accessories",
      specialty: "Specialty Parts",
      partNumber: "Parts by Part Number",
      vinSpecific: "VIN-Specific Components",
    },
    note: "Acceptance of each product is subject to review based on dimensions, weight, materials, transportation restrictions and import conditions.",
  },

  sourcing: {
    eyebrow: "Automotive experience in Miami",
    title: "More than a receiving address.",
    body: "US1 Miami Automotive draws on the experience, infrastructure and commercial relationships developed within the automotive sector to offer a more specialized service than a traditional courier.",
    cards: [
      { title: "Part-number search", desc: "Send an OEM or aftermarket reference and we look for available options." },
      { title: "Compatibility information", desc: "We review and share the fitment data published by the supplier." },
      { title: "Access to multiple suppliers", desc: "We compare availability across specialized U.S. sellers." },
      { title: "Professional receiving", desc: "Every package is logged, weighed and measured on arrival." },
      { title: "Package photographs", desc: "Visual confirmation of what arrived before it ships." },
      { title: "Consolidation when convenient", desc: "Combine several parts into one shipment to reduce freight." },
    ],
    disclosure:
      "US1 Miami is an independent logistics provider. We are not an authorized dealer, official distributor or representative of any parts supplier or vehicle manufacturer.",
  },

  vin: {
    eyebrow: "Compatibility",
    title: "The more information we have, the better.",
    body: `To reduce errors, we recommend sending the complete ${VIN_LENGTH}-character VIN, part number, year, make, model, trim, engine and photographs of the component whenever they are available.`,
    checklist: [
      `${VIN_LENGTH}-character VIN`,
      "Year, make and model",
      "Engine and trim",
      "Part number",
      "Photos of the part",
      "Product link",
    ],
    disclaimer:
      "US1 Miami can assist with sourcing and reviewing the information available, but final compatibility must be confirmed before authorizing the purchase. Specialty or VIN-linked parts may not be returnable once ordered.",
  },

  pricing: {
    eyebrow: "Clear rates",
    title: "A flexible solution for every purchase.",
    shipping: {
      label: "Shipping",
      from: "From",
      value: RATE,
      unit: "/kg",
      desc: "Starting rate for eligible automotive shipments from Miami to Argentina.",
      includesTitle: "Included",
      includes: [
        "Miami receiving",
        "Package logging",
        "Storage per service conditions",
        "Dispatch preparation",
        "Order tracking",
      ],
    },
    assisted: {
      label: "Assisted purchasing",
      value: FEE,
      unit: "per transaction",
      desc: "Charged when US1 Miami makes the purchase on the customer's behalf.",
      includesTitle: "How it is calculated",
      includes: [
        "Calculated on the merchandise transaction value",
        "Does not include shipping",
        "Does not include taxes or supplier charges",
        "Purchase requires prior approval of the total",
      ],
    },
    disclaimer:
      "Published rates are starting values. The final price depends on the product, actual or volumetric weight, dimensions, value, supplier, destination, availability and applicable restrictions. Oversized, heavy, hazardous or restricted parts may require a special quote or may not be accepted.",
    cta: "Request an Automotive Quote",
  },

  form: {
    eyebrow: "Quote request",
    title: "Request a Parts Quote",
    subtitle:
      "Share as much detail as you can. The more information we receive, the more accurate the quote will be.",
    sections: {
      contact: "Contact details",
      vehicle: "Vehicle",
      part: "Part",
      purchase: "Purchase and attachments",
    },
    fields: {
      firstName: "First name",
      lastName: "Last name",
      email: "Email",
      phone: "WhatsApp / phone",
      boxNumber: "Customer Box number",
      year: "Vehicle year",
      make: "Make",
      model: "Model",
      trim: "Trim / version",
      engine: "Engine",
      vin: "VIN",
      partNumber: "Part number",
      productUrl: "Product URL",
      description: "Product description",
      quantity: "Quantity",
      purchaseMethod: "Purchase method",
      estimatedPrice: "Estimated product price (USD)",
      files: "Photos, screenshots or documents",
      notes: "Additional notes",
    },
    placeholders: {
      email: "you@email.com",
      phone: "+54 9 11 0000 0000",
      boxNumber: "US1-0000",
      year: "2019",
      make: "Toyota",
      model: "Hilux",
      trim: "SRX 4x4",
      engine: "2.8L Diesel",
      vin: "17-character VIN",
      partNumber: "e.g. 04465-0K260",
      productUrl: "https://",
      description: "Front brake pads, left headlight assembly, MAF sensor…",
      estimatedPrice: "120.00",
      notes: "Anything else we should know",
    },
    optional: "Optional",
    purchaseMethods: {
      SELF: "I will purchase directly",
      ASSISTED: "I want US1 Miami to purchase it for me",
      UNDECIDED: "I need help deciding",
    },
    purchaseMethodHints: {
      SELF: "You buy it and ship it to your Miami address.",
      ASSISTED: `We place the order for you. ${FEE} transaction fee.`,
      UNDECIDED: "We will walk you through both options.",
    },
    filesHint: "Up to {max} files, {size} MB each. JPG, PNG, WEBP, HEIC or PDF.",
    filesEmpty: "No files selected",
    removeFile: "Remove file",
    consent:
      "I confirm that the information provided is correct and I understand that the quote is subject to availability, compatibility, weight, dimensions and applicable restrictions.",
    submit: "Submit Request",
    submitting: "Sending…",
    successTitle: "Request received",
    success:
      "We received your request. Our team will review the part information and contact you using the details provided.",
    successAgain: "Submit another request",
    errorTitle: "We could not send your request",
    errorSummary: "Please review the highlighted fields.",
    errors: {
      required: "This field is required",
      email: "Enter a valid email address",
      phone: "Enter a valid phone number",
      url: "Enter a valid URL starting with http:// or https://",
      vin: `The VIN must be exactly ${VIN_LENGTH} characters`,
      year: "Enter a valid year",
      quantity: "Enter a quantity between 1 and 999",
      price: "Enter a valid amount",
      consent: "You must accept this to continue",
      fileType: "Unsupported file type",
      fileSize: "File exceeds the maximum size",
      fileCount: "Too many files",
      generic: "Something went wrong. Your information was kept — please try again.",
    },
  },

  faq: {
    eyebrow: "Automotive FAQ",
    title: "Questions about parts and shipping",
    items: [
      {
        q: "Do I have to buy the part through US1 Miami?",
        a: "No. You can buy it yourself from any store and simply use your US1 Miami address for delivery. Assisted purchasing is an optional service for when you prefer us to place the order.",
      },
      {
        q: `How does the ${FEE} fee work?`,
        a: `The ${FEE} fee is calculated on the merchandise transaction value and applies only when US1 Miami places the order on your behalf. It does not include shipping, taxes, supplier charges or any other cost, and we always confirm the total with you before paying.`,
      },
      {
        q: `Is shipping always ${RATE} per kg?`,
        a: `${RATE}/kg is a starting rate for eligible automotive shipments. The final price depends on the actual or volumetric weight, dimensions, product value, category and applicable restrictions, so we quote each request individually.`,
      },
      {
        q: "Can you verify whether a part fits my vehicle?",
        a: "We can help review the information published by the supplier, but we cannot guarantee compatibility. Final fitment must be confirmed before you authorize the purchase, which is why we ask for the VIN, part number and vehicle details.",
      },
      {
        q: "Can I ship a used part?",
        a: "Used parts can often be shipped, but they require review. Components containing fluids, residual fuel or oil may need to be drained and documented, and some used items are subject to additional import conditions.",
      },
      {
        q: "Do you accept engines, transmissions or heavy parts?",
        a: "Oversized and heavy components require a special quote. Weight, dimensions, packaging, residual fluids and carrier restrictions all affect whether an item can be accepted and how it must be shipped.",
      },
      {
        q: "What happens if the supplier sends the wrong part?",
        a: "The supplier's return and warranty policy applies. We can document what arrived with photographs and measurements to support your claim, but the resolution — refund, replacement or restocking fee — is determined by the seller.",
      },
      {
        q: "Can VIN-specific parts be returned?",
        a: "Often they cannot. Parts ordered against a specific VIN, as well as special-order and electronic components, are frequently non-returnable once the supplier processes them. Please confirm the details carefully before authorizing a purchase.",
      },
      {
        q: "Can I consolidate several parts?",
        a: "Yes. When it is convenient we combine multiple parts into a single shipment to reduce freight cost, provided the items are compatible for consolidated transport.",
      },
      {
        q: "How long does shipping to Argentina take?",
        a: "Transit time begins once the item has been received and processed at our Miami warehouse. Timing varies by product category, documentation and the service available for each shipment, so we confirm an estimate with your quote rather than promising a fixed transit time for every automotive order.",
      },
      {
        q: "Can you buy from any supplier?",
        a: "We work with a range of U.S. platforms and sellers, but not every supplier can be used. Some require a local account, a commercial relationship or will not sell certain items for export. We confirm feasibility before processing a purchase.",
      },
      {
        q: "What information do you need to quote?",
        a: "Ideally the part number or product link, the vehicle year, make, model, trim and engine, the complete VIN when available, the quantity and photos of the component. Anything you can add reduces the risk of ordering an incorrect item.",
      },
    ],
  },

  finalCta: {
    eyebrow: "US1 Miami Automotive",
    title: "Find the part. We'll help with the rest.",
    description:
      "Send the part details and receive a personalized quote covering purchasing, receiving and shipping.",
    primaryCta: "Request a Quote",
    secondaryCta: "Get My Miami Address",
  },
}

/**
 * Note: `automotiveEn` deliberately avoids `as const`. Widened string types are
 * what allow `automotiveEs` to be checked structurally (same keys, same shape)
 * rather than being required to repeat the English literals.
 */
export type AutomotiveDictionary = typeof automotiveEn

export const automotiveEs: AutomotiveDictionary = {
  meta: {
    title: "Repuestos de USA a Argentina | US1 Miami Automotive",
    description: `Comprá repuestos automotrices en Estados Unidos y recibilos en Argentina con US1 Miami. Envíos desde ${RATE}/kg y compra asistida opcional por ${FEE}.`,
    ogTitle: "US1 Miami Automotive — Repuestos de USA, entregados en Argentina",
    ogDescription: `Buscá, comprá y enviá repuestos del mercado estadounidense. Recepción en Miami, compra asistida opcional del ${FEE} y envío aéreo a Argentina desde ${RATE}/kg.`,
    breadcrumb: "Automotive",
    home: "Inicio",
  },

  hero: {
    eyebrow: "US1 Miami Automotive",
    title: "Los repuestos que necesitás, directamente desde Estados Unidos.",
    description:
      "Accedé a repuestos, accesorios y componentes disponibles en el mercado estadounidense. Podemos recibir tus compras en Miami o gestionar la compra por vos y enviarla a Argentina.",
    primaryCta: "Cotizar un repuesto",
    secondaryCta: "Cómo funciona",
    shippingLabel: "Envíos desde",
    shippingValue: `${RATE}`,
    perKg: "/kg",
    assistedLabel: "Compra asistida",
    assistedValue: FEE,
    assistedUnit: "por transacción",
    qualifier:
      "Tarifa sujeta al tipo de pieza, peso, dimensiones, categoría y condiciones de importación.",
    imageAlt:
      "Depósito de repuestos automotrices organizado con estanterías, cajas neutras, un disco de freno, un resorte de suspensión y un filtro de aire dispuestos como una exhibición técnica",
    routeFrom: "Miami, FL",
    routeTo: "Argentina",
  },

  trust: [
    {
      title: "Proveedores especializados",
      desc: "Acceso a plataformas y distribuidores de Estados Unidos más allá del retail habitual.",
    },
    {
      title: "Recepción en Miami",
      desc: "Tu pedido llega a nuestro warehouse, donde lo registramos y fotografiamos.",
    },
    {
      title: "Compra asistida",
      desc: `Servicio opcional del ${FEE} cuando preferís que hagamos el pedido por vos.`,
    },
    {
      title: "Envío a Argentina",
      desc: `Envío aéreo para cargas automotrices elegibles desde ${RATE}/kg.`,
    },
  ],

  brands: {
    label: "Marcas y proveedores del sector",
    disclaimer:
      "Las marcas mostradas son ejemplos de productos que nuestros clientes solicitan habitualmente. US1 Miami es un servicio independiente de courier y compra asistida, y no es distribuidor autorizado de estas marcas. Su mención no implica afiliación, autorización ni patrocinio por parte de sus titulares. Todas las marcas pertenecen a sus respectivos propietarios.",
  },

  intro: {
    eyebrow: "Más opciones para tu vehículo",
    title: "El mercado automotriz de Estados Unidos, ahora más cerca.",
    body: "US1 Miami Automotive conecta a clientes, talleres y profesionales de Argentina con la enorme disponibilidad de repuestos del mercado estadounidense. Utilizamos nuestra experiencia operativa, nuestra infraestructura en Miami y el acceso a plataformas especializadas para simplificar la búsqueda, compra, recepción y envío de cada pedido.",
    highlights: [
      { title: "Para talleres", desc: "Pedidos recurrentes, búsqueda por número de parte y seguimiento centralizado." },
      { title: "Para profesionales", desc: "Apoyo en la revisión de compatibilidad antes de autorizar la compra." },
      { title: "Para entusiastas", desc: "Componentes especiales y difíciles de encontrar en vendedores de USA." },
    ],
    imageAlt: "Componentes automotrices y cajas de repuestos organizados en estanterías del warehouse de Miami",
  },

  options: {
    eyebrow: "Dos formas de comprar",
    title: "Elegí cómo querés comprar.",
    subtitle: "Las dos opciones usan el mismo warehouse en Miami y el mismo servicio de envío a Argentina.",
    self: {
      title: "Comprás directamente",
      desc: "Realizás la compra en la tienda o plataforma que prefieras y utilizás tu dirección de US1 Miami para la entrega.",
      points: [
        "Usás tu dirección personal de Miami",
        "Recibimos el pedido en nuestro warehouse",
        "Verificamos el paquete recibido",
        "Coordinamos el envío a Argentina",
        "Sin cargo de compra asistida",
      ],
      cta: "Crear mi dirección",
    },
    assisted: {
      label: "Servicio opcional",
      title: "Compramos por vos",
      desc: "Nos enviás el enlace o los datos del repuesto. Confirmamos disponibilidad, precio y compatibilidad informada antes de procesar la compra.",
      feeValue: FEE,
      feeUnit: "de cargo por transacción",
      points: [
        "Asistencia con la búsqueda",
        "Compra mediante nuestras cuentas disponibles",
        "Confirmación del costo antes de pagar",
        "Recepción directa en nuestro warehouse",
        "Seguimiento centralizado",
      ],
      cta: "Solicitar compra asistida",
      note: `El cargo del ${FEE} se aplica únicamente sobre la transacción de mercadería. Es independiente del envío, impuestos, cargos del proveedor y cualquier otro costo aplicable.`,
    },
  },

  how: {
    eyebrow: "Cómo funciona",
    title: "De la búsqueda del repuesto a la entrega",
    steps: [
      {
        title: "Identificá el repuesto",
        desc: "Enviá el número de parte, VIN, enlace del producto o una descripción clara de lo que necesitás.",
      },
      {
        title: "Elegí cómo comprar",
        desc: "Podés comprar directamente o solicitar que US1 Miami procese la compra por vos.",
      },
      {
        title: "Confirmamos los detalles",
        desc: "Revisamos proveedor, precio, disponibilidad y la información de compatibilidad disponible.",
      },
      {
        title: "Recibimos en Miami",
        desc: "El pedido llega a nuestro warehouse, donde registramos y procesamos el paquete.",
      },
      {
        title: "Preparamos el envío",
        desc: "Calculamos peso, dimensiones y condiciones aplicables antes de despacharlo.",
      },
      {
        title: "Recibís en Argentina",
        desc: "Coordinamos el envío y la entrega según el servicio disponible para tu pedido.",
      },
    ],
  },

  categories: {
    eyebrow: "Categorías de repuestos",
    title: "¿Qué tipo de repuestos podés solicitar?",
    items: {
      engine: "Motor y componentes",
      brakes: "Frenos",
      suspension: "Suspensión y dirección",
      sensors: "Sensores y electrónica",
      transmission: "Transmisión y diferencial",
      filters: "Filtros y mantenimiento",
      lighting: "Iluminación",
      airConditioning: "Aire acondicionado",
      accessories: "Accesorios",
      specialty: "Repuestos especiales",
      partNumber: "Piezas por número de parte",
      vinSpecific: "Componentes VIN-specific",
    },
    note: "La aceptación de cada producto está sujeta a revisión de dimensiones, peso, materiales, restricciones de transporte y condiciones de importación.",
  },

  sourcing: {
    eyebrow: "Experiencia automotriz en Miami",
    title: "No somos solamente una dirección de recepción.",
    body: "US1 Miami Automotive aprovecha la experiencia, infraestructura y relaciones comerciales desarrolladas dentro del sector automotriz para ofrecer un servicio más especializado que un courier tradicional.",
    cards: [
      { title: "Búsqueda por número de parte", desc: "Enviá una referencia OEM o alternativa y buscamos las opciones disponibles." },
      { title: "Información de compatibilidad", desc: "Revisamos y compartimos los datos de aplicación publicados por el proveedor." },
      { title: "Acceso a múltiples proveedores", desc: "Comparamos disponibilidad entre vendedores especializados de USA." },
      { title: "Recepción profesional", desc: "Cada paquete se registra, pesa y mide al ingresar." },
      { title: "Fotografías del paquete", desc: "Confirmación visual de lo que llegó antes de despacharlo." },
      { title: "Consolidación cuando conviene", desc: "Combinamos varios repuestos en un envío para reducir el flete." },
    ],
    disclosure:
      "US1 Miami es un proveedor logístico independiente. No somos concesionario autorizado, distribuidor oficial ni representante de ningún proveedor de repuestos o fabricante de vehículos.",
  },

  vin: {
    eyebrow: "Compatibilidad",
    title: "Cuanta más información tengamos, mejor.",
    body: `Para reducir errores, recomendamos enviar el VIN completo de ${VIN_LENGTH} caracteres, número de parte, año, marca, modelo, versión, motor y fotografías del componente cuando estén disponibles.`,
    checklist: [
      `VIN de ${VIN_LENGTH} caracteres`,
      "Año, marca y modelo",
      "Motor y versión",
      "Número de parte",
      "Fotos del repuesto",
      "Enlace del producto",
    ],
    disclaimer:
      "US1 Miami puede colaborar con la búsqueda y revisión de la información disponible, pero la compatibilidad final debe confirmarse antes de autorizar la compra. Las piezas especiales o asociadas a un VIN pueden no admitir devolución una vez ordenadas.",
  },

  pricing: {
    eyebrow: "Tarifas claras",
    title: "Una solución flexible para cada compra.",
    shipping: {
      label: "Envío",
      from: "Desde",
      value: RATE,
      unit: "/kg",
      desc: "Tarifa inicial para envíos automotrices elegibles desde Miami hacia Argentina.",
      includesTitle: "Incluye",
      includes: [
        "Recepción en Miami",
        "Registro del paquete",
        "Almacenamiento según condiciones del servicio",
        "Preparación para despacho",
        "Seguimiento del pedido",
      ],
    },
    assisted: {
      label: "Compra asistida",
      value: FEE,
      unit: "por transacción",
      desc: "Cargo aplicado cuando US1 Miami realiza la compra por cuenta del cliente.",
      includesTitle: "Cómo se calcula",
      includes: [
        "Calculado sobre el valor de la transacción de mercadería",
        "No incluye envío",
        "No incluye impuestos o cargos del proveedor",
        "La compra requiere aprobación previa del total",
      ],
    },
    disclaimer:
      "Las tarifas publicadas son valores iniciales. El precio final depende del producto, peso real o volumétrico, dimensiones, valor, proveedor, destino, disponibilidad y restricciones aplicables. Algunas piezas sobredimensionadas, pesadas, peligrosas o restringidas pueden requerir una cotización especial o no ser aceptadas.",
    cta: "Solicitar cotización automotriz",
  },

  form: {
    eyebrow: "Solicitud de cotización",
    title: "Cotizá tu repuesto",
    subtitle:
      "Contanos todo el detalle que puedas. Cuanta más información recibamos, más precisa será la cotización.",
    sections: {
      contact: "Datos de contacto",
      vehicle: "Vehículo",
      part: "Repuesto",
      purchase: "Compra y adjuntos",
    },
    fields: {
      firstName: "Nombre",
      lastName: "Apellido",
      email: "Email",
      phone: "WhatsApp / teléfono",
      boxNumber: "Número de Box",
      year: "Año del vehículo",
      make: "Marca",
      model: "Modelo",
      trim: "Versión",
      engine: "Motor",
      vin: "VIN",
      partNumber: "Número de parte",
      productUrl: "Enlace del producto",
      description: "Descripción del producto",
      quantity: "Cantidad",
      purchaseMethod: "Método de compra",
      estimatedPrice: "Precio estimado del producto (USD)",
      files: "Fotos, capturas o documentos",
      notes: "Notas adicionales",
    },
    placeholders: {
      email: "tu@email.com",
      phone: "+54 9 11 0000 0000",
      boxNumber: "US1-0000",
      year: "2019",
      make: "Toyota",
      model: "Hilux",
      trim: "SRX 4x4",
      engine: "2.8L Diesel",
      vin: "VIN de 17 caracteres",
      partNumber: "ej. 04465-0K260",
      productUrl: "https://",
      description: "Pastillas de freno delanteras, óptica izquierda, sensor MAF…",
      estimatedPrice: "120.00",
      notes: "Cualquier dato adicional que debamos saber",
    },
    optional: "Opcional",
    purchaseMethods: {
      SELF: "Compro directamente",
      ASSISTED: "Quiero que US1 Miami lo compre por mí",
      UNDECIDED: "Necesito ayuda para decidir",
    },
    purchaseMethodHints: {
      SELF: "Comprás vos y lo enviás a tu dirección de Miami.",
      ASSISTED: `Hacemos el pedido por vos. Cargo del ${FEE} por transacción.`,
      UNDECIDED: "Te explicamos las dos opciones.",
    },
    filesHint: "Hasta {max} archivos de {size} MB cada uno. JPG, PNG, WEBP, HEIC o PDF.",
    filesEmpty: "Ningún archivo seleccionado",
    removeFile: "Quitar archivo",
    consent:
      "Confirmo que la información proporcionada es correcta y entiendo que la cotización está sujeta a disponibilidad, compatibilidad, peso, dimensiones y restricciones aplicables.",
    submit: "Enviar solicitud",
    submitting: "Enviando…",
    successTitle: "Solicitud recibida",
    success:
      "Recibimos tu solicitud. Nuestro equipo revisará la información del repuesto y se comunicará con vos por los datos proporcionados.",
    successAgain: "Enviar otra solicitud",
    errorTitle: "No pudimos enviar tu solicitud",
    errorSummary: "Revisá los campos marcados.",
    errors: {
      required: "Este campo es obligatorio",
      email: "Ingresá un email válido",
      phone: "Ingresá un teléfono válido",
      url: "Ingresá una URL válida que empiece con http:// o https://",
      vin: `El VIN debe tener exactamente ${VIN_LENGTH} caracteres`,
      year: "Ingresá un año válido",
      quantity: "Ingresá una cantidad entre 1 y 999",
      price: "Ingresá un monto válido",
      consent: "Tenés que aceptarlo para continuar",
      fileType: "Tipo de archivo no admitido",
      fileSize: "El archivo supera el tamaño máximo",
      fileCount: "Demasiados archivos",
      generic: "Algo salió mal. Conservamos tus datos: probá de nuevo.",
    },
  },

  faq: {
    eyebrow: "Preguntas sobre Automotive",
    title: "Dudas sobre repuestos y envíos",
    items: [
      {
        q: "¿Tengo que comprar el repuesto a través de US1 Miami?",
        a: "No. Podés comprarlo vos en cualquier tienda y usar tu dirección de US1 Miami para la entrega. La compra asistida es un servicio opcional para cuando preferís que hagamos el pedido nosotros.",
      },
      {
        q: `¿Cómo funciona el cargo del ${FEE}?`,
        a: `El cargo del ${FEE} se calcula sobre el valor de la transacción de mercadería y se aplica solamente cuando US1 Miami realiza la compra por tu cuenta. No incluye envío, impuestos, cargos del proveedor ni otros costos, y siempre confirmamos el total con vos antes de pagar.`,
      },
      {
        q: `¿El envío siempre cuesta ${RATE} por kg?`,
        a: `${RATE}/kg es una tarifa inicial para envíos automotrices elegibles. El precio final depende del peso real o volumétrico, dimensiones, valor del producto, categoría y restricciones aplicables, por eso cotizamos cada pedido de forma individual.`,
      },
      {
        q: "¿Pueden verificar si una pieza es compatible con mi vehículo?",
        a: "Podemos ayudarte a revisar la información publicada por el proveedor, pero no podemos garantizar la compatibilidad. La aplicación final debe confirmarse antes de que autorices la compra: por eso pedimos el VIN, el número de parte y los datos del vehículo.",
      },
      {
        q: "¿Puedo enviar una pieza usada?",
        a: "En general las piezas usadas pueden enviarse, pero requieren revisión. Los componentes con fluidos, restos de combustible o aceite pueden necesitar drenaje y documentación, y algunos artículos usados están sujetos a condiciones de importación adicionales.",
      },
      {
        q: "¿Aceptan motores, transmisiones o piezas pesadas?",
        a: "Los componentes sobredimensionados y pesados requieren una cotización especial. El peso, las dimensiones, el embalaje, los fluidos residuales y las restricciones del transportista determinan si la pieza puede aceptarse y cómo debe enviarse.",
      },
      {
        q: "¿Qué sucede si el proveedor envía una pieza incorrecta?",
        a: "Se aplica la política de devoluciones y garantía del proveedor. Podemos documentar lo que llegó con fotografías y medidas para respaldar tu reclamo, pero la resolución —reintegro, reemplazo o cargo por reposición— la define el vendedor.",
      },
      {
        q: "¿Las piezas VIN-specific se pueden devolver?",
        a: "Muchas veces no. Las piezas pedidas contra un VIN específico, así como los componentes electrónicos y de pedido especial, con frecuencia no admiten devolución una vez que el proveedor las procesa. Confirmá bien los datos antes de autorizar la compra.",
      },
      {
        q: "¿Puedo consolidar varios repuestos?",
        a: "Sí. Cuando conviene combinamos varios repuestos en un solo envío para reducir el costo de flete, siempre que las piezas sean compatibles para transporte consolidado.",
      },
      {
        q: "¿Cuánto demora el envío a Argentina?",
        a: "El tiempo de tránsito comienza una vez que la pieza fue recibida y procesada en nuestro warehouse de Miami. El plazo varía según la categoría del producto, la documentación y el servicio disponible para cada envío, por eso confirmamos una estimación junto con tu cotización en lugar de prometer un tiempo fijo para todos los envíos automotrices.",
      },
      {
        q: "¿Pueden comprar en cualquier proveedor?",
        a: "Trabajamos con diversas plataformas y vendedores de Estados Unidos, pero no todos los proveedores pueden utilizarse. Algunos exigen una cuenta local, una relación comercial o no venden ciertos artículos para exportación. Confirmamos la viabilidad antes de procesar una compra.",
      },
      {
        q: "¿Qué información necesitan para cotizar?",
        a: "Idealmente el número de parte o el enlace del producto, el año, marca, modelo, versión y motor del vehículo, el VIN completo cuando esté disponible, la cantidad y fotos del componente. Todo lo que puedas agregar reduce el riesgo de pedir una pieza incorrecta.",
      },
    ],
  },

  finalCta: {
    eyebrow: "US1 Miami Automotive",
    title: "Encontrá el repuesto. Nosotros te ayudamos con el resto.",
    description:
      "Enviá los datos de la pieza y recibí una cotización personalizada para compra, recepción y envío.",
    primaryCta: "Cotizar ahora",
    secondaryCta: "Crear mi dirección en Miami",
  },
}
