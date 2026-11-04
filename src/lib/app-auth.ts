import 'server-only'

import { cookies } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import { createPayloadRequest, logoutOperation } from 'payload'

const COOKIE_NAME = 'app-session'

export function createAppAuth(appUserCollection: 'users') {
  return {
    async currentUser() {
      const token = (await cookies()).get(COOKIE_NAME)?.value
      if (!token) return null

      const payload = await getPayloadClient()
      const authHeaders = new Headers({ Authorization: `JWT ${token}` })
      const { user } = await payload.auth({ headers: authHeaders })
      if (!user || user.collection !== appUserCollection) return null
      return user
    },
    async login(email: string, password: string) {
      const payload = await getPayloadClient()
      const result = await payload.login({
        collection: appUserCollection,
        data: { email, password },
      })
      if (!result.token || !result.exp) throw new Error('Login failed')
      await setAppSession(result.token, result.exp)
    },
    async logout() {
      try {
        const user = await this.currentUser()
        if (user) {
          const payload = await getPayloadClient()
          const req = await createPayloadRequest({ payload, user })
          await logoutOperation({ collection: payload.collections[appUserCollection], req })
        }
      } finally {
        await clearAppSession()
      }
    },
  }
}

export const appAuth = createAppAuth('users')
export const getCurrentUser = () => appAuth.currentUser()

async function setAppSession(token: string, expiresAt: number) {
  const store = await cookies()
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(expiresAt * 1000),
  })
}

async function clearAppSession() {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}
