import { Estimator } from '@/components/Estimator'

export const dynamic = 'force-static'

export default function AssistantPage() {
  return (
    <section className="page-shell py-14 md:py-20">
      <div className="max-w-3xl">
        <p className="eyebrow">Buildy Estimate · Beta</p>
        <h1 className="section-title mt-3">Dastlabki qurilish hisobini oling</h1>
        <p className="mt-4 leading-7 text-slate-600">
          Hozircha API ishlatilmaydi: natijalar maydon, qavatlar soni va qurilish darajasiga
          asoslangan ochiq formulalar bilan hisoblanadi.
        </p>
      </div>
      <div className="mt-10">
        <Estimator />
      </div>
    </section>
  )
}
