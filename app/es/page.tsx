import type { Metadata } from "next"
import { SiteShell } from "@/components/site-shell"

export const metadata: Metadata = {
  title: "US1 Miami — Comprá en el mundo, recibí en Argentina",
  description:
    "US1 Miami es un courier internacional. Comprá en cualquier tienda del mundo, enviá todo a nuestro depósito en Miami y consolidamos y enviamos todo a Argentina por vía aérea en aproximadamente 7 días. Desde USD $55/kg.",
  alternates: {
    canonical: "/es",
    languages: {
      "es-AR": "/es",
      "en-US": "/en",
      "x-default": "/en",
    },
  },
  openGraph: {
    title: "US1 Miami — Comprá en el mundo, recibí en Argentina",
    description:
      "Comprá en todo el mundo, enviá a Miami y lo entregamos en Argentina en ~7 días. Recepción, almacenamiento y consolidación gratis.",
    locale: "es_AR",
    type: "website",
  },
}

export default function Page() {
  return <SiteShell initialLocale="es" forced />
}
