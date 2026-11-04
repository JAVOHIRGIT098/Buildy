'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Brand } from './Brand'

const links = [
  ['Bozor', '/marketplace'],
  ['Mutaxassislar', '/professionals'],
  ['Ishlar', '/jobs'],
  ['AI yordamchi', '/ai-assistant'],
  ['Biz haqimizda', '/about'],
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  useEffect(() => {
    const controller = new AbortController()
    const update = async () => {
      try {
        const response = await fetch('/api/app-session', {
          cache: 'no-store',
          signal: controller.signal,
        })
        if (response.ok) setSignedIn(Boolean((await response.json()).signedIn))
      } catch {
        /* Preserve navigation when the session endpoint is unavailable. */
      }
    }
    void update()
    window.addEventListener('buildy-session-change', update)
    return () => {
      controller.abort()
      window.removeEventListener('buildy-session-change', update)
    }
  }, [])
  useEffect(() => {
    if (!open) return
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [open])
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between px-5 lg:px-8">
        <Brand />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Asosiy navigatsiya">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-semibold text-slate-600 transition hover:text-[#172B4D]"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <select
            className="rounded-lg border-0 bg-transparent px-2 py-2 text-sm font-bold text-slate-600"
            aria-label="Tilni tanlash"
            defaultValue="uz"
          >
            <option value="uz">UZ</option>
            <option disabled value="ru">
              RU · tez orada
            </option>
            <option disabled value="en">
              EN · soon
            </option>
          </select>
          <Link
            href={signedIn ? '/dashboard' : '/login'}
            className="rounded-xl px-4 py-2.5 text-sm font-bold text-[#172B4D] hover:bg-slate-100"
          >
            {signedIn ? 'Shaxsiy kabinet' : 'Kirish'}
          </Link>
          <Link
            href="/register"
            className="rounded-xl bg-[#F59E0B] px-5 py-2.5 text-sm font-extrabold text-[#172B4D] shadow-sm hover:bg-amber-400"
          >
            Ro‘yxatdan o‘tish
          </Link>
        </div>
        <button
          className="rounded-lg p-2 lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menyuni ochish"
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t border-slate-100 bg-white px-5 py-5 lg:hidden">
          <nav
            id="mobile-navigation"
            aria-label="Mobil navigatsiya"
            className="flex flex-col gap-1"
          >
            {links.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                {label}
              </Link>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link
                href={signedIn ? '/dashboard' : '/login'}
                onClick={() => setOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-center font-bold"
              >
                {signedIn ? 'Shaxsiy kabinet' : 'Kirish'}
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-[#F59E0B] px-4 py-3 text-center font-bold text-[#172B4D]"
              >
                Ro‘yxatdan o‘tish
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
