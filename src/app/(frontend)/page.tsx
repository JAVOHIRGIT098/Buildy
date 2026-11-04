import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  HardHat,
  PackageSearch,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
} from 'lucide-react'
import { getJobs, getProducts, getProfessionals, mediaData } from '@/lib/buildy-data'
import { formatUZS } from '@/lib/buildy-format'

export const dynamic = 'force-static'

export default async function HomePage() {
  const [products, professionals, jobs] = await Promise.all([
    getProducts(4),
    getProfessionals(3),
    getJobs(3),
  ])
  const heroImage = mediaData(products[0]?.image)

  return (
    <>
      <section className="relative overflow-hidden bg-[#172B4D] text-white">
        <div className="absolute inset-0 opacity-30">
          {heroImage && (
            <Image
              src={heroImage.url}
              alt={heroImage.alt}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#172B4D] via-[#172B4D]/95 to-[#172B4D]/55" />
        <div className="page-shell relative grid min-h-[650px] items-center py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              O‘zbekiston qurilish ekotizimi
            </span>
            <h1 className="mt-7 max-w-[780px] text-5xl font-black leading-[1.04] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
              Qurilish uchun kerak bo‘lgan hamma narsa.{' '}
              <span className="text-[#F59E0B]">Bir joyda.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
              Materiallarni toping, malakali ustalarni yollang, qurilish ishlarini kashf eting va
              loyihangizni Buildy bilan boshqaring.
            </p>
            <form
              action="/marketplace"
              className="mt-9 flex max-w-2xl flex-col gap-2 rounded-2xl bg-white p-2 shadow-2xl sm:flex-row"
            >
              <label className="flex flex-1 items-center gap-3 px-3">
                <Search className="h-5 w-5 text-slate-400" />
                <input
                  name="q"
                  className="min-h-12 w-full text-slate-800 outline-none"
                  placeholder="Qurilish materialini qidiring..."
                  aria-label="Qurilish materialini qidiring"
                />
              </label>
              <button className="btn-primary min-h-12 px-7">Qidirish</button>
            </form>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/marketplace" className="btn-primary">
                Bozorni ko‘rish <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/professionals"
                className="inline-flex items-center rounded-xl border border-white/25 px-5 py-3 text-sm font-bold hover:bg-white/10"
              >
                Mutaxassis topish
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="page-shell grid grid-cols-2 gap-px py-7 md:grid-cols-4">
          {[
            ['4 yo‘nalish', 'Bitta platforma'],
            ['UZS', 'Mahalliy narxlar'],
            ['O‘zbekcha', 'RU va EN — rejalashtirilgan'],
            ['Beta', 'Ochiq demo holati'],
          ].map(([big, small]) => (
            <div key={big} className="border-l border-slate-200 px-5 first:border-0">
              <strong className="block text-xl font-black text-[#172B4D]">{big}</strong>
              <span className="text-xs text-slate-500">{small}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="page-shell py-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow">Materiallar bozori</p>
            <h2 className="section-title mt-3">Ommabop materiallar</h2>
          </div>
          <Link href="/marketplace" className="hidden font-bold text-[#172B4D] md:flex">
            Barchasini ko‘rish <ArrowRight className="ml-2" />
          </Link>
        </div>
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => {
            const image = mediaData(product.image)
            return (
              <Link
                href={`/products/${product.slug}`}
                key={product.id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  {image ? (
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="25vw"
                    />
                  ) : (
                    <PackageSearch className="absolute inset-0 m-auto" />
                  )}
                  {product.isDemo && (
                    <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-slate-600">
                      DEMO
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-extrabold text-[#172B4D]">{product.name}</h3>
                  <p className="mt-3 text-lg font-black text-[#172B4D]">
                    {formatUZS(product.price)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{product.supplierName}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="page-shell">
          <div className="text-center">
            <p className="eyebrow">Platforma imkoniyatlari</p>
            <h2 className="section-title mt-3">Qurilishning har bosqichi uchun</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              Xariddan ishga yollashgacha bo‘lgan jarayonlarni bir tizimga jamlaymiz.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              [
                Store,
                'Materiallar bozori',
                'Narxlarni solishtiring va yetkazib beruvchiga so‘rov yuboring.',
                '/marketplace',
              ],
              [
                HardHat,
                'Usta va mutaxassislar',
                'Tajriba, ko‘nikma va hudud bo‘yicha mos mutaxassisni toping.',
                '/professionals',
              ],
              [
                BriefcaseBusiness,
                'Qurilish ishlari',
                'Alohida vakansiyalar bozorida imkoniyatlarni kashf eting.',
                '/jobs',
              ],
              [
                Bot,
                'AI hisob yordamchisi',
                'Shaffof formulalar bilan dastlabki material va budjet hisobini oling.',
                '/ai-assistant',
              ],
            ].map(([Icon, title, copy, href]) => {
              const C = Icon as typeof Store
              return (
                <Link
                  href={href as string}
                  key={title as string}
                  className="rounded-2xl border border-slate-200 p-6 hover:border-amber-300 hover:shadow-lg"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-amber-100 text-amber-700">
                    <C />
                  </span>
                  <h3 className="mt-5 text-lg font-black text-[#172B4D]">{title as string}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{copy as string}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="page-shell py-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow">Mutaxassislar</p>
            <h2 className="section-title mt-3">Ishonchli ustani toping</h2>
          </div>
          <Link href="/professionals" className="hidden font-bold text-[#172B4D] md:flex">
            Katalogga o‘tish <ArrowRight className="ml-2" />
          </Link>
        </div>
        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {professionals.map((person) => {
            const photo = mediaData(person.photo)
            return (
              <Link
                href={`/professionals/${person.slug}`}
                key={person.id}
                className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-lg"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  {photo && (
                    <Image
                      src={photo.url}
                      alt={photo.alt}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-[#172B4D]">{person.name}</h3>
                    {person.isDemo && (
                      <span className="rounded bg-slate-100 px-1 py-0.5 text-[9px] font-black">
                        DEMO
                      </span>
                    )}
                  </div>
                  <p className="mt-1 font-bold text-amber-600">{person.profession}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {person.experienceYears} yil tajriba · {person.location}
                  </p>
                  {person.availability && (
                    <p className="mt-2 flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Mavjud
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="page-shell pb-20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Ish imkoniyatlari</p>
            <h2 className="section-title mt-3">So‘nggi vakansiyalar</h2>
          </div>
          <Link href="/jobs" className="btn-secondary">
            Barcha vakansiyalar <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.slug}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-amber-300 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <BriefcaseBusiness className="text-amber-600" />
                {job.isDemo && (
                  <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-500">
                    DEMO
                  </span>
                )}
              </div>
              <h3 className="mt-4 text-lg font-black text-[#172B4D]">{job.title}</h3>
              <p className="mt-2 text-sm text-slate-600">
                {job.company} · {job.location}
              </p>
              <p className="mt-4 font-bold text-[#172B4D]">{formatUZS(job.salaryMin)} dan</p>
            </Link>
          ))}
          {!jobs.length && (
            <p className="text-sm text-slate-500">Hozircha ochiq vakansiyalar yo‘q.</p>
          )}
        </div>
      </section>

      <section className="bg-[#EEF3F8] py-20">
        <div className="page-shell grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Qanday ishlaydi</p>
            <h2 className="section-title mt-3">Loyihangizni aniq qadamlar bilan boshlang</h2>
            <div className="mt-8 grid gap-6">
              {[
                [
                  '01',
                  'Kerakli yo‘nalishni tanlang',
                  'Material, mutaxassis, ish yoki hisob yordamchisidan boshlang.',
                ],
                [
                  '02',
                  'Takliflarni solishtiring',
                  'Hudud, narx va ko‘nikma bo‘yicha mos variantlarni ko‘ring.',
                ],
                [
                  '03',
                  'So‘rov yuboring',
                  'Hisob yarating va so‘rovingiz holatini dashboardda kuzating.',
                ],
              ].map(([n, t, c]) => (
                <div className="flex gap-4" key={n}>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#172B4D] text-xs font-black text-white">
                    {n}
                  </span>
                  <div>
                    <h3 className="font-black text-[#172B4D]">{t}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{c}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-[#172B4D] p-8 text-white shadow-2xl">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#F59E0B] text-[#172B4D]">
              <Bot />
            </span>
            <p className="mt-6 text-sm font-bold text-amber-400">BUILDY ESTIMATE</p>
            <h3 className="mt-2 text-3xl font-black">
              Qurilish budjetini bir necha daqiqada taxmin qiling.
            </h3>
            <p className="mt-4 leading-7 text-slate-300">
              Uy maydoni, qavatlar soni va darajani kiriting. Formula, materiallar ro‘yxati va
              ogohlantirishlarni ochiq ko‘ring.
            </p>
            <Link href="/ai-assistant" className="btn-primary mt-7">
              Hisobni boshlash <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="page-shell py-20">
        <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-3xl bg-[#172B4D] p-8 text-white">
            <ShieldCheck className="h-10 w-10 text-amber-400" />
            <h2 className="mt-5 text-3xl font-black">Nega Buildy?</h2>
            <p className="mt-4 leading-7 text-slate-300">
              Qurilish bozoridagi chalkash jarayonlarni tushunarli, xavfsiz va mahalliy formatga
              olib kelamiz.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              [
                'Shaffof demo',
                'Demo kontent real savdo yoki tekshirilgan faoliyat sifatida ko‘rsatilmaydi.',
              ],
              [
                'UZS va mahalliy hududlar',
                'Narxlar va qidiruv O‘zbekiston bozori uchun moslangan.',
              ],
              ['Maxfiylik birinchi o‘rinda', 'Shaxsiy so‘rovlar faqat hisob egasiga ko‘rinadi.'],
              ['Bitta ish maydoni', 'So‘rovlar va arizalarni dashboarddan kuzatish mumkin.'],
            ].map(([t, c]) => (
              <div key={t} className="rounded-2xl border border-slate-200 bg-white p-6">
                <CheckCircle2 className="text-amber-500" />
                <h3 className="mt-4 font-black text-[#172B4D]">{t}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{c}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell pb-20">
        <div className="overflow-hidden rounded-3xl bg-[#F59E0B] px-8 py-12 text-center text-[#172B4D] md:px-14">
          <Building2 className="mx-auto h-11 w-11" />
          <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-black tracking-tight md:text-4xl">
            Qurilish loyihangizni bugun tartibli boshlang.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#172B4D]/75">
            Beta platformaga qo‘shiling va yangi imkoniyatlarni birinchi bo‘lib sinab ko‘ring.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="rounded-xl bg-[#172B4D] px-6 py-3 font-extrabold text-white"
            >
              Bepul hisob yaratish
            </Link>
            <Link
              href="/about"
              className="rounded-xl border border-[#172B4D]/25 px-6 py-3 font-extrabold"
            >
              Buildy haqida
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
