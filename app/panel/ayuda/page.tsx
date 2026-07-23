import { requireCustomer } from "@/lib/session"
import { PageHeader, Card } from "@/components/portal/ui"
import * as Icons from "lucide-react"

export const metadata = { title: "Ayuda — US1 Miami" }

const FAQS: { q: string; a: string }[] = [
  {
    q: "¿Cómo recibo paquetes en mi casilla de Miami?",
    a: "Usá tu dirección de casilla (la encontrás en la sección \"Mi dirección\") como dirección de envío al comprar en cualquier tienda de Estados Unidos. Cuando el paquete llegue a nuestro depósito, lo vas a ver en \"Mis paquetes\".",
  },
  {
    q: "¿Qué es una prealerta?",
    a: "Es avisarnos que viene un paquete en camino. Cargá la tienda, el tracking y una descripción en \"Prealertar paquete\" para que podamos identificarlo apenas llegue a Miami.",
  },
  {
    q: "¿Qué es una consolidación?",
    a: "Es preparar uno o más de tus paquetes recibidos en un único envío hacia Argentina. Podés consolidar aunque sea un solo paquete; si tenés varios, combinarlos suele reducir el costo por kilo.",
  },
  {
    q: "¿Cómo se calcula el costo del envío?",
    a: "Se cobra por peso facturable, que es el mayor entre el peso real y el peso volumétrico del envío consolidado. Vas a ver el detalle en la factura antes de pagar.",
  },
  {
    q: "¿Cómo pago mis envíos?",
    a: "Desde \"Facturas\" podés pagar con saldo de tu billetera, tarjeta, efectivo o Mercado Pago. Una vez pagado, el envío queda habilitado para despacho.",
  },
  {
    q: "¿Cómo sigo el estado de mi envío?",
    a: "En \"Mis envíos\" ves el recorrido de cada consolidación: desde que la solicitás hasta que llega a Argentina.",
  },
]

export default async function HelpPage() {
  await requireCustomer()

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Ayuda"
        description="Resolvé tus dudas o contactate con nuestro equipo de soporte."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-base font-semibold text-navy">Preguntas frecuentes</h2>
            <div className="mt-3 divide-y divide-border">
              {FAQS.map((f) => (
                <details key={f.q} className="group py-3">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-medium text-navy [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <Icons.ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="text-base font-semibold text-navy">Contactanos</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Nuestro equipo responde de lunes a viernes.
            </p>
            <div className="mt-4 space-y-3">
              <a
                href="mailto:soporte@us1miami.com"
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm transition-colors hover:border-primary/40"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icons.Mail className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block font-medium text-navy">Correo</span>
                  <span className="block truncate text-muted-foreground">soporte@us1miami.com</span>
                </span>
              </a>
              <a
                href="https://wa.me/message"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm transition-colors hover:border-primary/40"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Icons.MessageCircle className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block font-medium text-navy">WhatsApp</span>
                  <span className="block truncate text-muted-foreground">Chat de soporte</span>
                </span>
              </a>
            </div>
          </Card>

          <Card>
            <h2 className="text-base font-semibold text-navy">Recursos</h2>
            <div className="mt-3 space-y-2 text-sm">
              <a href="/panel/direccion" className="flex items-center gap-2 text-primary hover:underline">
                <Icons.MapPin className="h-4 w-4" /> Ver mi dirección de casilla
              </a>
              <a href="/panel/paquetes" className="flex items-center gap-2 text-primary hover:underline">
                <Icons.Package className="h-4 w-4" /> Revisar mis paquetes
              </a>
              <a href="/panel/facturas" className="flex items-center gap-2 text-primary hover:underline">
                <Icons.Receipt className="h-4 w-4" /> Ver mis facturas
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
