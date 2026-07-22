import { requireAdmin } from "@/lib/session"
import { getAuditLog } from "@/lib/queries/admin"
import { PageHeader, Card } from "@/components/portal/ui"

const ACTION_LABELS: Record<string, string> = {
  CUSTOMER_REGISTERED: "Cliente registrado",
  PACKAGE_RECEIVED: "Paquete recibido",
  PACKAGE_UPDATED: "Paquete actualizado",
  WALLET_ADJUSTED: "Billetera ajustada",
  WALLET_DEPOSIT: "Depósito en billetera",
  PROFILE_UPDATED: "Perfil actualizado",
  PREALERT_CREATED: "Pre-alerta creada",
  CONSOLIDATION_REQUESTED: "Consolidación solicitada",
  ADMIN_LOGIN: "Ingreso de administrador",
}

export default async function AdminAuditPage() {
  await requireAdmin(["SUPER_ADMIN"])
  const rows = await getAuditLog()

  return (
    <div>
      <PageHeader
        title="Auditoría"
        description="Registro inmutable de todas las acciones sensibles del sistema."
      />

      <Card className="p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-6 py-3 font-medium">Fecha</th>
              <th className="px-6 py-3 font-medium">Actor</th>
              <th className="px-6 py-3 font-medium">Acción</th>
              <th className="px-6 py-3 font-medium">Entidad</th>
              <th className="px-6 py-3 font-medium">IP</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                  No hay registros de auditoría todavía.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-b border-border/60 last:border-0 hover:bg-muted/40">
                  <td className="px-6 py-3 text-muted-foreground">
                    {new Date(r.createdAt).toLocaleString("es-AR")}
                  </td>
                  <td className="px-6 py-3 text-foreground">{r.actorName ?? "Sistema"}</td>
                  <td className="px-6 py-3">
                    <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-navy">
                      {ACTION_LABELS[r.action] ?? r.action}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-mono text-xs text-muted-foreground">
                    {r.entityType ? `${r.entityType}${r.entityId ? `#${r.entityId}` : ""}` : "—"}
                  </td>
                  <td className="px-6 py-3 font-mono text-xs text-muted-foreground">{r.ipAddress ?? "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
