import { getCurrentUser } from '@/lib/app-auth'

export async function GET() {
  const user = await getCurrentUser()
  return Response.json(
    { signedIn: Boolean(user) },
    { headers: { 'Cache-Control': 'private, no-store' } },
  )
}
