'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createRequestAction, type ActionResult } from '@/app/(frontend)/actions'

const initial: ActionResult = { ok: false, message: '' }

export function RequestForm({
  type,
  subject,
  buttonLabel,
  targetId,
  disabled = false,
}: {
  type: string
  subject: string
  buttonLabel: string
  targetId: string
  disabled?: boolean
}) {
  const [state, action, pending] = useActionState(createRequestAction, initial)
  const pathname = usePathname()
  return (
    <form action={action} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="subject" value={subject} />
      <input type="hidden" name="targetId" value={targetId} />
      <h3 className="text-lg font-extrabold text-[#172B4D]">{buttonLabel}</h3>
      <p className="mt-1 text-sm text-slate-500">
        Aloqa ma’lumotlaringiz faqat so‘rov bilan ishlash uchun ishlatiladi.
      </p>
      <textarea
        aria-label="So‘rov izohi"
        name="message"
        required
        minLength={10}
        maxLength={1000}
        disabled={disabled || state.ok}
        rows={4}
        className="field mt-5 resize-none"
        placeholder="Talabingiz, miqdor yoki muddat haqida yozing..."
      />
      {state.message && (
        <p
          role="status"
          className={`mt-3 rounded-lg px-3 py-2 text-sm ${state.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}
        >
          {state.message}
        </p>
      )}
      <button
        disabled={pending || disabled || state.ok}
        className="btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {disabled
          ? 'Hozir so‘rov qabul qilinmaydi'
          : state.ok
            ? 'So‘rov saqlandi'
            : pending
              ? 'Yuborilmoqda...'
              : buttonLabel}
      </button>
      {state.ok ? (
        <Link href="/dashboard" className="mt-4 block text-center text-sm font-bold text-[#172B4D]">
          So‘rovlarimni ko‘rish
        </Link>
      ) : (
        <Link
          href={`/login?next=${encodeURIComponent(pathname)}`}
          className="mt-4 block text-center text-sm font-bold text-[#172B4D]"
        >
          Hisobga kirish
        </Link>
      )}
    </form>
  )
}
