/**
 * Copy for the /japan vertical, in English and Spanish.
 *
 * `japanEs` is typed as `JapanDictionary` (derived from the English object), so
 * a missing or misspelled key is a compile-time error rather than a blank
 * string on the live page.
 *
 * Unlike the other verticals there are no rate or transit-day constants to
 * interpolate: /japan quotes every request individually (see `lib/japan.ts`).
 * The phrase "custom quote" is therefore load-bearing legal copy, not filler —
 * do not replace it with a figure without also updating the config and the
 * structured data.
 */

export const japanEn = {
  meta: {
    title: "Buy from Japan, delivered to Argentina | US1 Miami",
    description:
      "Access Japanese auctions, marketplaces and second-hand stores to find retro games, collectibles, figures and rare items. We help you buy them and coordinate delivery to Argentina, with a custom quote for every request.",
    ogAlt: "A Tokyo backstreet lined with second-hand hobby and electronics shops at dusk",
    home: "Home",
    breadcrumb: "Japan",
  },

  hero: {
    eyebrow: "US1 MIAMI JAPAN",
    title: "Shop directly from Japan. Receive it in Argentina.",
    body: "Access Japanese auctions, marketplaces and stores to find exclusive products, collectibles and hard-to-find items.",
    quoteValue: "Custom quote",
    quoteNote: "Custom quote based on the product and shipping method.",
    ctaPrimary: "Request a purchase",
    ctaSecondary: "Explore how it works",
    routeLabel: "Shipping route",
    route: { japan: "Japan", miami: "Miami", argentina: "Argentina" },
    routeNote: "Sourced in Japan, consolidated in Miami, delivered in Argentina.",
    imageAlt:
      "A narrow Tokyo shopping street at dusk lined with small second-hand hobby and electronics shops",
  },

  marketplaces: {
    label: "Japanese marketplaces and stores",
    disclaimer:
      "The platforms and stores shown are examples of where we can search on your behalf. US1 Miami is an independent purchasing and forwarding service and is not affiliated with, authorized by, endorsed by or sponsored by any of them. All names and trademarks belong to their respective owners.",
  },

  brands: {
    label: "Japanese brands our customers look for",
    disclaimer:
      "These brands are shown as examples of frequently requested products. US1 Miami is not an official partner, authorized reseller or distributor of any of them, and displaying these names implies no affiliation or endorsement. All trademarks belong to their respective owners.",
  },

  categories: {
    eyebrow: "What you can find",
    title: "The things Japan is best for",
    subtitle:
      "From retro consoles to sealed collectibles, these are the categories our customers ask us to hunt for most.",
    items: {
      retroConsoles: { title: "Retro consoles", desc: "Japanese-region consoles, handhelds and boxed hardware." },
      videoGames: { title: "Video games", desc: "Cartridges, discs and Japan-only releases." },
      controllers: { title: "Controllers & accessories", desc: "Pads, cables, memory cards and peripherals." },
      figures: { title: "Figures & statues", desc: "Scale figures, prize figures and display pieces." },
      plush: { title: "Plush toys", desc: "Character plush, plush keychains and limited runs." },
      tradingCards: { title: "Trading cards", desc: "Singles, sealed packs, boxes and promos." },
      modelKits: { title: "Model kits", desc: "Plastic model kits, tools and detail parts." },
      animeMerch: { title: "Anime merchandise", desc: "Art books, soundtracks, apparel and goods." },
      vintageAudio: { title: "Vintage audio", desc: "Cassette decks, receivers, headphones and speakers." },
      retroElectronics: { title: "Old-school electronics", desc: "Vintage consumer devices and curiosities." },
      cameras: { title: "Cameras", desc: "Film bodies, lenses, compacts and accessories." },
      rareCollectibles: { title: "Rare collectibles", desc: "Discontinued, regional and hard-to-source items." },
    },
  },

  sources: {
    eyebrow: "Featured Japanese sources",
    title: "Where we look on your behalf",
    subtitle:
      "Each platform specialises in something different. Tell us what you are after and we will search the ones that fit.",
    items: {
      yahooAuctions: { name: "Yahoo! Auctions Japan", desc: "Auctions and rare used products from private sellers." },
      mercari: { name: "Mercari Japan", desc: "Second-hand and collectible marketplace listings." },
      amazonJapan: { name: "Amazon Japan", desc: "New products and Japan-exclusive editions." },
      hardOff: { name: "Hard Off", desc: "Used electronics, consoles and audio equipment." },
      hobbyOff: { name: "Hobby Off", desc: "Toys, figures, cards and hobby products." },
      offHouse: { name: "Off House", desc: "Second-hand lifestyle and household products." },
      bookOff: { name: "Book Off", desc: "Games, books, media and collectibles." },
      surugayaMandarake: {
        name: "Suruga-ya & Mandarake",
        desc: "Specialty collectibles and pop-culture items.",
      },
    },
  },

  how: {
    eyebrow: "How it works",
    title: "From a link you found to a parcel at your door",
    steps: {
      request: {
        title: "Send us the link or describe the item",
        desc: "Share the product link, or tell us what you are looking for and we will search for it.",
      },
      review: {
        title: "We review price, seller and options",
        desc: "We check the listing, the seller and the purchase options actually available.",
      },
      approve: {
        title: "You approve the total",
        desc: "We confirm all costs with you before anything is purchased.",
      },
      purchase: {
        title: "The item is purchased and received in Japan",
        desc: "We complete the purchase and take delivery at our Japanese receiving point.",
      },
      prepare: {
        title: "It is prepared for international transport",
        desc: "The item is checked, packed and documented for its international leg.",
      },
      deliver: {
        title: "We coordinate delivery to Argentina",
        desc: "We arrange the route through to final delivery and keep you updated.",
      },
    },
  },

  // Full-width navy band between the process steps and the assisted-buying
  // explainer. Restates the receiving point, in-Japan consolidation and the
  // Japan -> Miami -> Argentina route that the `how` steps and the hero route
  // chip already state. It introduces no new service promise.
  handling: {
    eyebrow: "Between the auction and your door",
    title: "Received in Japan, consolidated, then flown out",
    description:
      "Won and purchased items are delivered to our receiving point in Japan, checked and packed for their international leg, then routed through Miami to Argentina.",
    imageAlt:
      "Small parcels from Japan being wrapped in tissue paper and grouped into a single export carton on a sorting bench",
    points: [
      {
        label: "Received in Japan",
        detail: "We take delivery at our Japanese receiving point, so sellers only ever ship domestically.",
      },
      {
        label: "Checked and packed",
        detail: "Each item is inspected, packed and documented before its international leg.",
      },
      {
        label: "Routed through Miami",
        detail: "Parcels are consolidated and travel Japan to Miami to Argentina on the same route as the rest of our cargo.",
      },
    ],
  },

  assisted: {
    eyebrow: "Assisted buying",
    title: "Why buying from Japan usually needs help",
    subtitle:
      "Most Japanese platforms are built for domestic buyers. A purchase from Argentina typically requires all of the following.",
    barriers: {
      japaneseAccount: { title: "A Japanese account", desc: "Many platforms require a locally registered account." },
      localAddress: { title: "A local address", desc: "Sellers often ship only to an address inside Japan." },
      paymentMethods: { title: "Japanese payment methods", desc: "Checkout frequently rejects foreign cards." },
      sellerComms: { title: "Seller communication", desc: "Questions and confirmations are handled in Japanese." },
      bidding: { title: "Auction bidding", desc: "Auctions close on Japanese time with no second chance." },
      domesticShipping: {
        title: "Domestic shipping coordination",
        desc: "Items must first be consolidated inside Japan.",
      },
    },
    note: "US1 Miami can facilitate eligible purchases once all costs are confirmed with you. We cannot guarantee that every item will be available, won at auction, or eligible for transport — if a purchase cannot be completed, we tell you before you commit.",
  },

  conditions: {
    eyebrow: "Important conditions",
    title: "What to know before you commit",
    subtitle:
      "Japanese sourcing involves auctions and used goods, which carry conditions that a new retail purchase does not.",
    items: {
      auctionsFinal: {
        title: "Auction purchases may be final",
        desc: "Auction results are often binding and non-returnable once won.",
      },
      usedWear: {
        title: "Used products may show wear",
        desc: "Second-hand items may have wear, missing boxes or incomplete accessories.",
      },
      sellerDescription: {
        title: "The seller's description governs",
        desc: "Item condition is defined by the seller's own description and grading.",
      },
      restricted: {
        title: "Some items require review",
        desc: "Batteries, liquids, oversized products and restricted materials require review before purchase.",
      },
      customs: {
        title: "Customs and duties may apply",
        desc: "Customs charges, duties or special fees may apply and are not included in the product price.",
      },
      timing: {
        title: "Delivery time varies",
        desc: "Final timing depends on seller handling, domestic Japanese shipping and international transport.",
      },
      noWarranty: {
        title: "We do not warranty third-party products",
        desc: "US1 Miami does not manufacture or warranty the products purchased on your behalf.",
      },
    },
  },

  finalCta: {
    title: "Japan is full of hard-to-find products. We help you bring them home.",
    body: "Send us a link or tell us what you are hunting for. We will review availability and confirm the full cost before anything is purchased.",
    ctaPrimary: "Send a product link",
    ctaSecondary: "Request a search",
  },
}

export type JapanDictionary = typeof japanEn

export const japanEs: JapanDictionary = {
  meta: {
    title: "Comprá en Japón y recibilo en Argentina | US1 Miami",
    description:
      "Accedé a subastas, marketplaces y tiendas de segunda mano de Japón para encontrar juegos retro, coleccionables, figuras y artículos raros. Te ayudamos a comprarlos y coordinamos la entrega en Argentina, con cotización personalizada en cada pedido.",
    ogAlt: "Una calle de Tokio con tiendas de segunda mano de hobby y electrónica al atardecer",
    home: "Inicio",
    breadcrumb: "Japan",
  },

  hero: {
    eyebrow: "US1 MIAMI JAPAN",
    title: "Comprá directamente en Japón. Recibilo en Argentina.",
    body: "Accedé a subastas, marketplaces y tiendas japonesas para encontrar productos exclusivos, coleccionables y artículos difíciles de conseguir.",
    quoteValue: "Cotización personalizada",
    quoteNote: "Cotización personalizada según producto y envío.",
    ctaPrimary: "Solicitar una compra",
    ctaSecondary: "Explorar cómo funciona",
    routeLabel: "Ruta del envío",
    route: { japan: "Japón", miami: "Miami", argentina: "Argentina" },
    routeNote: "Comprado en Japón, consolidado en Miami, entregado en Argentina.",
    imageAlt:
      "Una calle angosta de Tokio al atardecer con pequeñas tiendas de segunda mano de hobby y electrónica",
  },

  marketplaces: {
    label: "Marketplaces y tiendas de Japón",
    disclaimer:
      "Las plataformas y tiendas mostradas son ejemplos de dónde podemos buscar por vos. US1 Miami es un servicio independiente de compra y reenvío, y no está afiliado, autorizado, avalado ni patrocinado por ninguna de ellas. Todos los nombres y marcas pertenecen a sus respectivos propietarios.",
  },

  brands: {
    label: "Marcas japonesas que buscan nuestros clientes",
    disclaimer:
      "Estas marcas se muestran como ejemplos de productos solicitados con frecuencia. US1 Miami no es socio oficial, revendedor autorizado ni distribuidor de ninguna de ellas, y su mención no implica afiliación ni respaldo. Todas las marcas pertenecen a sus respectivos propietarios.",
  },

  categories: {
    eyebrow: "Qué podés encontrar",
    title: "Lo que mejor se consigue en Japón",
    subtitle:
      "De consolas retro a coleccionables sellados, estas son las categorías que más nos piden buscar.",
    items: {
      retroConsoles: { title: "Consolas retro", desc: "Consolas regionales japonesas, portátiles y hardware en caja." },
      videoGames: { title: "Videojuegos", desc: "Cartuchos, discos y lanzamientos exclusivos de Japón." },
      controllers: { title: "Joysticks y accesorios", desc: "Mandos, cables, memory cards y periféricos." },
      figures: { title: "Figuras y estatuas", desc: "Figuras a escala, prize figures y piezas de exhibición." },
      plush: { title: "Peluches", desc: "Peluches de personajes, llaveros y ediciones limitadas." },
      tradingCards: { title: "Trading cards", desc: "Cartas sueltas, sobres sellados, cajas y promos." },
      modelKits: { title: "Model kits", desc: "Kits de plástico para armar, herramientas y piezas de detalle." },
      animeMerch: { title: "Merchandising de anime", desc: "Art books, soundtracks, indumentaria y goods." },
      vintageAudio: { title: "Audio vintage", desc: "Cassetteras, receivers, auriculares y parlantes." },
      retroElectronics: { title: "Electrónica old-school", desc: "Dispositivos de consumo vintage y curiosidades." },
      cameras: { title: "Cámaras", desc: "Cuerpos de película, lentes, compactas y accesorios." },
      rareCollectibles: { title: "Coleccionables raros", desc: "Artículos discontinuados, regionales y difíciles de conseguir." },
    },
  },

  sources: {
    eyebrow: "Fuentes japonesas destacadas",
    title: "Dónde buscamos por vos",
    subtitle:
      "Cada plataforma se especializa en algo distinto. Contanos qué buscás y revisamos las que correspondan.",
    items: {
      yahooAuctions: { name: "Yahoo! Auctions Japan", desc: "Subastas y productos usados raros de vendedores particulares." },
      mercari: { name: "Mercari Japan", desc: "Marketplace de segunda mano y coleccionables." },
      amazonJapan: { name: "Amazon Japan", desc: "Productos nuevos y ediciones exclusivas de Japón." },
      hardOff: { name: "Hard Off", desc: "Electrónica, consolas y equipos de audio usados." },
      hobbyOff: { name: "Hobby Off", desc: "Juguetes, figuras, cartas y productos de hobby." },
      offHouse: { name: "Off House", desc: "Productos de segunda mano para el hogar y lifestyle." },
      bookOff: { name: "Book Off", desc: "Juegos, libros, medios y coleccionables." },
      surugayaMandarake: {
        name: "Suruga-ya y Mandarake",
        desc: "Coleccionables especializados y artículos de cultura pop.",
      },
    },
  },

  how: {
    eyebrow: "Cómo funciona",
    title: "Del enlace que encontraste al paquete en tu puerta",
    steps: {
      request: {
        title: "Enviános el enlace o describí el producto",
        desc: "Compartí el enlace del producto, o contanos qué buscás y lo buscamos por vos.",
      },
      review: {
        title: "Revisamos precio, vendedor y opciones",
        desc: "Verificamos la publicación, el vendedor y las opciones de compra realmente disponibles.",
      },
      approve: {
        title: "Aprobás el total",
        desc: "Confirmamos todos los costos con vos antes de comprar nada.",
      },
      purchase: {
        title: "Se compra y se recibe en Japón",
        desc: "Completamos la compra y recibimos el producto en nuestro punto de recepción en Japón.",
      },
      prepare: {
        title: "Se prepara para el transporte internacional",
        desc: "Se revisa, embala y documenta el producto para su tramo internacional.",
      },
      deliver: {
        title: "Coordinamos la entrega en Argentina",
        desc: "Gestionamos la ruta hasta la entrega final y te mantenemos al día.",
      },
    },
  },

  handling: {
    eyebrow: "Entre la subasta y tu puerta",
    title: "Recibido en Japón, consolidado y despachado",
    description:
      "Los artículos ganados y comprados se entregan en nuestro punto de recepción en Japón, se revisan y se embalan para su tramo internacional, y después se despachan vía Miami hacia Argentina.",
    imageAlt:
      "Paquetes pequeños de Japón siendo envueltos en papel de seda y agrupados en una sola caja de exportación sobre una mesa de clasificación",
    points: [
      {
        label: "Recibido en Japón",
        detail: "Recibimos el paquete en nuestro punto en Japón, así el vendedor solo envía a nivel nacional.",
      },
      {
        label: "Revisado y embalado",
        detail: "Cada artículo se inspecciona, se embala y se documenta antes de su tramo internacional.",
      },
      {
        label: "Despachado vía Miami",
        detail: "Los paquetes se consolidan y viajan de Japón a Miami y a Argentina, por la misma ruta que el resto de nuestra carga.",
      },
    ],
  },

  assisted: {
    eyebrow: "Compra asistida",
    title: "Por qué comprar en Japón casi siempre necesita ayuda",
    subtitle:
      "La mayoría de las plataformas japonesas están pensadas para compradores locales. Una compra desde Argentina suele requerir todo lo siguiente.",
    barriers: {
      japaneseAccount: { title: "Una cuenta japonesa", desc: "Muchas plataformas exigen una cuenta registrada localmente." },
      localAddress: { title: "Una dirección local", desc: "Los vendedores suelen enviar solo a una dirección en Japón." },
      paymentMethods: { title: "Medios de pago japoneses", desc: "El checkout con frecuencia rechaza tarjetas extranjeras." },
      sellerComms: { title: "Comunicación con el vendedor", desc: "Las consultas y confirmaciones se gestionan en japonés." },
      bidding: { title: "Pujas en subastas", desc: "Las subastas cierran en horario japonés y no dan revancha." },
      domesticShipping: {
        title: "Coordinación de envíos internos",
        desc: "Los productos primero deben consolidarse dentro de Japón.",
      },
    },
    note: "US1 Miami puede facilitar compras elegibles una vez que confirmamos todos los costos con vos. No podemos garantizar que todo producto esté disponible, se gane en subasta o sea elegible para transporte: si una compra no puede completarse, te lo avisamos antes de que te comprometas.",
  },

  conditions: {
    eyebrow: "Condiciones importantes",
    title: "Lo que tenés que saber antes de comprometerte",
    subtitle:
      "Comprar en Japón implica subastas y productos usados, con condiciones que una compra nueva en tienda no tiene.",
    items: {
      auctionsFinal: {
        title: "Las subastas pueden ser definitivas",
        desc: "Los resultados de subasta suelen ser vinculantes y sin devolución una vez ganados.",
      },
      usedWear: {
        title: "Los productos usados pueden tener desgaste",
        desc: "Los artículos de segunda mano pueden presentar uso, faltar la caja o tener accesorios incompletos.",
      },
      sellerDescription: {
        title: "Manda la descripción del vendedor",
        desc: "El estado del producto queda definido por la descripción y clasificación del propio vendedor.",
      },
      restricted: {
        title: "Algunos productos requieren revisión",
        desc: "Baterías, líquidos, productos voluminosos y materiales restringidos requieren revisión antes de comprar.",
      },
      customs: {
        title: "Pueden aplicarse aduana e impuestos",
        desc: "Pueden aplicarse cargos aduaneros, impuestos o tasas especiales, no incluidos en el precio del producto.",
      },
      timing: {
        title: "El plazo de entrega varía",
        desc: "El plazo final depende de la gestión del vendedor, el envío interno en Japón y el transporte internacional.",
      },
      noWarranty: {
        title: "No damos garantía de productos de terceros",
        desc: "US1 Miami no fabrica ni garantiza los productos que compramos por tu cuenta.",
      },
    },
  },

  finalCta: {
    title: "Japón está lleno de cosas difíciles de encontrar. Nosotros te ayudamos a traerlas.",
    body: "Enviános un enlace o contanos qué estás buscando. Revisamos la disponibilidad y confirmamos el costo total antes de comprar nada.",
    ctaPrimary: "Enviar enlace del producto",
    ctaSecondary: "Solicitar búsqueda",
  },
}
