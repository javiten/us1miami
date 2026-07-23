"use client"

import { useActionState } from "react"
import { updateProfile, type ActionState } from "@/app/actions/customer-actions"

type Profile = {
  phone: string | null
  street: string | null
  streetNumber: string | null
  floor: string | null
  apartment: string | null
  city: string | null
  province: string | null
  postalCode: string | null
  references: string | null
}

function Field({
  label,
  name,
  defaultValue,
  required,
  className,
}: {
  label: string
  name: string
  defaultValue?: string | null
  required?: boolean
  className?: string
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-navy">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <input
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  )
}

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(updateProfile, {})

  return (
    <form action={action} className="space-y-4">
      <Field label="Teléfono" name="phone" defaultValue={profile.phone} />
      <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
        <Field label="Calle" name="street" defaultValue={profile.street} required />
        <Field label="Número" name="streetNumber" defaultValue={profile.streetNumber} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Piso" name="floor" defaultValue={profile.floor} />
        <Field label="Departamento" name="apartment" defaultValue={profile.apartment} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ciudad" name="city" defaultValue={profile.city} required />
        <Field label="Provincia" name="province" defaultValue={profile.province} required />
      </div>
      <Field label="Código postal" name="postalCode" defaultValue={profile.postalCode} required />
      <Field label="Referencias de entrega" name="references" defaultValue={profile.references} />

      {state.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {pending ? "Guardando…" : "Guardar cambios"}
      </button>
    </form>
  )
}
