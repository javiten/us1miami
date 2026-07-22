export type Locale = "es" | "en"

export const LOCALES: Locale[] = ["es", "en"]
export const DEFAULT_LOCALE: Locale = "en"
export const LOCALE_COOKIE = "us1-locale"

export function isLocale(value: unknown): value is Locale {
  return value === "es" || value === "en"
}

export function localeToHtmlLang(locale: Locale): string {
  return locale === "es" ? "es-AR" : "en-US"
}

const en = {
  nav: {
    how: "How it works",
    services: "Services",
    pricing: "Pricing",
    warehouse: "Warehouse",
    faq: "FAQ",
    quote: "Get a Quote",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
  },
  logo: {
    subtitle: "International Courier",
  },
  hero: {
    badge: "Miami → Argentina · Air Courier",
    titleLead: "Buy Anywhere.",
    titleHighlight: "Receive in Argentina.",
    description:
      "Shop from China, Japan, the USA or Europe. Ship everything to our Miami warehouse. We'll consolidate your packages and send them to Argentina by air courier in approximately 7 days.",
    primaryCta: "Get a Quote",
    secondaryCta: "Get your Miami Address",
    freebies: ["Package receiving free", "Storage free", "Consolidation free"],
    startingFrom: "Starting from",
    perKg: "/kg",
    deliveryIn: "Delivery in",
    deliveryValue: "≈ 7 Days",
    imageAlt: "Illustration of a Miami warehouse consolidating packages onto a cargo airplane bound for Argentina",
  },
  destinations: {
    eyebrow: "Trusted shopping destinations",
    title: "Buy from your favorite stores worldwide",
    subtitle: "We handle the rest.",
  },
  how: {
    eyebrow: "How it works",
    title: "From your cart to your door in six simple steps",
    steps: [
      { title: "Buy anywhere", desc: "Shop from any online store around the world." },
      { title: "Ship to your Miami address", desc: "Use your free US1 Trade address at checkout." },
      { title: "We receive your packages", desc: "Everything arrives safely at our warehouse." },
      { title: "We consolidate everything", desc: "Multiple boxes combined into one shipment." },
      { title: "Air courier shipment", desc: "Your consolidated package flies to Argentina." },
      { title: "Receive in Argentina", desc: "Delivered to your door in about 7 days." },
    ],
  },
  consolidate: {
    eyebrow: "Why consolidate",
    title: "Save money by consolidating your packages",
    description:
      "If you purchase from multiple stores, we'll combine everything into a single shipment so you save on shipping and receive everything together.",
    lowerCost: "Lower shipping cost",
  },
  services: {
    eyebrow: "Services",
    title: "Everything you need to shop the world",
    subtitle: "A complete logistics suite designed around a single, effortless experience.",
    items: [
      { title: "Package Receiving", desc: "We accept deliveries from every carrier to your Miami address." },
      { title: "Free Storage", desc: "Keep your items safely stored until you're ready to ship." },
      { title: "Package Consolidation", desc: "Combine multiple orders into a single, cost-efficient box." },
      { title: "Air Courier", desc: "Fast, reliable air freight from Miami direct to Argentina." },
      { title: "Express Delivery", desc: "Door-to-door delivery in approximately seven days." },
      { title: "Shopping Assistance", desc: "Need help buying abroad? Our team purchases on your behalf." },
    ],
  },
  pricing: {
    eyebrow: "Pricing",
    title: "Simple, transparent pricing",
    subtitle: "One clear rate per kilogram. No hidden receiving, storage or consolidation fees.",
    startingAt: "Starting at",
    unit: "USD / kg",
    transitLead: "Approximate transit time",
    transitValue: "7 Days",
    transitTail: "by air courier.",
    cta: "Request Quote",
    includesTitle: "Every shipment includes",
    included: [
      "Free package receiving",
      "Free storage in Miami",
      "Free package consolidation",
      "Door-to-door air courier",
    ],
  },
  warehouse: {
    eyebrow: "Warehouse",
    title: "Your packages are safe in Miami",
    description:
      "Our Miami warehouse receives, stores and consolidates your purchases at no additional cost before shipping them to Argentina.",
    points: ["Secure, monitored facility", "Fast intake & processing", "Prime Miami location"],
    imageAlt: "Bright, organized US1 Trade logistics warehouse in Miami with neatly shelved packages",
    overlayLabel: "Miami Warehouse",
    overlayValue: "Receiving · Storage · Consolidation",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Frequently asked questions",
    items: [
      {
        q: "How much does shipping cost?",
        a: "Pricing starts at USD $55 per kilogram by air courier. Package receiving, storage and consolidation are always free.",
      },
      {
        q: "How long does delivery take?",
        a: "Once your consolidated shipment leaves Miami, delivery to Argentina takes approximately 7 days.",
      },
      {
        q: "Can I buy from China?",
        a: "Yes. Shop from AliExpress, Alibaba, Temu and any other store, and ship everything to your Miami address.",
      },
      {
        q: "Can I buy from Japan?",
        a: "Absolutely. Stores like Rakuten and Yahoo! Japan are fully supported — just send your orders to your Miami address.",
      },
      {
        q: "Do you consolidate packages?",
        a: "Yes. We combine multiple orders into a single shipment at no cost, so you save on shipping and receive everything together.",
      },
      {
        q: "Is storage free?",
        a: "Yes. We store your packages in our Miami warehouse at no additional charge until you're ready to ship.",
      },
      {
        q: "Can I ship electronics?",
        a: "Yes, we handle electronics regularly. Contact our team for guidance on specific items and any handling requirements.",
      },
    ],
  },
  finalCta: {
    title: "Ready to start?",
    description: "Get your free Miami shipping address today and start buying from anywhere in the world.",
    cta: "Create My Address",
  },
  footer: {
    tagline: "International courier consolidating your purchases in Miami and delivering to Argentina by air.",
    contact: "Contact",
    location: "Location",
    locationValue: "Miami Warehouse, Florida",
    rights: "US1 Trade — International Courier. All rights reserved.",
  },
}

export type Dictionary = typeof en

const es: Dictionary = {
  nav: {
    how: "Cómo funciona",
    services: "Servicios",
    pricing: "Precios",
    warehouse: "Depósito",
    faq: "Preguntas",
    quote: "Pedí tu cotización",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    language: "Idioma",
  },
  logo: {
    subtitle: "Courier Internacional",
  },
  hero: {
    badge: "Miami → Argentina · Envío aéreo",
    titleLead: "Comprá donde quieras.",
    titleHighlight: "Recibí en Argentina.",
    description:
      "Comprá en China, Japón, Estados Unidos o Europa. Enviá todo a nuestro warehouse en Miami. Consolidamos tus paquetes y los enviamos a Argentina por courier aéreo en aproximadamente 7 días.",
    primaryCta: "Pedí tu cotización",
    secondaryCta: "Obtené tu dirección en Miami",
    freebies: ["Recepción gratis", "Almacenamiento gratis", "Consolidación gratis"],
    startingFrom: "Desde",
    perKg: "/kg",
    deliveryIn: "Entrega en",
    deliveryValue: "≈ 7 días",
    imageAlt: "Ilustración de un depósito en Miami consolidando paquetes en un avión de carga rumbo a Argentina",
  },
  destinations: {
    eyebrow: "Tiendas de confianza",
    title: "Comprá en tus tiendas favoritas de todo el mundo",
    subtitle: "Del resto nos encargamos nosotros.",
  },
  how: {
    eyebrow: "Cómo funciona",
    title: "De tu carrito a tu puerta en seis pasos simples",
    steps: [
      { title: "Comprá donde quieras", desc: "Comprá en cualquier tienda online del mundo." },
      { title: "Enviá a tu dirección en Miami", desc: "Usá tu dirección gratuita de US1 Trade al pagar." },
      { title: "Recibimos tus paquetes", desc: "Todo llega seguro a nuestro depósito." },
      { title: "Consolidamos todo", desc: "Combinamos varias cajas en un solo envío." },
      { title: "Envío por courier aéreo", desc: "Tu paquete consolidado viaja a Argentina." },
      { title: "Recibí en Argentina", desc: "Te lo entregamos en tu puerta en unos 7 días." },
    ],
  },
  consolidate: {
    eyebrow: "Por qué consolidar",
    title: "Ahorrá dinero consolidando tus paquetes",
    description:
      "Si comprás en varias tiendas, combinamos todo en un solo envío para que ahorres en el flete y recibas todo junto.",
    lowerCost: "Menor costo de envío",
  },
  services: {
    eyebrow: "Servicios",
    title: "Todo lo que necesitás para comprar en el mundo",
    subtitle: "Una suite logística completa pensada para una experiencia simple y sin vueltas.",
    items: [
      { title: "Recepción de paquetes", desc: "Aceptamos entregas de todos los transportistas en tu dirección de Miami." },
      { title: "Almacenamiento gratis", desc: "Guardamos tus productos de forma segura hasta que quieras enviarlos." },
      { title: "Consolidación de paquetes", desc: "Combinamos varios pedidos en una sola caja más económica." },
      { title: "Courier aéreo", desc: "Envío aéreo rápido y confiable desde Miami directo a Argentina." },
      { title: "Entrega exprés", desc: "Entrega puerta a puerta en aproximadamente siete días." },
      { title: "Asistencia de compras", desc: "¿Necesitás ayuda para comprar afuera? Compramos por vos." },
    ],
  },
  pricing: {
    eyebrow: "Precios",
    title: "Precios simples y transparentes",
    subtitle: "Una tarifa clara por kilogramo. Sin cargos ocultos de recepción, almacenamiento ni consolidación.",
    startingAt: "Desde",
    unit: "USD / kg",
    transitLead: "Tiempo de tránsito aproximado",
    transitValue: "7 días",
    transitTail: "por courier aéreo.",
    cta: "Pedí tu cotización",
    includesTitle: "Cada envío incluye",
    included: [
      "Recepción de paquetes gratis",
      "Almacenamiento gratis en Miami",
      "Consolidación de paquetes gratis",
      "Courier aéreo puerta a puerta",
    ],
  },
  warehouse: {
    eyebrow: "Depósito",
    title: "Tus paquetes están seguros en Miami",
    description:
      "Nuestro depósito en Miami recibe, almacena y consolida tus compras sin costo adicional antes de enviarlas a Argentina.",
    points: ["Instalación segura y monitoreada", "Recepción y procesamiento rápidos", "Ubicación privilegiada en Miami"],
    imageAlt: "Depósito logístico de US1 Trade en Miami, luminoso y organizado, con paquetes prolijamente ubicados",
    overlayLabel: "Depósito en Miami",
    overlayValue: "Recepción · Almacenamiento · Consolidación",
  },
  faq: {
    eyebrow: "Preguntas",
    title: "Preguntas frecuentes",
    items: [
      {
        q: "¿Cuánto cuesta el envío?",
        a: "El precio arranca en USD $55 por kilogramo por courier aéreo. La recepción, el almacenamiento y la consolidación son siempre gratis.",
      },
      {
        q: "¿Cuánto tarda la entrega?",
        a: "Una vez que tu envío consolidado sale de Miami, la entrega en Argentina tarda aproximadamente 7 días.",
      },
      {
        q: "¿Puedo comprar en China?",
        a: "Sí. Comprá en AliExpress, Alibaba, Temu y cualquier otra tienda, y enviá todo a tu dirección de Miami.",
      },
      {
        q: "¿Puedo comprar en Japón?",
        a: "Por supuesto. Tiendas como Rakuten y Yahoo! Japan están 100% soportadas: solo enviá tus pedidos a tu dirección de Miami.",
      },
      {
        q: "¿Consolidan paquetes?",
        a: "Sí. Combinamos varios pedidos en un solo envío sin costo, para que ahorres en el flete y recibas todo junto.",
      },
      {
        q: "¿El almacenamiento es gratis?",
        a: "Sí. Guardamos tus paquetes en nuestro depósito de Miami sin cargo adicional hasta que quieras enviarlos.",
      },
      {
        q: "¿Puedo enviar electrónica?",
        a: "Sí, manejamos electrónica habitualmente. Escribinos para asesorarte sobre productos específicos y requisitos de manejo.",
      },
    ],
  },
  finalCta: {
    title: "¿Listo para empezar?",
    description: "Obtené hoy tu dirección de envío gratuita en Miami y empezá a comprar en cualquier parte del mundo.",
    cta: "Crear mi dirección",
  },
  footer: {
    tagline: "Courier internacional que consolida tus compras en Miami y las entrega en Argentina por vía aérea.",
    contact: "Contacto",
    location: "Ubicación",
    locationValue: "Depósito en Miami, Florida",
    rights: "US1 Trade — Courier Internacional. Todos los derechos reservados.",
  },
}

export const translations: Record<Locale, Dictionary> = { es, en }

export function getDictionary(locale: Locale): Dictionary {
  return translations[locale]
}
