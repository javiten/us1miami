import { authAdmin } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

// Admin auth scope. Mounted at /api/auth-admin so it sets/reads the separate
// `us1_admin` session cookie, independent of the customer scope at /api/auth.
export const { GET, POST } = toNextJsHandler(authAdmin.handler)
