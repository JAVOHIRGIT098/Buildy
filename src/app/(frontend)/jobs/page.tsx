import Link from 'next/link'
import { ArrowRight, BriefcaseBusiness, Building2, MapPin } from 'lucide-react'
import { getJobs } from '@/lib/buildy-data'
import { formatUZS } from '@/lib/buildy-format'

export const dynamic = 'force-static'

export default async function JobsPage() {
  const jobs = await getJobs()
  return (
    <section className="page-shell py-14 md:py-20">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">Alohida ish bozori</p>
          <h1 className="section-title mt-3">Qurilish vakansiyalari</h1>
          <p className="mt-4 max-w-2xl leading-7 text-slate-600">
            Kompaniyalar va mutaxassislar uchun ish imkoniyatlari. Demo vakansiyalar alohida
            belgilanadi.
          </p>
        </div>
        <Link href="/register" className="btn-primary">
          Ish beruvchi sifatida qo‘shilish
        </Link>
      </div>
      <div className="mt-10 grid gap-4">
        {jobs.map((job) => (
          <Link
            href={`/jobs/${job.slug}`}
            key={job.id}
            className="group grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 hover:border-amber-300 hover:shadow-lg md:grid-cols-[1fr_auto] md:items-center"
          >
            <div className="flex gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-slate-100 text-[#172B4D]">
                <BriefcaseBusiness />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-[#172B4D]">{job.title}</h2>
                  {job.isDemo && (
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[9px] font-black">
                      DEMO
                    </span>
                  )}
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
                  <Building2 className="h-4 w-4" />
                  {job.company}
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="h-3.5 w-3.5" />
                  {job.location} · {job.workType}
                </p>
              </div>
            </div>
            <div className="md:text-right">
              <strong className="text-[#172B4D]">
                {formatUZS(job.salaryMin)} – {formatUZS(job.salaryMax)}
              </strong>
              <p className="mt-2 flex items-center justify-end gap-2 text-sm font-bold text-amber-600">
                Batafsil <ArrowRight className="h-4 w-4" />
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
