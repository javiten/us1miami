"use client"

import { useActionState, useState } from "react"
import { Pencil, X } from "lucide-react"
import { updateCustomer, type AdminActionState } from "@/app/actions/admin-actions"

type Customer = {
  id: string
  name: string | null
  phone: string | null
}

type Profile = {
  firstName: string | null
  lastName: string | null
  street: string | null
  streetNumber: string | null
  floor: string | null
  apartment: string | null
  city: string | null
  province: string | null
  postalCode: string | null
  references: string | null
} | null

export function CustomerEditForm({ customer, profile }: { customer: Customer; profile: Profile }) {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState<AdminActionState, FormData>(async (prev, fd) => {
    const res = await updateCustomer(prev, fd)
    if (res.ok) setOpen(false)
    return res
  }, {})

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Pencil className="h-3.5 w-3.5" /> Editar cliente
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} aria-hidden />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Editar cliente</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form action={action} className="space-y-3">
          <input type="hidden" name="userId" value={customer.id} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input name="name" label="Nombre completo *" defaultValue={customer.name ?? ""} />
            <Input name="phone" label="Teléfono" defaultValue={customer.phone ?? ""} />
            <Input name="firstName" label="Nombre (entrega)" defaultValue={profile?.firstName ?? ""} />
            <Input name="lastName" label="Apellido (entrega)" defaultValue={profile?.lastName ?? ""} />
            <Input name="street" label="Calle" defaultValue={profile?.street ?? ""} />
            <Input name="streetNumber" label="Número" defaultValue={profile?.streetNumber ?? ""} />
            <Input name="floor" label="Piso" defaultValue={profile?.floor ?? ""} />
            <Input name="apartment" label="Depto" defaultValue={profile?.apartment ?? ""} />
            <Input name="city" label="Ciudad" defaultValue={profile?.city ?? ""} />
            <Input name="province" label="Provincia" defaultValue={profile?.province ?? ""} />
            <Input name="postalCode" label="Código postal" defaultValue={profile?.postalCode ?? ""} />
            <Input name="references" label="Referencias" defaultValue={profile?.references ?? ""} />
          </div>
          {state.error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{state.error}</p>
          )}
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={pending}
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {pending ? "Guardando…" : "Guardar cambios"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Input({ name, label, defaultValue }: { name: string; label: string; defaultValue: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
      />
    </label>
  )
}
