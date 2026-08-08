"use client"

import { useActionState, useEffect, useId, useRef, useState } from "react"
import { AlertCircle, CheckCircle2, Loader2, Paperclip, X } from "lucide-react"
import { useI18n } from "@/components/language-provider"
import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/automotive/section-heading"
import { submitAutomotiveQuote, type QuoteFormState } from "@/app/actions/automotive-actions"
import {
  AUTOMOTIVE_QUOTE_ANCHOR,
  PURCHASE_METHODS,
  QUOTE_FILE_ACCEPT,
  QUOTE_MAX_FILES,
  QUOTE_MAX_FILE_BYTES,
} from "@/lib/automotive"
import { track } from "@/lib/analytics"
import { cn } from "@/lib/utils"

const inputClass =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-navy shadow-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/40"

/** Shared label + error wrapper so every field stays consistent and accessible. */
function Field({
  label,
  name,
  error,
  optional,
  optionalLabel,
  children,
}: {
  label: string
  name: string
  error?: string
  optional?: boolean
  optionalLabel?: string
  children: (props: { id: string; describedBy?: string; invalid: boolean }) => React.ReactNode
}) {
  const id = `quote-${name}`
  const errorId = `${id}-error`

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="flex items-baseline gap-2 text-sm font-medium text-navy">
        {label}
        {optional ? (
          <span className="text-xs font-normal text-muted-foreground">{optionalLabel}</span>
        ) : null}
      </label>
      {children({ id, describedBy: error ? errorId : undefined, invalid: Boolean(error) })}
      {error ? (
        <p id={errorId} className="text-xs font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function QuoteForm() {
  const { t, locale } = useI18n()
  const c = t.automotive.form
  const [state, formAction, pending] = useActionState<QuoteFormState, FormData>(submitAutomotiveQuote, {})

  const formRef = useRef<HTMLFormElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])
  const [method, setMethod] = useState<string>("SELF")
  const [startedTracked, setStartedTracked] = useState(false)
  const consentId = useId()

  const errors = state.errors ?? {}

  // Move focus to the result banner so screen readers and keyboard users are
  // told the outcome instead of being left at the bottom of a long form.
  useEffect(() => {
    if (state.ok || errors.form) statusRef.current?.focus()
  }, [state.ok, errors.form])

  useEffect(() => {
    if (state.ok) {
      track("automotive_quote_submit", { purchase_method: method })
      formRef.current?.reset()
      setFiles([])
    }
  }, [state.ok])

  function onFirstInteraction() {
    if (startedTracked) return
    setStartedTracked(true)
    track("automotive_quote_start")
  }

  function onFilesChange(event: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(event.target.files ?? [])
    setFiles(picked.slice(0, QUOTE_MAX_FILES))
  }

  function removeFile(index: number) {
    const next = files.filter((_, i) => i !== index)
    setFiles(next)
    // The native file input cannot be mutated directly, so rebuild its list.
    const dt = new DataTransfer()
    next.forEach((f) => dt.items.add(f))
    if (fileInputRef.current) fileInputRef.current.files = dt.files
  }

  const filesHint = c.filesHint
    .replace("{max}", String(QUOTE_MAX_FILES))
    .replace("{size}", String(Math.round(QUOTE_MAX_FILE_BYTES / (1024 * 1024))))

  return (
    <section id={AUTOMOTIVE_QUOTE_ANCHOR} className="scroll-mt-24 bg-muted/40 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle} />

        <Reveal>
          <div className="mt-12 rounded-3xl border border-border bg-background p-6 shadow-sm sm:p-8">
            {/* Result banner: focusable and announced. */}
            <div
              ref={statusRef}
              tabIndex={-1}
              role="status"
              aria-live="polite"
              className={cn("outline-none", !state.ok && !errors.form && "sr-only")}
            >
              {state.ok ? (
                <div className="mb-8 flex gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-navy">{c.successTitle}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{c.success}</p>
                  </div>
                </div>
              ) : errors.form ? (
                <div className="mb-8 flex gap-3 rounded-2xl border border-destructive/25 bg-destructive/5 p-4">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                  <div>
                    <p className="text-sm font-semibold text-navy">{c.errorTitle}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{errors.form}</p>
                  </div>
                </div>
              ) : null}
            </div>

            <form
              ref={formRef}
              action={formAction}
              onFocusCapture={onFirstInteraction}
              noValidate
              className="flex flex-col gap-10"
            >
              {/* Locale travels with the submission so the server can reply in
                  the visitor's language. */}
              <input type="hidden" name="locale" value={locale} />

              {/* --- Contact ------------------------------------------------ */}
              <fieldset className="flex flex-col gap-5">
                {/* A legend is taken out of the flex flow, so `gap` never
                    applies to it — the bottom margin restores the rhythm. */}
                <legend className="mb-5 text-xs font-semibold uppercase tracking-widest text-primary">
                  {c.sections.contact}
                </legend>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={c.fields.firstName} name="firstName" error={errors.firstName}>
                    {({ id, describedBy, invalid }) => (
                      <input
                        id={id}
                        name="firstName"
                        required
                        autoComplete="given-name"
                        aria-invalid={invalid}
                        aria-describedby={describedBy}
                        className={cn(inputClass, invalid && "border-destructive")}
                      />
                    )}
                  </Field>

                  <Field label={c.fields.lastName} name="lastName" error={errors.lastName}>
                    {({ id, describedBy, invalid }) => (
                      <input
                        id={id}
                        name="lastName"
                        required
                        autoComplete="family-name"
                        aria-invalid={invalid}
                        aria-describedby={describedBy}
                        className={cn(inputClass, invalid && "border-destructive")}
                      />
                    )}
                  </Field>

                  <Field label={c.fields.email} name="email" error={errors.email}>
                    {({ id, describedBy, invalid }) => (
                      <input
                        id={id}
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder={c.placeholders.email}
                        aria-invalid={invalid}
                        aria-describedby={describedBy}
                        className={cn(inputClass, invalid && "border-destructive")}
                      />
                    )}
                  </Field>

                  <Field label={c.fields.phone} name="phone" error={errors.phone}>
                    {({ id, describedBy, invalid }) => (
                      <input
                        id={id}
                        name="phone"
                        type="tel"
                        required
                        autoComplete="tel"
                        placeholder={c.placeholders.phone}
                        aria-invalid={invalid}
                        aria-describedby={describedBy}
                        className={cn(inputClass, invalid && "border-destructive")}
                      />
                    )}
                  </Field>

                  <Field
                    label={c.fields.boxNumber}
                    name="boxNumber"
                    optional
                    optionalLabel={c.optional}
                    error={errors.boxNumber}
                  >
                    {({ id, describedBy, invalid }) => (
                      <input
                        id={id}
                        name="boxNumber"
                        placeholder={c.placeholders.boxNumber}
                        aria-invalid={invalid}
                        aria-describedby={describedBy}
                        className={cn(inputClass, invalid && "border-destructive")}
                      />
                    )}
                  </Field>
                </div>
              </fieldset>

              {/* --- Vehicle ------------------------------------------------ */}
              <fieldset className="flex flex-col gap-5">
                {/* A legend is taken out of the flex flow, so `gap` never
                    applies to it — the bottom margin restores the rhythm. */}
                <legend className="mb-5 text-xs font-semibold uppercase tracking-widest text-primary">
                  {c.sections.vehicle}
                </legend>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label={c.fields.year}
                    name="vehicleYear"
                    optional
                    optionalLabel={c.optional}
                    error={errors.vehicleYear}
                  >
                    {({ id, describedBy, invalid }) => (
                      <input
                        id={id}
                        name="vehicleYear"
                        inputMode="numeric"
                        placeholder={c.placeholders.year}
                        aria-invalid={invalid}
                        aria-describedby={describedBy}
                        className={cn(inputClass, invalid && "border-destructive")}
                      />
                    )}
                  </Field>

                  <Field label={c.fields.make} name="make" optional optionalLabel={c.optional}>
                    {({ id }) => (
                      <input id={id} name="make" placeholder={c.placeholders.make} className={inputClass} />
                    )}
                  </Field>

                  <Field label={c.fields.model} name="model" optional optionalLabel={c.optional}>
                    {({ id }) => (
                      <input id={id} name="model" placeholder={c.placeholders.model} className={inputClass} />
                    )}
                  </Field>

                  <Field label={c.fields.trim} name="trim" optional optionalLabel={c.optional}>
                    {({ id }) => (
                      <input id={id} name="trim" placeholder={c.placeholders.trim} className={inputClass} />
                    )}
                  </Field>

                  <Field label={c.fields.engine} name="engine" optional optionalLabel={c.optional}>
                    {({ id }) => (
                      <input id={id} name="engine" placeholder={c.placeholders.engine} className={inputClass} />
                    )}
                  </Field>

                  <Field
                    label={c.fields.vin}
                    name="vin"
                    optional
                    optionalLabel={c.optional}
                    error={errors.vin}
                  >
                    {({ id, describedBy, invalid }) => (
                      <input
                        id={id}
                        name="vin"
                        maxLength={17}
                        placeholder={c.placeholders.vin}
                        aria-invalid={invalid}
                        aria-describedby={describedBy}
                        // Uppercase the typed VIN without shouting the placeholder.
                        className={cn(
                          inputClass,
                          "uppercase placeholder:normal-case",
                          invalid && "border-destructive",
                        )}
                      />
                    )}
                  </Field>
                </div>
              </fieldset>

              {/* --- Part --------------------------------------------------- */}
              <fieldset className="flex flex-col gap-5">
                {/* A legend is taken out of the flex flow, so `gap` never
                    applies to it — the bottom margin restores the rhythm. */}
                <legend className="mb-5 text-xs font-semibold uppercase tracking-widest text-primary">
                  {c.sections.part}
                </legend>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={c.fields.partNumber} name="partNumber" optional optionalLabel={c.optional}>
                    {({ id }) => (
                      <input
                        id={id}
                        name="partNumber"
                        placeholder={c.placeholders.partNumber}
                        className={inputClass}
                      />
                    )}
                  </Field>

                  <Field
                    label={c.fields.quantity}
                    name="quantity"
                    error={errors.quantity}
                  >
                    {({ id, describedBy, invalid }) => (
                      <input
                        id={id}
                        name="quantity"
                        inputMode="numeric"
                        defaultValue={1}
                        aria-invalid={invalid}
                        aria-describedby={describedBy}
                        className={cn(inputClass, invalid && "border-destructive")}
                      />
                    )}
                  </Field>
                </div>

                <Field
                  label={c.fields.productUrl}
                  name="productUrl"
                  optional
                  optionalLabel={c.optional}
                  error={errors.productUrl}
                >
                  {({ id, describedBy, invalid }) => (
                    <input
                      id={id}
                      name="productUrl"
                      type="url"
                      placeholder={c.placeholders.productUrl}
                      aria-invalid={invalid}
                      aria-describedby={describedBy}
                      className={cn(inputClass, invalid && "border-destructive")}
                    />
                  )}
                </Field>

                <Field label={c.fields.description} name="description" error={errors.description}>
                  {({ id, describedBy, invalid }) => (
                    <textarea
                      id={id}
                      name="description"
                      required
                      rows={3}
                      placeholder={c.placeholders.description}
                      aria-invalid={invalid}
                      aria-describedby={describedBy}
                      className={cn(inputClass, "resize-y", invalid && "border-destructive")}
                    />
                  )}
                </Field>
              </fieldset>

              {/* --- Purchase & attachments --------------------------------- */}
              <fieldset className="flex flex-col gap-5">
                {/* A legend is taken out of the flex flow, so `gap` never
                    applies to it — the bottom margin restores the rhythm. */}
                <legend className="mb-5 text-xs font-semibold uppercase tracking-widest text-primary">
                  {c.sections.purchase}
                </legend>

                <div
                  role="radiogroup"
                  aria-label={c.fields.purchaseMethod}
                  aria-describedby={errors.purchaseMethod ? "quote-method-error" : undefined}
                  className="flex flex-col gap-2"
                >
                  <p className="text-sm font-medium text-navy">{c.fields.purchaseMethod}</p>
                  {PURCHASE_METHODS.map((value) => (
                    <label
                      key={value}
                      className={cn(
                        "flex cursor-pointer gap-3 rounded-xl border p-3.5 transition-colors",
                        method === value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40 hover:bg-muted/50",
                      )}
                    >
                      <input
                        type="radio"
                        name="purchaseMethod"
                        value={value}
                        checked={method === value}
                        onChange={() => setMethod(value)}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                      />
                      <span className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-navy">{c.purchaseMethods[value]}</span>
                        <span className="text-xs leading-relaxed text-muted-foreground">
                          {c.purchaseMethodHints[value]}
                        </span>
                      </span>
                    </label>
                  ))}
                  {errors.purchaseMethod ? (
                    <p id="quote-method-error" className="text-xs font-medium text-destructive">
                      {errors.purchaseMethod}
                    </p>
                  ) : null}
                </div>

                <Field
                  label={c.fields.estimatedPrice}
                  name="estimatedPrice"
                  optional
                  optionalLabel={c.optional}
                  error={errors.estimatedPrice}
                >
                  {({ id, describedBy, invalid }) => (
                    <input
                      id={id}
                      name="estimatedPrice"
                      inputMode="decimal"
                      placeholder={c.placeholders.estimatedPrice}
                      aria-invalid={invalid}
                      aria-describedby={describedBy}
                      className={cn(inputClass, invalid && "border-destructive")}
                    />
                  )}
                </Field>

                {/* Attachments */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="quote-attachments" className="text-sm font-medium text-navy">
                    {c.fields.files}{" "}
                    <span className="text-xs font-normal text-muted-foreground">{c.optional}</span>
                  </label>
                  <input
                    ref={fileInputRef}
                    id="quote-attachments"
                    name="attachments"
                    type="file"
                    multiple
                    accept={QUOTE_FILE_ACCEPT}
                    onChange={onFilesChange}
                    aria-describedby={cn("quote-files-hint", errors.attachments && "quote-files-error")}
                    className="sr-only"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-4 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-navy"
                  >
                    <Paperclip className="h-4 w-4" />
                    {files.length > 0 ? `${files.length} / ${QUOTE_MAX_FILES}` : c.filesEmpty}
                  </button>
                  <p id="quote-files-hint" className="text-xs text-muted-foreground">
                    {filesHint}
                  </p>
                  {errors.attachments ? (
                    <p id="quote-files-error" className="text-xs font-medium text-destructive">
                      {errors.attachments}
                    </p>
                  ) : null}

                  {files.length > 0 ? (
                    <ul className="mt-1 flex flex-col gap-1.5">
                      {files.map((file, index) => (
                        <li
                          key={`${file.name}-${index}`}
                          className="flex items-center justify-between gap-3 rounded-lg bg-muted/50 px-3 py-2"
                        >
                          <span className="truncate text-xs text-navy">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-background hover:text-destructive"
                          >
                            <span className="sr-only">
                              {c.removeFile} {file.name}
                            </span>
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                <Field label={c.fields.notes} name="notes" optional optionalLabel={c.optional}>
                  {({ id }) => (
                    <textarea
                      id={id}
                      name="notes"
                      rows={2}
                      placeholder={c.placeholders.notes}
                      className={cn(inputClass, "resize-y")}
                    />
                  )}
                </Field>
              </fieldset>

              {/* --- Consent + submit -------------------------------------- */}
              <div className="flex flex-col gap-5 border-t border-border pt-6">
                <label htmlFor={consentId} className="flex cursor-pointer gap-3">
                  <input
                    id={consentId}
                    type="checkbox"
                    required
                    className="mt-0.5 h-4 w-4 shrink-0 rounded accent-primary"
                  />
                  <span className="text-xs leading-relaxed text-muted-foreground">{c.consent}</span>
                </label>

                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {pending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {c.submitting}
                    </>
                  ) : (
                    c.submit
                  )}
                </button>
              </div>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
