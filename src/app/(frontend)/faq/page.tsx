export const dynamic = 'force-static'

const faqs = [
  [
    'Buildy nima?',
    'Buildy — materiallar, mutaxassislar, ishlar va qurilish hisoblarini birlashtiruvchi beta platforma.',
  ],
  [
    'Narxlar realmi?',
    'Demo belgili takliflar faqat preview uchun. Real yetkazib beruvchi e’lonlari alohida ko‘rsatiladi.',
  ],
  [
    'AI hisobiga ishonish mumkinmi?',
    'U dastlabki rejalashtirish uchun. Konstruktiv yoki sertifikatlangan muhandislik xulosasi emas.',
  ],
  [
    'Hisob turlari nimasi bilan farq qiladi?',
    'Mijoz, yetkazib beruvchi, mutaxassis va ish beruvchi uchun dashboard yo‘nalishlari farq qiladi.',
  ],
  [
    'Beta davrida to‘lov bormi?',
    'Yo‘q. Obunalar keyingi bosqich uchun rejalashtirilgan, beta paytida majburiy to‘lov yo‘q.',
  ],
]

export default function FaqPage() {
  return (
    <section className="page-shell max-w-4xl py-16 md:py-20">
      <p className="eyebrow">FAQ</p>
      <h1 className="section-title mt-3">Ko‘p so‘raladigan savollar</h1>
      <div className="mt-10 grid gap-3">
        {faqs.map(([q, a]) => (
          <details key={q} className="group rounded-2xl border border-slate-200 bg-white p-5">
            <summary className="cursor-pointer list-none font-black text-[#172B4D]">
              {q}
              <span className="float-right text-amber-600 group-open:rotate-45">+</span>
            </summary>
            <p className="mt-4 border-t border-slate-100 pt-4 leading-7 text-slate-600">{a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
