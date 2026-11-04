import { UserRoundPlus } from 'lucide-react'
import { AuthForm } from '@/components/AuthForm'

export default function RegisterPage() {
  return (
    <section className="page-shell grid min-h-[760px] place-items-center py-14">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-7 shadow-xl md:p-9">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-amber-700">
          <UserRoundPlus />
        </span>
        <h1 className="mt-5 text-3xl font-black text-[#172B4D]">Buildy’ga qo‘shiling</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Hisob turini tanlang. Har bir rol uchun dashboard imkoniyatlari bosqichma-bosqich
          faollashadi.
        </p>
        <AuthForm mode="register" />
      </div>
    </section>
  )
}
