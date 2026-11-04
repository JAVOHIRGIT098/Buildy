'use client'

import Image from 'next/image'
import Link from 'next/link'
import { BriefcaseBusiness, CheckCircle2, MapPin, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { formatUZS } from '@/lib/buildy-format'

export type ProfessionalCardData = {
  id: string
  name: string
  slug: string
  profession: string
  location: string
  experienceYears: number
  startingPrice: number
  skills: string
  availability?: boolean | null
  isDemo?: boolean | null
  photo?: { url: string; alt: string; width: number; height: number } | null
}

export function ProfessionalsBrowser({ professionals }: { professionals: ProfessionalCardData[] }) {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('all')
  const filtered = useMemo(
    () =>
      professionals.filter(
        (person) =>
          `${person.name} ${person.profession} ${person.skills}`
            .toLowerCase()
            .includes(query.trim().toLowerCase()) &&
          (location === 'all' || person.location === location),
      ),
    [professionals, query, location],
  )

  return (
    <>
      <div className="mb-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">
        <label className="flex items-center gap-3 rounded-xl bg-slate-50 px-4">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            aria-label="Mutaxassis qidirish"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-12 w-full bg-transparent outline-none"
            placeholder="Kasb, ko‘nikma yoki ism..."
          />
        </label>
        <select
          aria-label="Mutaxassis hududi"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="min-h-12 rounded-xl border border-slate-200 px-3"
        >
          <option value="all">Barcha hududlar</option>
          {[...new Set(professionals.map((p) => p.location))].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>
      {!filtered.length && (
        <div
          role="status"
          className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center"
        >
          <h2 className="font-bold text-[#172B4D]">Mos mutaxassis topilmadi</h2>
          <p className="mt-2 text-sm text-slate-500">Qidiruv yoki hududni o‘zgartirib ko‘ring.</p>
        </div>
      )}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((person) => (
          <Link
            href={`/professionals/${person.slug}`}
            key={person.id}
            className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                {person.photo ? (
                  <Image
                    src={person.photo.url}
                    alt={person.photo.alt}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <BriefcaseBusiness className="absolute inset-0 m-auto text-slate-300" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-[#172B4D]">{person.name}</h3>
                  {person.isDemo && (
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-black text-slate-500">
                      DEMO
                    </span>
                  )}
                </div>
                <p className="mt-1 font-semibold text-amber-600">{person.profession}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="h-3 w-3" />
                  {person.location}
                </p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-600">{person.skills}</p>
            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-sm">
              <div>
                <span className="block text-xs text-slate-400">Tajriba</span>
                <strong>{person.experienceYears} yil</strong>
              </div>
              <div>
                <span className="block text-xs text-slate-400">Boshlanishi</span>
                <strong>{formatUZS(person.startingPrice)}</strong>
              </div>
            </div>
            {person.availability && (
              <p className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
                Hozir so‘rov qabul qiladi
              </p>
            )}
          </Link>
        ))}
      </div>
    </>
  )
}
