import Link from 'next/link'
import { Building2, Eye, Network, ShieldCheck } from 'lucide-react'

export const dynamic = 'force-static'

export default function AboutPage() {
  return (
    <>
      <section className="bg-[#172B4D] py-20 text-white">
        <div className="page-shell max-w-4xl">
          <p className="eyebrow">Buildy haqida</p>
          <h1 className="mt-4 text-5xl font-black tracking-tight">
            O‘zbekiston qurilish sanoati uchun raqamli infratuzilma.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Biz mijozlar, yetkazib beruvchilar, ustalar va kompaniyalar o‘rtasidagi aloqani
            soddalashtirish uchun Buildy’ni yaratmoqdamiz.
          </p>
        </div>
      </section>
      <section className="page-shell py-20">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            [Eye, 'Shaffoflik', 'Takliflar va taxminlarni tushunarli ko‘rsatish.'],
            [Network, 'Bog‘liqlik', 'Qurilish ekotizimi ishtirokchilarini bir joyga jamlash.'],
            [ShieldCheck, 'Ishonch', 'Maxfiylik, aniq demo belgilari va tekshiruv jarayonlari.'],
          ].map(([Icon, t, c]) => {
            const I = Icon as typeof Eye
            return (
              <div key={t as string} className="rounded-2xl border border-slate-200 bg-white p-7">
                <I className="text-amber-600" />
                <h2 className="mt-4 text-xl font-black text-[#172B4D]">{t as string}</h2>
                <p className="mt-2 leading-7 text-slate-600">{c as string}</p>
              </div>
            )
          })}
        </div>
        <div className="mt-10 rounded-3xl bg-amber-400 p-8 text-[#172B4D] md:p-12">
          <Building2 className="h-10 w-10" />
          <h2 className="mt-5 text-3xl font-black">Hozir biz beta bosqichidamiz.</h2>
          <p className="mt-3 max-w-2xl leading-7">
            Asosiy jarayonlarni sinab, bozordan o‘rganamiz. Obunalar keyingi bosqich uchun
            rejalashtirilgan; beta davrida to‘lov talab qilinmaydi.
          </p>
          <Link
            href="/register"
            className="mt-6 inline-flex rounded-xl bg-[#172B4D] px-6 py-3 font-bold text-white"
          >
            Hamjamiyatga qo‘shilish
          </Link>
        </div>
      </section>
    </>
  )
}
