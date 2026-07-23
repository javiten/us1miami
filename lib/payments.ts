// Payment service abstraction. Stripe is not wired yet — this provides a stable
// interface plus placeholder env vars so Stripe Checkout / Payment Links can be
// connected later without touching call sites.

export type CheckoutSession = {
  id: string
  url: string
  status: "pending" | "complete"
  provider: "placeholder" | "stripe"
}

const STRIPE_ENABLED = Boolean(process.env.STRIPE_SECRET_KEY)

export async function createDepositCheckout(params: {
  userId: string
  amountUsd: number
}): Promise<CheckoutSession> {
  if (STRIPE_ENABLED) {
    // TODO: create a real Stripe Checkout Session here using STRIPE_SECRET_KEY.
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    // const session = await stripe.checkout.sessions.create({ ... })
    // return { id: session.id, url: session.url!, status: "pending", provider: "stripe" }
  }

  // Placeholder session — resolved client-side by the simulated deposit action.
  return {
    id: `placeholder_${Date.now()}`,
    url: "#simulated",
    status: "pending",
    provider: "placeholder",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as CheckoutSession & Record<string, unknown>
}

export function isStripeConfigured(): boolean {
  return STRIPE_ENABLED
}
