/**
 * Copy for the /electronics vertical, in English and Spanish.
 *
 * `electronicsEs` is typed as `ElectronicsDictionary` (derived from the English
 * object), so a missing or misspelled key is a compile-time error rather than a
 * blank string on the live page.
 *
 * Rates and durations interpolate from `lib/electronics.ts`. Electronics has a
 * single rate with no volume tier, so it is always phrased as a starting
 * ("from") price — never as a final quote.
 */

import { ELECTRONICS_RATE_PER_KG, ELECTRONICS_TRANSIT_DAYS } from "@/lib/electronics"

const RATE = `USD ${ELECTRONICS_RATE_PER_KG}`
const DAYS = ELECTRONICS_TRANSIT_DAYS

export const electronicsEn = {
  meta: {
    title: "Electronics from the U.S. to Argentina | US1 Miami",
    description: `Buy electronics, accessories and devices in the United States. We receive them in Miami and coordinate shipment to Argentina from ${RATE}/kg, with estimated delivery in ${DAYS} days from dispatch.`,
    ogAlt: "Consumer electronics packed for international shipping at the US1 Miami warehouse",
    home: "Home",
    breadcrumb: "Electronics",
  },

  hero: {
    eyebrow: "US1 MIAMI ELECTRONICS",
    title: `Technology from the United States, delivered to Argentina in just ${DAYS} days.`,
    body: "Purchase electronics, accessories and devices from your favorite stores. We receive them in Miami and coordinate shipment to Argentina.",
    priceValue: `From ${RATE}/kg`,
    priceNote: "Final price depends on actual or volumetric weight.",
    delivery: `Estimated delivery in ${DAYS} days from dispatch.`,
    ctaPrimary: "Create my address",
    ctaSecondary: "Get an electronics quote",
    imageAlt:
      "Smartphones, a laptop, headphones and a camera arranged beside shipping cartons at a Miami logistics warehouse",
  },

  brands: {
    label: "Consumer electronics brands",
    disclaimer:
      "The brands shown are examples of products our customers commonly request. US1 Miami is an independent courier and package-forwarding service, and is not an authorized dealer or distributor of these brands. Displaying these names does not imply any affiliation with, authorization by, or sponsorship from their respective owners. All trademarks belong to their respective owners.",
  },

  shop: {
    eyebrow: "Shop across the U.S.",
    title: "Buy from any U.S. store with your own Miami address",
    body: "Your personal US1 Miami address works at checkout like any domestic address. Order from online marketplaces, manufacturer websites and major retail chains, then have everything delivered to us.",
    points: [
      {
        title: "Online marketplaces",
        desc: "Shop the large U.S. marketplaces and independent sellers that only ship domestically.",
      },
      {
        title: "Manufacturer websites",
        desc: "Order directly from brand stores, including launch products and configurable models.",
      },
      {
        title: "Major retailers",
        desc: "Use national electronics and department chains, including their online-only deals.",
      },
    ],
  },

  categories: {
    eyebrow: "Popular categories",
    title: "What our customers ship most",
    subtitle: "If it is sold in the United States, we can usually receive it in Miami and forward it to Argentina.",
    items: {
      smartphones: { title: "Smartphones", desc: "Unlocked handsets, cases and charging accessories." },
      computers: { title: "Laptops & tablets", desc: "Notebooks, tablets, keyboards and docking stations." },
      consoles: { title: "Gaming consoles", desc: "Consoles, controllers, headsets and physical games." },
      audio: { title: "Headphones & audio", desc: "Earbuds, over-ear headphones, speakers and soundbars." },
      cameras: { title: "Cameras", desc: "Mirrorless and DSLR bodies, lenses, gimbals and action cams." },
      smartwatches: { title: "Smartwatches", desc: "Watches, fitness trackers, bands and chargers." },
      accessories: { title: "Computer accessories", desc: "Mice, monitors, drives, hubs and cabling." },
      smartHome: { title: "Smart-home devices", desc: "Speakers, cameras, sensors, plugs and lighting." },
      smallElectronics: { title: "Small consumer electronics", desc: "Compact devices, gadgets and personal tech." },
      replacements: { title: "Replacement accessories", desc: "Chargers, adapters, cables and spare parts." },
    },
  },

  how: {
    eyebrow: "How it works",
    title: `From U.S. checkout to your door in ${DAYS} days`,
    steps: {
      purchase: { title: "Purchase the product", desc: "Buy from any U.S. store using your usual payment method." },
      send: { title: "Send it to your US1 Miami address", desc: "Enter your Miami address at checkout as the delivery address." },
      receive: { title: "We receive and register the package", desc: "Your package is logged into our system on arrival." },
      verify: { title: "We verify weight and dimensions", desc: "We measure and weigh it to determine the chargeable weight." },
      prepare: { title: "We prepare the international shipment", desc: "We pack, document and dispatch your shipment to Argentina." },
      deliver: { title: "Receive it in Argentina", desc: `Estimated delivery in ${DAYS} days from dispatch.` },
    },
  },

  // Full-width navy band between the process steps and the disclosures. Every
  // claim restates something already published elsewhere on this page (measured
  // weight, protective packing, air dispatch) — it adds no new service promise.
  handling: {
    eyebrow: "In the warehouse",
    title: "Measured, protected, and packed for the flight",
    description:
      "Every device is logged, weighed and measured on arrival, then packed with protective material for the flight to Argentina. Receiving, storage and consolidation stay free.",
    imageAlt:
      "Consumer electronics being padded and packed into a protective shipping carton on a warehouse workbench",
    points: [
      { label: "Logged on arrival", detail: "Each package is registered in our system the day it reaches Miami." },
      { label: "Weighed and measured", detail: "We record actual and volumetric weight, and the higher of the two is what you are quoted." },
      { label: "Packed for air transport", detail: "Devices are cushioned and consolidated into a single carton before dispatch." },
    ],
  },

  notice: {
    eyebrow: "Before you buy",
    title: "Special handling for electronics",
    subtitle:
      "Electronics carry transport rules that other goods do not. Please read these points before placing an order.",
    items: {
      batteries: {
        title: "Batteries may require review",
        desc: "Batteries, power banks and products containing batteries may require review before shipping. Check with our team before purchasing.",
      },
      restrictions: {
        title: "Some items have transport restrictions",
        desc: "Certain electronics are subject to special transport restrictions and may not be eligible for air shipment.",
      },
      oversized: {
        title: "Oversized or high-value items",
        desc: "Oversized or high-value products may require an individual quote rather than the standard per-kilogram rate.",
      },
      weight: {
        title: "Final price depends on weight",
        desc: `Rates start at ${RATE}/kg. The final price is calculated from the actual or volumetric weight, whichever is greater.`,
      },
      warranty: {
        title: "Warranty and returns",
        desc: "Warranty and returns are governed by the original retailer or manufacturer, according to their own terms.",
      },
      notSeller: {
        title: "We are not the seller",
        desc: "US1 Miami is not the manufacturer or seller of the products you purchase. We receive, handle and forward them.",
      },
    },
  },

  finalCta: {
    title: "The technology you want, within reach.",
    body: `Get your Miami address and start shopping U.S. electronics today. Shipping from ${RATE}/kg, with estimated delivery in ${DAYS} days from dispatch.`,
    ctaPrimary: "Create my address",
    ctaSecondary: "Request a quote",
  },
}

export type ElectronicsDictionary = typeof electronicsEn

export const electronicsEs: ElectronicsDictionary = {
  meta: {
    title: "Electrónica de Estados Unidos a Argentina | US1 Miami",
    description: `Comprá electrónica, accesorios y dispositivos en Estados Unidos. Los recibimos en Miami y coordinamos su envío a Argentina desde ${RATE}/kg, con entrega estimada en ${DAYS} días desde el despacho.`,
    ogAlt: "Electrónica de consumo embalada para envío internacional en el warehouse de US1 Miami",
    home: "Inicio",
    breadcrumb: "Electronics",
  },

  hero: {
    eyebrow: "US1 MIAMI ELECTRONICS",
    title: `Tecnología de Estados Unidos, en Argentina en solo ${DAYS} días.`,
    body: "Comprá electrónica, accesorios y dispositivos en tus tiendas favoritas. Los recibimos en Miami y coordinamos su envío a Argentina.",
    priceValue: `Envíos desde ${RATE}/kg`,
    priceNote: "El precio final depende del peso real o volumétrico.",
    delivery: `Entrega estimada en ${DAYS} días desde el despacho.`,
    ctaPrimary: "Crear mi dirección",
    ctaSecondary: "Cotizar electrónica",
    imageAlt:
      "Celulares, una notebook, auriculares y una cámara junto a cajas de envío en un warehouse logístico de Miami",
  },

  brands: {
    label: "Marcas de electrónica de consumo",
    disclaimer:
      "Las marcas mostradas son ejemplos de productos que nuestros clientes solicitan habitualmente. US1 Miami es un servicio independiente de courier y reenvío de paquetes, y no es vendedor autorizado ni distribuidor de estas marcas. Su mención no implica afiliación, autorización ni patrocinio por parte de sus titulares. Todas las marcas pertenecen a sus respectivos propietarios.",
  },

  shop: {
    eyebrow: "Comprá en todo Estados Unidos",
    title: "Comprá en cualquier tienda de EE. UU. con tu dirección en Miami",
    body: "Tu dirección personal de US1 Miami funciona al pagar como cualquier dirección local. Comprá en marketplaces online, sitios de fabricantes y grandes cadenas minoristas, y hacé que todo llegue a nosotros.",
    points: [
      {
        title: "Marketplaces online",
        desc: "Comprá en los grandes marketplaces de EE. UU. y en vendedores que solo envían dentro del país.",
      },
      {
        title: "Sitios de fabricantes",
        desc: "Comprá directo en las tiendas oficiales, incluidos lanzamientos y modelos configurables.",
      },
      {
        title: "Grandes minoristas",
        desc: "Usá las cadenas nacionales de electrónica y department stores, con sus ofertas exclusivas online.",
      },
    ],
  },

  categories: {
    eyebrow: "Categorías populares",
    title: "Lo que más envían nuestros clientes",
    subtitle: "Si se vende en Estados Unidos, en general podemos recibirlo en Miami y reenviarlo a Argentina.",
    items: {
      smartphones: { title: "Celulares", desc: "Equipos liberados, fundas y accesorios de carga." },
      computers: { title: "Notebooks y tablets", desc: "Notebooks, tablets, teclados y docking stations." },
      consoles: { title: "Consolas de juegos", desc: "Consolas, joysticks, auriculares y juegos físicos." },
      audio: { title: "Auriculares y audio", desc: "In-ear, vincha, parlantes y barras de sonido." },
      cameras: { title: "Cámaras", desc: "Cuerpos mirrorless y DSLR, lentes, gimbals y action cams." },
      smartwatches: { title: "Smartwatches", desc: "Relojes, pulseras de actividad, mallas y cargadores." },
      accessories: { title: "Accesorios de computación", desc: "Mouses, monitores, discos, hubs y cables." },
      smartHome: { title: "Domótica", desc: "Parlantes, cámaras, sensores, enchufes e iluminación." },
      smallElectronics: { title: "Pequeña electrónica", desc: "Dispositivos compactos, gadgets y tecnología personal." },
      replacements: { title: "Accesorios de repuesto", desc: "Cargadores, adaptadores, cables y repuestos." },
    },
  },

  how: {
    eyebrow: "Cómo funciona",
    title: `Del checkout en EE. UU. a tu puerta en ${DAYS} días`,
    steps: {
      purchase: { title: "Comprá el producto", desc: "Comprá en cualquier tienda de EE. UU. con tu medio de pago habitual." },
      send: { title: "Enviálo a tu dirección de US1 Miami", desc: "Ingresá tu dirección de Miami como domicilio de entrega." },
      receive: { title: "Recibimos y registramos el paquete", desc: "Al llegar, cargamos tu paquete en nuestro sistema." },
      verify: { title: "Verificamos peso y dimensiones", desc: "Lo medimos y pesamos para determinar el peso a facturar." },
      prepare: { title: "Preparamos el envío internacional", desc: "Embalamos, documentamos y despachamos tu envío a Argentina." },
      deliver: { title: "Recibílo en Argentina", desc: `Entrega estimada en ${DAYS} días desde el despacho.` },
    },
  },

  handling: {
    eyebrow: "En el depósito",
    title: "Medido, protegido y embalado para el vuelo",
    description:
      "Cada dispositivo se registra, se pesa y se mide al llegar, y después se embala con material de protección para el vuelo a Argentina. La recepción, el almacenamiento y la consolidación siguen siendo gratis.",
    imageAlt:
      "Productos electrónicos siendo acolchados y embalados en una caja de envío protectora sobre una mesa de trabajo del depósito",
    points: [
      { label: "Registrado al llegar", detail: "Cada paquete se registra en nuestro sistema el mismo día que llega a Miami." },
      { label: "Pesado y medido", detail: "Registramos el peso real y el volumétrico, y se cotiza el mayor de los dos." },
      { label: "Embalado para el avión", detail: "Los dispositivos se acolchan y se consolidan en una sola caja antes del despacho." },
    ],
  },

  notice: {
    eyebrow: "Antes de comprar",
    title: "Manejo especial de electrónica",
    subtitle:
      "La electrónica tiene reglas de transporte que otros productos no tienen. Leé estos puntos antes de hacer tu compra.",
    items: {
      batteries: {
        title: "Las baterías pueden requerir revisión",
        desc: "Las baterías, power banks y productos que contienen baterías pueden requerir revisión antes del envío. Consultá con nuestro equipo antes de comprar.",
      },
      restrictions: {
        title: "Algunos productos tienen restricciones",
        desc: "Ciertos artículos electrónicos están sujetos a restricciones especiales de transporte y pueden no ser elegibles para envío aéreo.",
      },
      oversized: {
        title: "Productos voluminosos o de alto valor",
        desc: "Los productos de gran tamaño o alto valor pueden requerir una cotización individual en lugar de la tarifa estándar por kilogramo.",
      },
      weight: {
        title: "El precio final depende del peso",
        desc: `Las tarifas comienzan en ${RATE}/kg. El precio final se calcula según el peso real o volumétrico, el que sea mayor.`,
      },
      warranty: {
        title: "Garantía y devoluciones",
        desc: "La garantía y las devoluciones se rigen por el vendedor original o el fabricante, según sus propios términos.",
      },
      notSeller: {
        title: "No somos el vendedor",
        desc: "US1 Miami no es el fabricante ni el vendedor de los productos que comprás. Los recibimos, gestionamos y reenviamos.",
      },
    },
  },

  finalCta: {
    title: "La tecnología que buscás, más cerca.",
    body: `Obtené tu dirección en Miami y empezá a comprar electrónica en EE. UU. Envíos desde ${RATE}/kg, con entrega estimada en ${DAYS} días desde el despacho.`,
    ctaPrimary: "Crear mi dirección",
    ctaSecondary: "Solicitar cotización",
  },
}
