'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect } from 'react'
import { loginAction, registerAction, type ActionResult } from '@/app/(frontend)/actions'

const initial: ActionResult = { ok: false, message: '' }

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter()
  const action = mode === 'login' ? loginAction : registerAction
  const [state, formAction, pending] = useActionState(action, initial)

  useEffect(() => {
    if (!state.ok) return
    if (mode === 'login') {
      window.dispatchEvent(new Event('buildy-session-change'))
      const next = new URLSearchParams(window.location.search).get('next')
      const safeNext =
        next && /^\/(products|professionals|jobs)\/[a-z0-9-]+$/.test(next) ? next : '/dashboard'
      router.push(safeNext)
      router.refresh()
    } else router.push('/login')
  }, [state.ok, mode, router])

  return (
    <form action={formAction} className="mt-8 grid gap-4">
      {mode === 'register' && (
        <>
          <label className="field-label">
            To‘liq ism
            <input
              name="name"
              required
              minLength={2}
              maxLength={100}
              autoComplete="name"
              className="field"
              placeholder="Ismingiz"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="field-label">
              Telefon
              <input
                name="phone"
                type="tel"
                required
                maxLength={30}
                autoComplete="tel"
                className="field"
                placeholder="+998 90 123 45 67"
              />
            </label>
            <label className="field-label">
              Shahar
              <input
                name="city"
                required
                minLength={2}
                maxLength={80}
                className="field"
                defaultValue="Toshkent"
              />
            </label>
          </div>
          <label className="field-label">
            Hisob turi
            <select name="role" required className="field">
              <option value="customer">Mijoz</option>
              <option value="supplier">Yetkazib beruvchi / Do‘kon</option>
              <option value="professional">Usta / Mutaxassis</option>
              <option value="employer">Ish beruvchi / Kompaniya</option>
            </select>
          </label>
        </>
      )}
      <label className="field-label">
        Email
        <input
          name="email"
          type="email"
          required
          maxLength={160}
          autoComplete="email"
          className="field"
          placeholder="email@example.uz"
        />
      </label>
      <label className="field-label">
        Parol
        <input
          name="password"
          type="password"
          required
          minLength={8}
          maxLength={128}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          className="field"
          placeholder="Kamida 8 belgi"
        />
      </label>
      {state.message && (
        <p
          role="status"
          className={`rounded-xl px-4 py-3 text-sm ${state.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}
        >
          {state.message}
        </p>
      )}
      <button disabled={pending} className="btn-primary mt-2 min-h-12 disabled:opacity-60">
        {pending ? 'Kutilmoqda...' : mode === 'login' ? 'Tizimga kirish' : 'Hisob yaratish'}
      </button>
      <p className="text-center text-sm text-slate-500">
        {mode === 'login' ? (
          <>
            Hisobingiz yo‘qmi?{' '}
            <Link href="/register" className="font-bold text-[#172B4D]">
              Ro‘yxatdan o‘ting
            </Link>
          </>
        ) : (
          <>
            Hisobingiz bormi?{' '}
            <Link href="/login" className="font-bold text-[#172B4D]">
              Kirish
            </Link>
          </>
        )}
      </p>
    </form>
  )
}
