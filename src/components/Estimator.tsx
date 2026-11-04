'use client'

import { Calculator, Info } from 'lucide-react'
import { useMemo, useState } from 'react'
import { formatUZS } from '@/lib/buildy-format'
import { calculateEstimate } from '@/lib/buildy-validation'

export function Estimator() {
  const [area, setArea] = useState('120')
  const [floors, setFloors] = useState(1)
  const [type, setType] = useState('standard')
  const estimate = useMemo(
    () => calculateEstimate(Number(area), floors, type),
    [area, floors, type],
  )

  return (
    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <h2 className="text-xl font-black text-[#172B4D]">Loyiha parametrlari</h2>
        <div className="mt-6 grid gap-5">
          <label className="field-label">
            Har bir qavat maydoni (m²)
            <input
              type="number"
              min={20}
              max={2000}
              value={area}
              onChange={(e) => setArea(e.target.value)}
              aria-invalid={!estimate}
              aria-describedby="estimate-validation"
              className="field"
            />
          </label>
          <label className="field-label">
            Qavatlar soni
            <select
              value={floors}
              onChange={(e) => setFloors(Number(e.target.value))}
              className="field"
            >
              <option value={1}>1 qavat</option>
              <option value={2}>2 qavat</option>
              <option value={3}>3 qavat</option>
            </select>
          </label>
          <label className="field-label">
            Qurilish darajasi
            <select value={type} onChange={(e) => setType(e.target.value)} className="field">
              <option value="economy">Tejamkor</option>
              <option value="standard">Standart</option>
              <option value="premium">Premium</option>
            </select>
          </label>
        </div>
        {!estimate && (
          <p id="estimate-validation" role="alert" className="mt-4 text-sm text-red-700">
            Maydon 20–2000 m² oralig‘ida bo‘lishi kerak. To‘g‘ri qiymat kiritilmaguncha hisob
            ko‘rsatilmaydi.
          </p>
        )}
        <p className="mt-5 text-xs leading-6 text-slate-500">
          Formula: umumiy maydon = qavat maydoni × qavatlar. Standart budjet = maydon × 4 200 000
          so‘m. Tejamkor koeffitsiyent: 0,85; premium: 1,35. Sement: 0,42 qop/m² × koeffitsiyent;
          blok: 12,5 dona/m²; armatura: 0,038 t/m² × koeffitsiyent. Bu mahalliy beta farazlar, joriy
          bozor smetasi emas.
        </p>
      </div>
      <div className="rounded-3xl bg-[#172B4D] p-6 text-white shadow-xl lg:p-8">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-[#F59E0B] p-2 text-[#172B4D]">
            <Calculator />
          </span>
          <div>
            <p className="text-sm text-slate-300">Taxminiy budjet</p>
            <h2 className="text-2xl font-black" aria-live="polite">
              {estimate ? formatUZS(estimate.cost) : 'To‘g‘ri maydon kiriting'}
            </h2>
          </div>
        </div>
        {estimate && (
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              ['Umumiy maydon', `${estimate.totalArea} m²`],
              ['Sement', `${estimate.cement} qop`],
              ['Devor bloklari', `${estimate.blocks} dona`],
              ['Armatura', `${estimate.steel} tonna`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-white/8 p-4">
                <span className="text-xs text-slate-300">{label}</span>
                <strong className="mt-1 block text-lg">{value}</strong>
              </div>
            ))}
          </div>
        )}
        <div className="mt-6 flex gap-3 rounded-2xl border border-amber-300/30 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
          <Info className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            Bu hisob kitob shaffof beta formulalariga asoslangan dastlabki taxmin. U
            sertifikatlangan konstruktiv yoki muhandislik xulosasi emas. Qurilishdan oldin
            mutaxassis tekshiruvini so‘rang.
          </p>
        </div>
        <a
          href="/professionals"
          className="mt-5 inline-flex rounded-xl bg-[#F59E0B] px-5 py-3 font-extrabold text-[#172B4D]"
        >
          Mutaxassis bilan tekshirish
        </a>
      </div>
    </div>
  )
}
