"use client"

import { useActionState, useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, MapPin, User, ShieldCheck } from "lucide-react"
import { registerCustomer, type RegisterState } from "@/app/actions/auth"

const PROVINCES = [
  "Buenos Aires",
  "CABA",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
]

const inputClass =
  "w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-navy shadow-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
const labelClass = "mb-1.5 block text-sm font-medium text-navy"

export function RegisterForm() {
  const router = useRouter()
  const [showPw, setShowPw] = useState(false)
  const [state, formAction, pending] = useActionState<RegisterState, FormData>(
    async (prev, formData) => {
      const result = await registerCustomer(prev, formData)
      if (result.ok) {
        router.push("/panel?welcome=1")
        router.refresh()
      }
      return result
    },
    {},
  )

  return (
    <form action={formAction} className="space-y-8">
      {/* Personal information */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <User className="h-4.5 w-4.5" />
          </span>
          <h2 className="text-lg font-semibold text-navy">Información personal</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="firstName">
              Nombre
            </label>
            <input id="firstName" name="firstName" required className={inputClass} placeholder="María" />
          </div>
          <div>
            <label className={labelClass} htmlFor="lastName">
              Apellido
            </label>
            <input id="lastName" name="lastName" required className={inputClass} placeholder="González" />
          </div>
          <div>
            <label className={labelClass} htmlFor="phone">
              Teléfono
            </label>
            <input id="phone" name="phone" className={inputClass} placeholder="+54 11 5555-1234" />
          </div>
          <div>
            <label className={labelClass} htmlFor="email">
              Email
            </label>
            <input id="email" name="email" type="email" required className={inputClass} placeholder="maria@email.com" />
          </div>
          <div>
            <label className={labelClass} htmlFor="password">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPw ? "text" : "password"}
                required
                minLength={8}
                className={inputClass}
                placeholder="Mínimo 8 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-navy"
                aria-label={showPw ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPw ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>
          <div>
            <label className={labelClass} htmlFor="confirm">
              Confirmar contraseña
            </label>
            <input
              id="confirm"
              name="confirm"
              type={showPw ? "text" : "password"}
              required
              className={inputClass}
              placeholder="Repetí la contraseña"
            />
          </div>
        </div>
      </section>

      {/* Argentina delivery address */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MapPin className="h-4.5 w-4.5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-navy">Dirección de entrega en Argentina</h2>
            <p className="text-sm text-muted-foreground">Donde recibirás tus envíos consolidados.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label className={labelClass} htmlFor="street">
              Calle
            </label>
            <input id="street" name="street" required className={inputClass} placeholder="Av. Corrientes" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="streetNumber">
              Número
            </label>
            <input id="streetNumber" name="streetNumber" required className={inputClass} placeholder="1234" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="floor">
              Piso
            </label>
            <input id="floor" name="floor" className={inputClass} placeholder="5" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="apartment">
              Departamento
            </label>
            <input id="apartment" name="apartment" className={inputClass} placeholder="B" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="postalCode">
              Código postal
            </label>
            <input id="postalCode" name="postalCode" required className={inputClass} placeholder="C1043" />
          </div>
          <div className="sm:col-span-3">
            <label className={labelClass} htmlFor="city">
              Ciudad
            </label>
            <input id="city" name="city" required className={inputClass} placeholder="Buenos Aires" />
          </div>
          <div className="sm:col-span-3">
            <label className={labelClass} htmlFor="province">
              Provincia
            </label>
            <select id="province" name="province" required className={inputClass} defaultValue="">
              <option value="" disabled>
                Seleccioná una provincia
              </option>
              {PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-6">
            <label className={labelClass} htmlFor="references">
              Referencias adicionales <span className="text-muted-foreground">(opcional)</span>
            </label>
            <input
              id="references"
              name="references"
              className={inputClass}
              placeholder="Entre calles, timbre, horarios de entrega…"
            />
          </div>
        </div>
      </section>

      {/* Consents */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="h-4.5 w-4.5" />
          </span>
          <h2 className="text-lg font-semibold text-navy">Condiciones</h2>
        </div>
        <div className="space-y-3">
          {[
            { name: "acceptedTerms", label: "Acepto los Términos y condiciones" },
            { name: "acceptedPrivacy", label: "Acepto la Política de privacidad" },
            { name: "acceptedProhibited", label: "Acepto la Política de mercadería prohibida" },
            { name: "acceptedStorage", label: "Acepto las Condiciones de almacenamiento y consolidación" },
          ].map((c) => (
            <label
              key={c.name}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 transition-colors hover:border-primary/40"
            >
              <input
                type="checkbox"
                name={c.name}
                className="h-4.5 w-4.5 rounded border-border text-primary focus:ring-primary/30"
              />
              <span className="text-sm text-navy">{c.label}</span>
            </label>
          ))}
        </div>
      </section>

      {state.error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_12px_28px_-10px_rgba(15,125,255,0.85)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        {pending ? "Creando tu dirección…" : "Crear mi dirección"}
      </button>
    </form>
  )
}
