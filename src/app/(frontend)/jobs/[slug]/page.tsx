import Link from 'next/link'
import { ArrowLeft, Building2, Clock3, MapPin, WalletCards } from 'lucide-react'
import { notFound } from 'next/navigation'
import { RequestForm } from '@/components/RequestForm'
import { formatUZS } from '@/lib/buildy-format'
import { findBySlug, getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'jobs',
    limit: 100,
    select: { slug: true },
    overrideAccess: false,
  })
  return docs.map((doc) => ({ slug: doc.slug }))
}

export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const job = await findBySlug('jobs', slug)
  if (!job) notFound()
  return (
    <section className="page-shell py-10 md:py-16">
      <Link
        href="/jobs"
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500"
      >
        <ArrowLeft className="h-4 w-4" />
        Vakansiyalarga qaytish
      </Link>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
          {job.isDemo && (
            <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-black">
              DEMO VAKANSIYA
            </span>
          )}
          <h1 className="mt-4 text-4xl font-black text-[#172B4D]">{job.title}</h1>
          <p className="mt-3 flex items-center gap-2 font-bold text-slate-600">
            <Building2 className="h-5 w-5" />
            {job.company}
          </p>
          <div className="mt-7 grid gap-3 rounded-2xl bg-slate-50 p-5 sm:grid-cols-3">
            <p className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-amber-600" />
              {job.location}
            </p>
            <p className="flex items-center gap-2 text-sm">
              <Clock3 className="h-4 w-4 text-amber-600" />
              {job.workType}
            </p>
            <p className="flex items-center gap-2 text-sm">
              <WalletCards className="h-4 w-4 text-amber-600" />
              {formatUZS(job.salaryMin)} dan
            </p>
          </div>
          <h2 className="mt-8 text-xl font-black text-[#172B4D]">Ish tavsifi</h2>
          <p className="mt-3 leading-7 text-slate-600">{job.description}</p>
          <h2 className="mt-8 text-xl font-black text-[#172B4D]">Talablar</h2>
          <p className="mt-3 leading-7 text-slate-600">{job.requirements}</p>
        </div>
        <RequestForm
          type="job-application"
          targetId={job.id}
          disabled={job.status === 'closed'}
          subject={`${job.title} vakansiyasiga ariza`}
          buttonLabel="Vakansiyaga ariza yuborish"
        />
      </div>
    </section>
  )
}
