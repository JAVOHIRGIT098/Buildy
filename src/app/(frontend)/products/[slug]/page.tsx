import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, MapPin, PackageCheck, ShieldAlert } from 'lucide-react'
import { notFound } from 'next/navigation'
import { RequestForm } from '@/components/RequestForm'
import { findBySlug, getPayloadClient } from '@/lib/payload'
import { mediaData } from '@/lib/buildy-data'
import { formatUZS } from '@/lib/buildy-format'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    limit: 100,
    select: { slug: true },
    overrideAccess: false,
  })
  return docs.map((doc) => ({ slug: doc.slug }))
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await findBySlug('products', slug)
  if (!product) notFound()
  const image = mediaData(product.image)
  return (
    <section className="page-shell py-10 md:py-16">
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#172B4D]"
      >
        <ArrowLeft className="h-4 w-4" />
        Bozorga qaytish
      </Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-slate-100">
            {image && (
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            )}
            {product.isDemo && (
              <span className="absolute left-5 top-5 rounded-full bg-white px-3 py-1 text-xs font-black text-slate-600">
                DEMO MAHSULOT
              </span>
            )}
          </div>
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-black text-[#172B4D]">Mahsulot haqida</h2>
            <p className="mt-4 leading-7 text-slate-600">{product.description}</p>
            {product.isDemo && (
              <div className="mt-6 flex gap-3 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
                Bu preview uchun demo taklif. Buyurtma va yetkazib berish shartlarini so‘rov orqali
                aniqlang.
              </div>
            )}
          </div>
        </div>
        <div>
          <p className="eyebrow">{product.category}</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-[#172B4D]">{product.name}</h1>
          <p className="mt-6 text-3xl font-black text-[#172B4D]">
            {formatUZS(product.price)}{' '}
            <span className="text-sm font-medium text-slate-400">/ {product.unit}</span>
          </p>
          <div className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-sm">
            <p className="flex items-center gap-2">
              <PackageCheck className="h-5 w-5 text-emerald-600" />
              <strong>
                {product.stockStatus === 'unavailable'
                  ? 'Omborda mavjud emas'
                  : product.stockStatus === 'low'
                    ? 'Omborda kam'
                    : 'Omborda mavjud'}
              </strong>
            </p>
            <p className="flex items-center gap-2 text-slate-600">
              <MapPin className="h-5 w-5 text-slate-400" />
              {product.location}
            </p>
            <p className="flex items-center gap-2 text-slate-600">
              <CheckCircle2 className="h-5 w-5 text-slate-400" />
              {product.supplierName}
            </p>
          </div>
          <div className="mt-5">
            <RequestForm
              type="product-inquiry"
              targetId={product.id}
              disabled={product.stockStatus === 'unavailable'}
              subject={`${product.name} bo‘yicha xarid so‘rovi`}
              buttonLabel="Xarid so‘rovini yuborish"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
