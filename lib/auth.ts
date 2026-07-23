import { betterAuth, type BetterAuthOptions } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'
import { pool } from '@/lib/db'

const baseURL =
  process.env.BETTER_AUTH_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.V0_RUNTIME_URL)

const trustedOrigins = [
  ...(process.env.V0_RUNTIME_URL ? [process.env.V0_RUNTIME_URL] : []),
  ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
    : []),
  // v0 preview sandboxes are served from rotating *.vercel.run hosts; trust
  // them via wildcard so login works in preview without weakening production.
  'https://*.vercel.run',
  'https://*.vercel.app',
]

// In dev (v0 preview iframe), force cross-site cookies so the session cookie
// is stored by the browser.
const devCookieAttributes =
  process.env.NODE_ENV === 'development'
    ? { sameSite: 'none' as const, secure: true }
    : undefined

/**
 * Shared config for both auth scopes. Admin and customer run as SEPARATE Better
 * Auth instances over the SAME database, differing only by cookie name (via
 * `advanced.cookiePrefix`) and API `basePath`. Because the session cookie names
 * differ, an admin session and a customer session can coexist in the same
 * browser without overwriting each other — signing into one no longer logs you
 * out of the other. Both instances share BETTER_AUTH_SECRET and the same
 * user/session/account tables, so accounts and sessions are fully compatible.
 */
function buildAuthConfig(cookiePrefix: string): BetterAuthOptions {
  return {
    database: pool,
    baseURL,
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
    },
    user: {
      additionalFields: {
        role: { type: 'string', required: false, defaultValue: 'CUSTOMER', input: false },
        adminRoles: { type: 'string[]', required: false, defaultValue: [], input: false },
        phone: { type: 'string', required: false, input: true },
        boxNumber: { type: 'string', required: false, input: false },
        mustChangePassword: { type: 'boolean', required: false, defaultValue: false, input: false },
      },
    },
    trustedOrigins,
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
    },
    advanced: {
      cookiePrefix,
      ...(devCookieAttributes ? { defaultCookieAttributes: devCookieAttributes } : {}),
    },
    // nextCookies() must be the last plugin: it lets server actions (e.g. logout)
    // set/clear the session cookie so sign-out takes effect without a manual refresh.
    plugins: [nextCookies()],
  }
}

/**
 * CUSTOMER scope. Keeps the default `better-auth` cookie prefix and the default
 * `/api/auth` basePath so existing customer sessions remain valid across this
 * change (no forced re-login for customers).
 */
export const auth = betterAuth(buildAuthConfig('better-auth'))

/**
 * ADMIN scope. Uses a distinct cookie prefix (`us1_admin` →
 * `us1_admin.session_token`) and its own API mount at `/api/auth-admin`, so the
 * admin session is stored in a separate cookie from the customer session.
 */
export const authAdmin = betterAuth({
  ...buildAuthConfig('us1_admin'),
  basePath: '/api/auth-admin',
})
