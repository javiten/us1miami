export function money(value: string | number | null | undefined): string {
  const n = typeof value === "string" ? Number.parseFloat(value) : (value ?? 0)
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0)
}
