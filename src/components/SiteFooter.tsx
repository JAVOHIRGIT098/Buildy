import Link from 'next/link'
import { Brand } from './Brand'

export function SiteFooter() {
  return (
    <footer className="bg-[#101f38] text-slate-300">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-14 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-1">
          <Brand inverse />
          <p className="mt-4 text-sm leading-6 text-slate-400">
            O‘zbekistonda qurilish uchun yagona raqamli platforma.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-white">Platforma</h3>
          <div className="mt-4 grid gap-3 text-sm">
            <Link href="/marketplace">Materiallar</Link>
            <Link href="/professionals">Mutaxassislar</Link>
            <Link href="/jobs">Ishlar</Link>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-white">Buildy</h3>
          <div className="mt-4 grid gap-3 text-sm">
            <Link href="/about">Biz haqimizda</Link>
            <Link href="/faq">Ko‘p so‘raladigan savollar</Link>
            <Link href="/contact">Bog‘lanish</Link>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-white">Beta holati</h3>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            Platforma sinov rejimida. Demo yozuvlar aniq belgilangan, real foydalanuvchi ma’lumoti
            ruxsatsiz ochilmaydi.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-slate-500">
        © 2026 Buildy. One Platform. Everything Construction.
      </div>
    </footer>
  )
}
