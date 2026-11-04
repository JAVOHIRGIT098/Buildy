'use client'

import { useActionState } from 'react'
import { contactAction } from '@/app/(frontend)/actions'

export function ContactForm() {
  const [state, action, pending] = useActionState(contactAction, { ok: false, message: '' })
  return (
    <form action={action} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
      <div className="grid gap-4">
        <label className="field-label">
          Ism
          <input
            name="name"
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
            className="field"
          />
        </label>
        <label className="field-label">
          Email
          <input
            name="email"
            required
            type="email"
            maxLength={160}
            autoComplete="email"
            className="field"
          />
        </label>
        <label className="field-label">
          Xabar
          <textarea
            name="message"
            required
            minLength={10}
            maxLength={2000}
            rows={5}
            className="field resize-none"
          />
        </label>
        <div hidden>
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <button disabled={pending || state.ok} className="btn-primary disabled:opacity-60">
          {pending ? 'Yuborilmoqda...' : state.ok ? 'Xabar qabul qilindi' : 'Xabar yuborish'}
        </button>
        <p role="status" className={`text-sm ${state.ok ? 'text-emerald-700' : 'text-red-700'}`}>
          {state.message}
        </p>
        <p className="text-xs text-slate-500">
          Xabar xavfsiz saqlanadi. Email jo‘natish xizmati hali ulanmagan.
        </p>
      </div>
    </form>
  )
}
