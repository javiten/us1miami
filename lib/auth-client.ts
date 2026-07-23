'use client'

import { createAuthClient } from 'better-auth/react'

// CUSTOMER scope client → talks to /api/auth and the `better-auth` cookie.
export const authClient = createAuthClient()

// ADMIN scope client → talks to /api/auth-admin and the `us1_admin` cookie, so
// admin sign-in/out never touches the customer session cookie (and vice versa).
export const adminAuthClient = createAuthClient({ basePath: '/api/auth-admin' })

export const { signIn, signUp, signOut, useSession } = authClient
