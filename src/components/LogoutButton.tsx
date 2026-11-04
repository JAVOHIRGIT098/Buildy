'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { logoutAction } from '@/app/(frontend)/actions'

export function LogoutButton() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  return (
    <div>
      <button
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-3 text-sm font-bold hover:bg-white/10 disabled:opacity-60"
        onClick={async () => {
          setPending(true)
          try {
            await logoutAction()
            window.dispatchEvent(new Event('buildy-session-change'))
            router.push('/')
            router.refresh()
          } catch {
            setError('Chiqishda xatolik yuz berdi. Qayta urinib ko‘ring.')
            setPending(false)
          }
        }}
      >
        <LogOut className="h-4 w-4" />
        {pending ? 'Chiqilmoqda...' : 'Chiqish'}
      </button>
      {error && (
        <p role="status" className="mt-2 text-xs text-amber-300">
          {error}
        </p>
      )}
    </div>
  )
}
