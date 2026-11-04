import { redirect } from 'next/navigation'
import {
  Bell,
  Boxes,
  BriefcaseBusiness,
  CheckCircle2,
  CircleUserRound,
  Clock3,
  MessageSquareText,
} from 'lucide-react'
import { LogoutButton } from '@/components/LogoutButton'
import { getCurrentUser } from '@/lib/app-auth'
import { getPayloadClient } from '@/lib/payload'

const roleLabels = {
  customer: 'Mijoz',
  supplier: 'Yetkazib beruvchi',
  professional: 'Mutaxassis',
  employer: 'Ish beruvchi',
}

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  const payload = await getPayloadClient()
  const requests = await payload.find({
    collection: 'requests',
    where: { owner: { equals: user.id } },
    user,
    overrideAccess: false,
    limit: 20,
    sort: '-createdAt',
  })
  const shortcuts =
    user.role === 'supplier'
      ? [
          ['Mahsulotlar', Boxes],
          ['Buyurtma va so‘rovlar', MessageSquareText],
        ]
      : user.role === 'professional'
        ? [
            ['Professional profil', CircleUserRound],
            ['Ish arizalari', BriefcaseBusiness],
          ]
        : user.role === 'employer'
          ? [
              ['Vakansiyalar', BriefcaseBusiness],
              ['Nomzodlar', CircleUserRound],
            ]
          : [
              ['Mening so‘rovlarim', MessageSquareText],
              ['Sevimlilar', CheckCircle2],
            ]
  return (
    <section className="page-shell py-12 md:py-16">
      <div className="flex flex-col justify-between gap-5 rounded-3xl bg-[#172B4D] p-7 text-white md:flex-row md:items-center md:p-10">
        <div>
          <p className="text-sm font-bold text-amber-400">{roleLabels[user.role]}</p>
          <h1 className="mt-2 text-3xl font-black">Xush kelibsiz, {user.name}</h1>
          <p className="mt-2 text-sm text-slate-300">
            {user.city} · Tasdiqlash holati:{' '}
            {user.verificationStatus === 'verified' ? 'Tasdiqlangan' : 'Kutilmoqda'}
          </p>
        </div>
        <LogoutButton />
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {shortcuts.map(([label, Icon]) => {
          const I = Icon as typeof Boxes
          return (
            <div key={label as string} className="rounded-2xl border border-slate-200 bg-white p-6">
              <I className="text-amber-600" />
              <h2 className="mt-4 font-black text-[#172B4D]">{label as string}</h2>
              <p className="mt-2 text-sm text-slate-500">
                Kengaytirilgan boshqaruv hali ishga tushirilmagan.
              </p>
            </div>
          )
        })}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <Bell className="text-amber-600" />
          <h2 className="mt-4 font-black text-[#172B4D]">Bildirishnomalar</h2>
          <p className="mt-2 text-sm text-slate-500">Yangi bildirishnoma yo‘q</p>
        </div>
      </div>
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">Faollik</p>
            <h2 className="mt-2 text-xl font-black text-[#172B4D]">So‘rov va arizalar</h2>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">
            {requests.totalDocs} ta
          </span>
        </div>
        {requests.docs.length ? (
          <div className="mt-5 grid gap-3">
            {requests.docs.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between gap-3 rounded-xl border border-slate-100 p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <strong className="text-[#172B4D]">{item.subject}</strong>
                  <p className="mt-1 line-clamp-1 text-sm text-slate-500">{item.message}</p>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
                  <Clock3 className="h-4 w-4" />
                  {
                    {
                      new: 'Yangi',
                      'in-review': 'Ko‘rib chiqilmoqda',
                      accepted: 'Qabul qilingan',
                      closed: 'Yopilgan',
                    }[item.status || 'new']
                  }
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 py-12 text-center">
            <MessageSquareText className="mx-auto text-slate-300" />
            <p className="mt-3 font-bold text-slate-600">Hali so‘rov yuborilmagan</p>
            <p className="mt-1 text-sm text-slate-400">
              Mahsulot, mutaxassis yoki vakansiya sahifasidan boshlang.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
