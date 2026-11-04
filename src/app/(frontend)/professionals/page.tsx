import { ProfessionalsBrowser } from '@/components/ProfessionalsBrowser'
import { getProfessionals, mediaData } from '@/lib/buildy-data'

export const dynamic = 'force-static'

export default async function ProfessionalsPage() {
  const professionals = await getProfessionals()
  return (
    <section className="page-shell py-14 md:py-20">
      <p className="eyebrow">Xizmatlar katalogi</p>
      <h1 className="section-title mt-3">Malakali mutaxassislar</h1>
      <p className="mt-4 max-w-2xl leading-7 text-slate-600">
        Kasb, ko‘nikma va hudud bo‘yicha qidiring. Demo profillar baho yoki tekshiruv da’vosini
        bildirmaydi.
      </p>
      <div className="mt-10">
        <ProfessionalsBrowser
          professionals={professionals.map((p) => ({
            id: String(p.id),
            name: p.name,
            slug: p.slug,
            profession: p.profession,
            location: p.location,
            experienceYears: p.experienceYears,
            startingPrice: p.startingPrice,
            skills: p.skills,
            availability: p.availability,
            isDemo: p.isDemo,
            photo: mediaData(p.photo),
          }))}
        />
      </div>
    </section>
  )
}
