import Link from "next/link"
import * as Icons from "lucide-react"
import { requirePermission } from "@/lib/session"
import { getCustomersList } from "@/lib/queries/admin"
import { PageHeader, Card, EmptyState } from "@/components/portal/ui"
import { money } from "@/lib/format"

export const metadata = { title: "Clientes — Admin US1 Miami" }

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  await requirePermission("customers.view")
  const { q } = await searchParams
  const customers = await getCustomersList(q?.trim() || undefined)

  return (
    <div>
      <PageHeader title="Clientes" description="Buscá y gestioná las cuentas de los clientes de US1 Miami." />

      <Card className="mb-4 p-4">
        <form className="flex gap-2" action="/admin/clientes">
          <div className="relative flex-1">
            <Icons.Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              name="q"
              defaultValue={q ?? ""}
              placeholder="Buscar por nombre, email o número de box…"
              className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-3.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            Buscar
          </button>
        </form>
      </Card>

      {customers.length === 0 ? (
        <EmptyState icon="Users" title="Sin resultados" description="No encontramos clientes con ese criterio." />
      ) : (
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-semibold">Cliente</th>
                  <th className="px-5 py-3 font-semibold">Box</th>
                  <th className="px-5 py-3 font-semibold">Ubicación</th>
                  <th className="px-5 py-3 text-right font-semibold">Saldo</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {customers.map((c) => (
                  <tr key={c.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-5 py-3">
                      <p className="font-medium text-navy">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.email}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                        {c.boxNumber ?? "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {c.city ? `${c.city}, ${c.province ?? ""}` : "—"}
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-navy">{money(c.available)}</td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/admin/clientes/${c.id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        Ver ficha
                        <Icons.ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
