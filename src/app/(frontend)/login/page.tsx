import { LockKeyhole } from 'lucide-react'
import { AuthForm } from '@/components/AuthForm'

export default function LoginPage() {
  return (
    <section className="page-shell grid min-h-[680px] place-items-center py-14">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl md:p-9">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-amber-700">
          <LockKeyhole />
        </span>
        <h1 className="mt-5 text-3xl font-black text-[#172B4D]">Tizimga kirish</h1>
        <p className="mt-2 text-sm text-slate-500">
          So‘rovlar va shaxsiy dashboardingizga xavfsiz kiring.
        </p>
        <AuthForm mode="login" />
        <button
          disabled
          className="mt-5 w-full text-center text-xs text-slate-400"
          title="Beta bosqichida email xizmati ulanmagan"
        >
          Parolni tiklash — email integratsiyasidan keyin
        </button>
      </div>
    </section>
  )
}
