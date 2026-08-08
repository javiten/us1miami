import { AUTOMOTIVE_RATE_PER_KG } from "@/lib/automotive"
import { CLOTHING_RATE_PER_KG, CLOTHING_VOLUME_MIN_KG, CLOTHING_VOLUME_RATE_PER_KG } from "@/lib/clothing"
import { ELECTRONICS_RATE_PER_KG } from "@/lib/electronics"
import { automotiveEn, automotiveEs } from "@/lib/i18n-automotive"
import { clothingEn, clothingEs } from "@/lib/i18n-clothing"
import { electronicsEn, electronicsEs } from "@/lib/i18n-electronics"
import { japanEn, japanEs } from "@/lib/i18n-japan"

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
    automotive: "Automotive",
    clothing: "Clothing",
    electronics: "Electronics",
    japan: "Japan",
    pricing: "Pricing",
    warehouse: "Warehouse",
    faq: "FAQ",
    quote: "Get a Quote",
    login: "Log in",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
    // Copy for the Services dropdown that groups the vertical landing pages.
    servicesMenu: "Open services menu",
    automotiveDesc: "Parts, components and accessories",
    clothingDesc: "Apparel, footwear and accessories",
    electronicsDesc: "Devices, audio and computing",
    japanDesc: "Purchases, auctions and products from Japan",
    allServices: "All services",
    allServicesDesc: "Receiving, storage and consolidation",
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
  heroCarousel: {
    region: "US1 Miami services",
    prev: "Previous slide",
    next: "Next slide",
    pause: "Pause automatic slide rotation",
    play: "Resume automatic slide rotation",
    goTo: "Show slide {n}: {label}",
    status: "Slide {n} of {total}",
    courierTab: "International Courier",
    automotive: {
      tab: "Automotive",
      eyebrow: `Automotive parts · USA → Argentina`,
      title: "Parts from the United States, delivered in Argentina.",
      description: `Buy automotive parts, accessories and components in the United States. We receive them in Miami and coordinate shipping to Argentina from USD ${AUTOMOTIVE_RATE_PER_KG} per kg.`,
      primaryCta: "Explore Automotive",
      secondaryCta: "Request a Quote",
      highlights: [
        `Shipping from USD ${AUTOMOTIVE_RATE_PER_KG}/kg`,
        "Optional assisted purchasing",
        "Access to specialized suppliers",
      ],
      imageAlt:
        "Organized automotive parts boxes on Miami warehouse shelving beside a cargo aircraft and a route line toward South America",
    },
    clothing: {
      tab: "Clothing",
      eyebrow: `Clothing & footwear · USA → Argentina`,
      title: "Your favorite United States brands, in Argentina.",
      description: `Clothing, footwear and accessories from USD ${CLOTHING_VOLUME_RATE_PER_KG}/kg on shipments of ${CLOTHING_VOLUME_MIN_KG} kg or more. Regular price USD ${CLOTHING_RATE_PER_KG}/kg. Estimated delivery in 7 days.`,
      primaryCta: "Explore Clothing",
      // Labels for the two floating price cards over the artwork.
      volumeLabel: `From ${CLOTHING_VOLUME_MIN_KG} kg`,
      regularLabel: "Regular price",
      perKg: "/kg",
      imageAlt:
        "Neatly folded apparel, sneakers and a leather accessory arranged on a deep navy studio background",
    },
    electronics: {
      tab: "Electronics",
      eyebrow: `Electronics & gaming · USA → Argentina`,
      title: "United States technology, straight to Argentina.",
      description: `Electronics, gaming, audio and accessories from USD ${ELECTRONICS_RATE_PER_KG}/kg with estimated delivery in 7 days.`,
      primaryCta: "Explore Electronics",
      shippingLabel: "Shipping from",
      deliveryLabel: "Estimated delivery",
      deliveryValue: "≈ 7 days",
      perKg: "/kg",
      imageAlt:
        "A laptop, headphones, game controller, smartphone and compact camera arranged on a deep navy studio background",
    },
    japan: {
      tab: "Japan",
      eyebrow: "Japan → Miami → Argentina",
      title: "Buy directly in Japan. Receive it in Argentina.",
      description:
        "Auctions, retro gaming, figures, collectibles, electronics and exclusive products from Japan.",
      primaryCta: "Explore Japan",
      // No price card here: /japan deliberately publishes no per-kilogram rate,
      // so the floating cards show the quote posture and the route instead.
      quoteLabel: "Pricing",
      quoteValue: "Custom quote",
      routeLabel: "Route",
      routeValue: "Japan → Miami → Argentina",
      imageAlt:
        "A retro handheld console, cartridge, collectible figure, compact camera and a sealed parcel arranged on a deep navy studio background",
    },
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
      { title: "Ship to your Miami address", desc: "Use your free US1 Miami address at checkout." },
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
    imageAlt: "Several small parcels being combined into a single larger shipping box on a packing table",
  },
  services: {
    featureImageAlt: "A parcel on a receiving counter beside a barcode scanner in a warehouse office",
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
    imageAlt: "Bright, organized US1 Miami logistics warehouse in Miami with neatly shelved packages",
    overlayLabel: "Miami Warehouse",
    overlayValue: "Receiving · Storage · Consolidation",
  },
  // Slot 8 — the route. Describes the three legs a package actually travels.
  // Every claim here restates something already published elsewhere on the
  // site (free intake, ~7-day air transit, door-to-door delivery).
  route: {
    eyebrow: "The route",
    title: "From your Miami address to your door in Argentina",
    description:
      "One address in Miami, one consolidated shipment, one delivery. Here is the path your purchases follow.",
    imageAlt: "Cargo aircraft being loaded with palletised freight on an airport apron at night",
    stops: [
      {
        place: "Miami",
        label: "We receive and consolidate",
        detail: "Your purchases arrive at our warehouse. Receiving, storage and consolidation are free.",
      },
      {
        place: "In the air",
        label: "Air courier to Argentina",
        detail: "Your consolidated shipment flies out of Miami and clears as a single package.",
      },
      {
        place: "Argentina",
        label: "Delivered to your door",
        detail: "Approximately 7 days after departure, everything arrives together at your address.",
      },
    ],
  },
  // Slot 9 — factual proof. These are published figures, not testimonials.
  proof: {
    eyebrow: "Why US1 Miami",
    title: "The numbers behind the service",
    stats: [
      { value: "~7 days", label: "Air transit from Miami to Argentina once your shipment departs." },
      { value: "USD 55", label: "Starting price per kilogram by air courier." },
      { value: "$0", label: "Receiving, storage and consolidation at our Miami warehouse." },
      { value: "4", label: "Specialised verticals: automotive, apparel, electronics and Japan." },
    ],
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
    rights: "US1 Miami — International Courier. All rights reserved.",
    services: "Services",
    courierLink: "International Courier",
    automotiveLink: "Automotive",
    clothingLink: "Clothing",
    electronicsLink: "Electronics",
    japanLink: "Japan",
    followUs: "Follow us",
  },
  // Accessible names for the social actions. Both surfaces are icon-only, so
  // these are what screen readers announce and what the tooltip shows.
  social: {
    whatsappLabel: "Chat with us on WhatsApp",
    whatsappShort: "WhatsApp",
    instagramLabel: "Follow US1 Miami on Instagram",
    instagramShort: "Instagram",
  },
  automotive: automotiveEn,
  clothing: clothingEn,
  electronics: electronicsEn,
  japan: japanEn,
}

export type Dictionary = typeof en

const es: Dictionary = {
  nav: {
    how: "Cómo funciona",
    services: "Servicios",
    automotive: "Automotive",
    clothing: "Clothing",
    electronics: "Electronics",
    japan: "Japan",
    pricing: "Precios",
    warehouse: "Depósito",
    faq: "Preguntas",
    quote: "Pedí tu cotización",
    login: "Ingresar",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    language: "Idioma",
    servicesMenu: "Abrir menú de servicios",
    automotiveDesc: "Repuestos, componentes y accesorios",
    clothingDesc: "Indumentaria, calzado y accesorios",
    electronicsDesc: "Dispositivos, audio y computación",
    japanDesc: "Compras, subastas y productos desde Japón",
    allServices: "Todos los servicios",
    allServicesDesc: "Recepción, almacenamiento y consolidación",
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
  heroCarousel: {
    region: "Servicios de US1 Miami",
    prev: "Diapositiva anterior",
    next: "Diapositiva siguiente",
    pause: "Pausar la rotación automática de diapositivas",
    play: "Reanudar la rotación automática de diapositivas",
    goTo: "Mostrar diapositiva {n}: {label}",
    status: "Diapositiva {n} de {total}",
    courierTab: "Courier internacional",
    automotive: {
      tab: "Automotive",
      eyebrow: `Repuestos automotrices · USA → Argentina`,
      title: "Repuestos de Estados Unidos, entregados en Argentina.",
      description: `Comprá repuestos, accesorios y componentes automotrices en Estados Unidos. Los recibimos en Miami y coordinamos su envío a Argentina desde USD ${AUTOMOTIVE_RATE_PER_KG} por kg.`,
      primaryCta: "Explorar Automotive",
      secondaryCta: "Solicitar cotización",
      highlights: [
        `Envíos desde USD ${AUTOMOTIVE_RATE_PER_KG}/kg`,
        "Compra asistida opcional",
        "Acceso a proveedores especializados",
      ],
      imageAlt:
        "Cajas de repuestos automotrices organizadas en estanterías del warehouse de Miami junto a un avión de carga y una ruta hacia Sudamérica",
    },
    clothing: {
      tab: "Clothing",
      eyebrow: `Ropa y calzado · USA → Argentina`,
      title: "Tus marcas favoritas de Estados Unidos, en Argentina.",
      description: `Ropa, calzado y accesorios desde USD ${CLOTHING_VOLUME_RATE_PER_KG}/kg en envíos de ${CLOTHING_VOLUME_MIN_KG} kg o más. Precio regular USD ${CLOTHING_RATE_PER_KG}/kg. Entrega estimada en 7 días.`,
      primaryCta: "Explorar Clothing",
      volumeLabel: `Desde ${CLOTHING_VOLUME_MIN_KG} kg`,
      regularLabel: "Precio regular",
      perKg: "/kg",
      imageAlt:
        "Prendas dobladas, zapatillas y un accesorio de cuero ordenados sobre un fondo de estudio azul marino",
    },
    electronics: {
      tab: "Electronics",
      eyebrow: `Electrónica y gaming · USA → Argentina`,
      title: "Tecnología de Estados Unidos, directo a Argentina.",
      description: `Electrónica, gaming, audio y accesorios desde USD ${ELECTRONICS_RATE_PER_KG}/kg con entrega estimada en 7 días.`,
      primaryCta: "Explorar Electronics",
      shippingLabel: "Envíos desde",
      deliveryLabel: "Entrega estimada",
      deliveryValue: "≈ 7 días",
      perKg: "/kg",
      imageAlt:
        "Una notebook, auriculares, un joystick, un teléfono y una cámara compacta ordenados sobre un fondo de estudio azul marino",
    },
    japan: {
      tab: "Japan",
      eyebrow: "Japón → Miami → Argentina",
      title: "Comprá directo en Japón. Recibilo en Argentina.",
      description:
        "Subastas, retro gaming, figuras, coleccionables, electrónica y productos exclusivos de Japón.",
      primaryCta: "Explorar Japan",
      quoteLabel: "Precio",
      quoteValue: "Cotización personalizada",
      routeLabel: "Ruta",
      routeValue: "Japón → Miami → Argentina",
      imageAlt:
        "Una consola portátil retro, un cartucho, una figura coleccionable, una cámara compacta y un paquete sellado ordenados sobre un fondo de estudio azul marino",
    },
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
      { title: "Enviá a tu dirección en Miami", desc: "Usá tu dirección gratuita de US1 Miami al pagar." },
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
    imageAlt: "Varios paquetes pequeños combinándose en una sola caja de envío más grande sobre una mesa de embalaje",
  },
  services: {
    featureImageAlt: "Un paquete sobre un mostrador de recepción junto a un lector de código de barras en la oficina del depósito",
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
    imageAlt: "Depósito logístico de US1 Miami en Miami, luminoso y organizado, con paquetes prolijamente ubicados",
    overlayLabel: "Depósito en Miami",
    overlayValue: "Recepción · Almacenamiento · Consolidación",
  },
  route: {
    eyebrow: "La ruta",
    title: "De tu dirección en Miami a tu puerta en Argentina",
    description:
      "Una dirección en Miami, un envío consolidado, una entrega. Este es el camino que recorren tus compras.",
    imageAlt: "Avión de carga siendo cargado con mercadería paletizada en una plataforma aeroportuaria de noche",
    stops: [
      {
        place: "Miami",
        label: "Recibimos y consolidamos",
        detail: "Tus compras llegan a nuestro depósito. La recepción, el almacenamiento y la consolidación son gratis.",
      },
      {
        place: "En vuelo",
        label: "Courier aéreo a Argentina",
        detail: "Tu envío consolidado sale de Miami y se tramita como un solo paquete.",
      },
      {
        place: "Argentina",
        label: "Entrega en tu domicilio",
        detail: "Aproximadamente 7 días después de la salida, todo llega junto a tu dirección.",
      },
    ],
  },
  proof: {
    eyebrow: "Por qué US1 Miami",
    title: "Los números detrás del servicio",
    stats: [
      { value: "~7 días", label: "Tránsito aéreo de Miami a Argentina una vez que sale tu envío." },
      { value: "USD 55", label: "Precio inicial por kilogramo por courier aéreo." },
      { value: "$0", label: "Recepción, almacenamiento y consolidación en nuestro depósito de Miami." },
      { value: "4", label: "Verticales especializadas: automotor, indumentaria, electrónica y Japón." },
    ],
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
    rights: "US1 Miami — Courier Internacional. Todos los derechos reservados.",
    services: "Servicios",
    courierLink: "Courier internacional",
    automotiveLink: "Automotive",
    clothingLink: "Clothing",
    electronicsLink: "Electronics",
    japanLink: "Japan",
    followUs: "Seguinos",
  },
  social: {
    whatsappLabel: "Escribinos por WhatsApp",
    whatsappShort: "WhatsApp",
    instagramLabel: "Seguí a US1 Miami en Instagram",
    instagramShort: "Instagram",
  },
  automotive: automotiveEs,
  clothing: clothingEs,
  electronics: electronicsEs,
  japan: japanEs,
}

export const translations: Record<Locale, Dictionary> = { es, en }

export function getDictionary(locale: Locale): Dictionary {
  return translations[locale]
}
