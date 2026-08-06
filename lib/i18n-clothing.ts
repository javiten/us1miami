/**
 * Copy for the /clothing vertical, in English and Spanish.
 *
 * `clothingEs` is typed as `ClothingDictionary` (derived from the English
 * object), so a missing or misspelled key is a compile-time error rather than
 * a blank string on the live page.
 *
 * All prices and durations interpolate from `lib/clothing.ts` so the two
 * languages can never drift apart on commercial values.
 */

import {
  CLOTHING_RATE_PER_KG,
  CLOTHING_VOLUME_RATE_PER_KG,
  CLOTHING_VOLUME_MIN_KG,
  CLOTHING_DELIVERY_DAYS,
} from "@/lib/clothing"

const RATE = `USD ${CLOTHING_RATE_PER_KG}`
const VOLUME_RATE = `USD ${CLOTHING_VOLUME_RATE_PER_KG}`
const MIN_KG = `${CLOTHING_VOLUME_MIN_KG} kg`
const DAYS = CLOTHING_DELIVERY_DAYS

export const clothingEn = {
  meta: {
    title: "Clothing & Footwear from the U.S. to Argentina | US1 Miami",
    description: `Buy clothing, footwear and fashion accessories in the United States. We receive your orders in Miami, consolidate them and ship to Argentina from ${VOLUME_RATE}/kg on eligible shipments of ${MIN_KG} or more.`,
    ogAlt: "Folded apparel and sneaker boxes prepared for shipping at the US1 Miami warehouse",
    home: "Home",
    breadcrumb: "Clothing",
  },

  hero: {
    eyebrow: "US1 MIAMI CLOTHING",
    title: `Your favorite U.S. brands, delivered to Argentina in just ${DAYS} days.`,
    body: "Purchase clothing, footwear and accessories in the United States. We receive your orders in Miami, consolidate them and ship them to Argentina.",
    priceValue: `${VOLUME_RATE}/kg`,
    priceCondition: `When shipping ${MIN_KG} or more`,
    priceRegular: `Regular price: ${RATE}/kg`,
    delivery: `Estimated delivery in ${DAYS} days from dispatch.`,
    ctaPrimary: "Create my address",
    ctaSecondary: "Get a shipping quote",
    imageAlt:
      "Neatly folded clothing, sneakers and shopping bags packed alongside shipping boxes at a Miami warehouse",
  },

  brands: {
    label: "Brands our customers buy",
    disclaimer:
      "Brand names are shown only as examples of products our customers commonly purchase. US1 Miami is an independent courier and does not imply any affiliation with, authorization by, or sponsorship from these brands. All trademarks belong to their respective owners.",
  },

  how: {
    eyebrow: "How it works",
    title: "From a U.S. checkout to your door in Argentina.",
    steps: [
      { title: "Buy from your preferred U.S. store", desc: "Shop any U.S. retailer or marketplace, online or in person." },
      { title: "Ship to your US1 Miami address", desc: "Use your personal Miami address as the delivery destination." },
      { title: "We receive and consolidate", desc: "Your orders arrive at our warehouse, where we log and group them." },
      { title: "We ship to Argentina", desc: "Your consolidated shipment is dispatched by air freight." },
      { title: "Receive your package", desc: `Delivery in approximately ${DAYS} days after dispatch.` },
    ],
  },

  categories: {
    eyebrow: "What you can ship",
    title: "Apparel, footwear and accessories.",
    subtitle:
      "The categories our customers ship most often. Item eligibility depends on the product, its condition and current shipping regulations.",
    items: {
      clothing: { title: "Clothing", desc: "Everyday apparel, denim, dresses and knitwear." },
      sneakers: { title: "Sneakers", desc: "Athletic and lifestyle footwear, including boxed releases." },
      sportswear: { title: "Sportswear", desc: "Training gear, leggings, jerseys and performance layers." },
      jackets: { title: "Jackets", desc: "Coats, parkas, puffers and technical outerwear." },
      bags: { title: "Bags", desc: "Backpacks, handbags, duffels and luggage." },
      accessories: { title: "Fashion accessories", desc: "Caps, belts, scarves, sunglasses and small leather goods." },
      kids: { title: "Children's clothing", desc: "Kids and baby apparel, footwear and outerwear." },
      outlet: { title: "Outlet purchases", desc: "Sale and clearance hauls from U.S. outlet stores." },
    },
  },

  pricing: {
    eyebrow: "Volume pricing",
    title: "Ship more, pay less per kilo.",
    subtitle:
      "Two rates, one simple rule: the more chargeable weight you ship in a single dispatch, the lower your cost per kilo.",
    regular: {
      label: "Regular shipping",
      value: `${RATE}/kg`,
      desc: "Standard rate for clothing, footwear and accessory shipments.",
    },
    volume: {
      label: `Shipments of ${MIN_KG} or more`,
      value: `From ${VOLUME_RATE}/kg`,
      desc: `Available on eligible shipments that reach ${MIN_KG} of chargeable weight.`,
      badge: "Best value",
    },
    notes: [
      `Consolidating several purchases can help you reach the ${MIN_KG} threshold.`,
      "Final pricing depends on actual or volumetric weight, whichever is greater.",
      "Product type and condition may affect eligibility and final cost.",
    ],
    disclaimer: `Not every package automatically qualifies for ${VOLUME_RATE}/kg. The volume rate applies to eligible shipments that reach ${MIN_KG} of chargeable weight, and final pricing is confirmed once your shipment is weighed and measured in Miami.`,
  },

  consolidate: {
    eyebrow: "Consolidate and save",
    title: "Many stores, one shipment.",
    body: `Shop as many U.S. stores as you like and send everything to your personal Miami address. We receive each order, hold it at our warehouse and combine eligible purchases into a single shipment — which is the simplest way to reach the ${MIN_KG} threshold and bring your cost per kilo down.`,
    points: [
      { title: "One destination", desc: "Every store ships to the same Miami address." },
      { title: "Grouped into one dispatch", desc: "Eligible orders travel together instead of separately." },
      { title: "Lower cost per kilo", desc: `Reaching ${MIN_KG} unlocks pricing from ${VOLUME_RATE}/kg.` },
    ],
    imageAlt: "Several shopping bags and shoe boxes from different stores consolidated into one shipping carton",
  },

  finalCta: {
    title: "Shop in the United States. We'll take it to Argentina.",
    body: `Create your Miami address in minutes and start receiving your purchases. Estimated delivery in ${DAYS} days from dispatch.`,
    ctaPrimary: "Create my address",
    ctaSecondary: "Request a quote",
  },
}

export type ClothingDictionary = typeof clothingEn

export const clothingEs: ClothingDictionary = {
  meta: {
    title: "Ropa y calzado de Estados Unidos a Argentina | US1 Miami",
    description: `Comprá ropa, calzado y accesorios en Estados Unidos. Recibimos tus pedidos en Miami, los consolidamos y los enviamos a Argentina desde ${VOLUME_RATE}/kg en envíos elegibles de ${MIN_KG} o más.`,
    ogAlt: "Prendas dobladas y cajas de zapatillas preparadas para envío en el warehouse de US1 Miami",
    home: "Inicio",
    breadcrumb: "Clothing",
  },

  hero: {
    eyebrow: "US1 MIAMI CLOTHING",
    title: `Tus marcas favoritas de Estados Unidos, en Argentina en solo ${DAYS} días.`,
    body: "Comprá ropa, calzado y accesorios en Estados Unidos. Recibimos tus pedidos en Miami, consolidamos tus compras y los enviamos a Argentina.",
    priceValue: `${VOLUME_RATE}/kg`,
    priceCondition: `Comprando ${MIN_KG} o más`,
    priceRegular: `Precio regular: ${RATE}/kg`,
    delivery: `Entrega estimada en ${DAYS} días desde el despacho.`,
    ctaPrimary: "Crear mi dirección",
    ctaSecondary: "Cotizar envío",
    imageAlt:
      "Ropa doblada, zapatillas y bolsas de compras junto a cajas de envío en un warehouse de Miami",
  },

  brands: {
    label: "Marcas que compran nuestros clientes",
    disclaimer:
      "Los nombres de marcas se muestran solo como ejemplos de productos que nuestros clientes compran habitualmente. US1 Miami es un courier independiente y su mención no implica afiliación, autorización ni patrocinio por parte de estas marcas. Todas las marcas pertenecen a sus respectivos propietarios.",
  },

  how: {
    eyebrow: "Cómo funciona",
    title: "Desde el checkout en Estados Unidos hasta tu casa en Argentina.",
    steps: [
      { title: "Comprá en la tienda de Estados Unidos que preferís", desc: "Comprá en cualquier tienda o marketplace de USA, online o presencial." },
      { title: "Enviá a tu dirección de US1 Miami", desc: "Usá tu dirección personal en Miami como destino de entrega." },
      { title: "Recibimos y consolidamos", desc: "Tus pedidos llegan a nuestro warehouse, donde los registramos y agrupamos." },
      { title: "Enviamos a Argentina", desc: "Despachamos tu envío consolidado por vía aérea." },
      { title: "Recibí tu paquete", desc: `Entrega en aproximadamente ${DAYS} días después del despacho.` },
    ],
  },

  categories: {
    eyebrow: "Qué podés enviar",
    title: "Indumentaria, calzado y accesorios.",
    subtitle:
      "Las categorías que más envían nuestros clientes. La elegibilidad de cada artículo depende del producto, su condición y la normativa de envío vigente.",
    items: {
      clothing: { title: "Ropa", desc: "Prendas de uso diario, denim, vestidos y tejidos." },
      sneakers: { title: "Zapatillas", desc: "Calzado deportivo y urbano, incluidos lanzamientos en caja." },
      sportswear: { title: "Ropa deportiva", desc: "Indumentaria de entrenamiento, calzas, camisetas y capas técnicas." },
      jackets: { title: "Camperas", desc: "Tapados, parkas, camperas inflables y abrigo técnico." },
      bags: { title: "Bolsos y mochilas", desc: "Mochilas, carteras, bolsos de viaje y valijas." },
      accessories: { title: "Accesorios de moda", desc: "Gorras, cinturones, bufandas, lentes y marroquinería." },
      kids: { title: "Ropa de niños", desc: "Indumentaria, calzado y abrigo para niños y bebés." },
      outlet: { title: "Compras en outlet", desc: "Compras de liquidación y descuentos en outlets de USA." },
    },
  },

  pricing: {
    eyebrow: "Precios por volumen",
    title: "Enviá más, pagá menos por kilo.",
    subtitle:
      "Dos tarifas y una regla simple: cuanto más peso facturable envíes en un mismo despacho, menor es tu costo por kilo.",
    regular: {
      label: "Envío regular",
      value: `${RATE}/kg`,
      desc: "Tarifa estándar para envíos de ropa, calzado y accesorios.",
    },
    volume: {
      label: `Envíos de ${MIN_KG} o más`,
      value: `Desde ${VOLUME_RATE}/kg`,
      desc: `Disponible en envíos elegibles que alcanzan ${MIN_KG} de peso facturable.`,
      badge: "Mejor precio",
    },
    notes: [
      `Consolidar varias compras puede ayudarte a alcanzar el mínimo de ${MIN_KG}.`,
      "El precio final depende del peso real o volumétrico, el que sea mayor.",
      "El tipo de producto y su condición pueden afectar la elegibilidad y el costo final.",
    ],
    disclaimer: `No todos los paquetes califican automáticamente para ${VOLUME_RATE}/kg. La tarifa por volumen aplica a envíos elegibles que alcanzan ${MIN_KG} de peso facturable, y el precio final se confirma una vez que tu envío es pesado y medido en Miami.`,
  },

  consolidate: {
    eyebrow: "Consolidá y ahorrá",
    title: "Muchas tiendas, un solo envío.",
    body: `Comprá en todas las tiendas de Estados Unidos que quieras y enviá todo a tu dirección personal en Miami. Recibimos cada pedido, lo guardamos en nuestro warehouse y combinamos las compras elegibles en un único envío: es la forma más simple de alcanzar el mínimo de ${MIN_KG} y bajar tu costo por kilo.`,
    points: [
      { title: "Un solo destino", desc: "Todas las tiendas envían a la misma dirección de Miami." },
      { title: "Agrupado en un despacho", desc: "Los pedidos elegibles viajan juntos en lugar de por separado." },
      { title: "Menor costo por kilo", desc: `Alcanzar ${MIN_KG} habilita precios desde ${VOLUME_RATE}/kg.` },
    ],
    imageAlt: "Varias bolsas de compras y cajas de zapatos de distintas tiendas consolidadas en una caja de envío",
  },

  finalCta: {
    title: "Comprá en Estados Unidos. Nosotros lo llevamos a Argentina.",
    body: `Creá tu dirección en Miami en minutos y empezá a recibir tus compras. Entrega estimada en ${DAYS} días desde el despacho.`,
    ctaPrimary: "Crear mi dirección",
    ctaSecondary: "Solicitar cotización",
  },
}
