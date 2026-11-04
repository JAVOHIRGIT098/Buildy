import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, BriefcaseBusiness, CheckCircle2, MapPin, Wrench } from 'lucide-react'
import { notFound } from 'next/navigation'
import { RequestForm } from '@/components/RequestForm'
import { findBySlug, getPayloadClient } from '@/lib/payload'
import { mediaData } from '@/lib/buildy-data'
import { formatUZS } from '@/lib/buildy-format'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'professionals',
    limit: 100,
    select: { slug: true },
    overrideAccess: false,
  })
  return docs.map((doc) => ({ slug: doc.slug }))
}

export default async function ProfessionalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const person = await findBySlug('professionals', slug)
  if (!person) notFound()
  const photo = mediaData(person.photo)
  return (
    <section className="page-shell py-10 md:py-16">
      <Link
        href="/professionals"
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500"
      >
        <ArrowLeft className="h-4 w-4" />
        Mutaxassislarga qaytish
      </Link>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-3xl bg-slate-100">
              {photo ? (
                <Image
                  src={photo.url}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes="144px"
                />
              ) : (
                <BriefcaseBusiness className="absolute inset-0 m-auto text-slate-300" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                {person.isDemo && (
                  <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-black">
                    DEMO PROFIL
                  </span>
                )}
                {person.availability && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                    Mavjud
                  </span>
                )}
              </div>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-[#172B4D]">
                {person.name}
              </h1>
              <p className="mt-2 text-lg font-bold text-amber-600">{person.profession}</p>
              <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="h-4 w-4" />
                {person.location}
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-4 border-y border-slate-100 py-6 sm:grid-cols-3">
            <div>
              <span className="text-xs text-slate-400">Tajriba</span>
              <strong className="block text-lg text-[#172B4D]">{person.experienceYears} yil</strong>
            </div>
            <div>
              <span className="text-xs text-slate-400">Xizmat narxi</span>
              <strong className="block text-lg text-[#172B4D]">
                {formatUZS(person.startingPrice)} dan
              </strong>
            </div>
            <div>
              <span className="text-xs text-slate-400">Hudud</span>
              <strong className="block text-lg text-[#172B4D]">{person.location}</strong>
            </div>
          </div>
          <h2 className="mt-7 text-xl font-black text-[#172B4D]">Mutaxassis haqida</h2>
          <p className="mt-3 leading-7 text-slate-600">{person.description}</p>
          <div className="mt-6 flex gap-3 rounded-2xl bg-slate-50 p-4">
            <Wrench className="h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <strong className="text-sm text-[#172B4D]">Ko‘nikmalar</strong>
              <p className="mt-1 text-sm leading-6 text-slate-600">{person.skills}</p>
            </div>
          </div>
        </div>
        <RequestForm
          type="service-request"
          targetId={person.id}
          disabled={!person.availability}
          subject={`${person.name} uchun xizmat so‘rovi`}
          buttonLabel="Xizmat so‘rovini yuborish"
        />
      </div>
    </section>
  )
}
