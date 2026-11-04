'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, PackageSearch, Search, SlidersHorizontal } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { formatUZS } from '@/lib/buildy-format'
import { productCategories } from '@/lib/buildy-categories'

export type ProductCardData = {
  id: string
  name: string
  slug: string
  category: string
  price: number
  unit: string
  supplierName: string
  location: string
  stockStatus?: string | null
  isDemo?: boolean | null
  image?: { url: string; alt: string; width: number; height: number } | null
}

const categories: Record<string, string> = {
  all: 'Barcha kategoriyalar',
  ...productCategories,
}

export function MarketplaceBrowser({ products }: { products: ProductCardData[] }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [location, setLocation] = useState('all')
  useEffect(() => {
    const initialQuery = new URLSearchParams(window.location.search).get('q')
    if (initialQuery) setQuery(initialQuery)
  }, [])
  const filtered = useMemo(
    () =>
      products.filter((product) => {
        const matchesQuery = `${product.name} ${product.supplierName}`
          .toLowerCase()
          .includes(query.trim().toLowerCase())
        return (
          matchesQuery &&
          (category === 'all' || product.category === category) &&
          (location === 'all' || product.location === location)
        )
      }),
    [products, query, category, location],
  )

  return (
    <>
      <div className="mb-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px_190px]">
        <label className="flex items-center gap-3 rounded-xl bg-slate-50 px-4">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            aria-label="Mahsulot qidirish"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-12 w-full bg-transparent outline-none"
            placeholder="Mahsulot yoki yetkazib beruvchi..."
          />
        </label>
        <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3">
          <SlidersHorizontal className="h-4 w-4 text-slate-400" />
          <select
            aria-label="Mahsulot kategoriyasi"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="min-h-12 w-full bg-white outline-none"
          >
            {Object.entries(categories).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <select
          aria-label="Mahsulot hududi"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="min-h-12 rounded-xl border border-slate-200 bg-white px-3 outline-none"
        >
          <option value="all">Barcha hududlar</option>
          {[...new Set(products.map((p) => p.location))].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>
      <p className="mb-4 text-sm font-semibold text-slate-500">
        {filtered.length} ta taklif topildi · Demo e’lonlar alohida belgilangan
      </p>
      {filtered.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <Link
              href={`/products/${product.slug}`}
              key={product.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                {product.image ? (
                  <Image
                    src={product.image.url}
                    alt={product.image.alt}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 25vw"
                  />
                ) : (
                  <PackageSearch className="absolute inset-0 m-auto text-slate-300" />
                )}
                {product.isDemo && (
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-extrabold text-slate-600">
                    DEMO
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  {categories[product.category] || product.category}
                </p>
                <h3 className="mt-2 min-h-12 font-bold leading-6 text-[#172B4D]">{product.name}</h3>
                <p className="mt-3 text-lg font-black text-[#172B4D]">
                  {formatUZS(product.price)}{' '}
                  <span className="text-xs font-medium text-slate-400">/ {product.unit}</span>
                </p>
                <div className="mt-4 flex items-center gap-1.5 border-t border-slate-100 pt-3 text-xs text-slate-500">
                  <MapPin className="h-3.5 w-3.5" />
                  {product.location} · {product.supplierName}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <PackageSearch className="mx-auto mb-3 h-9 w-9 text-slate-300" />
          <h3 className="font-bold text-slate-700">Mos mahsulot topilmadi</h3>
          <p className="mt-1 text-sm text-slate-500">
            Qidiruv yoki filtrlarni o‘zgartirib ko‘ring.
          </p>
        </div>
      )}
    </>
  )
}
