'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="uz">
      <body className="min-h-screen bg-slate-50 p-6 text-slate-800">
        <main className="mx-auto mt-24 max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-amber-100 font-black text-amber-700">
            B
          </div>
          <h1 className="mt-5 text-2xl font-black text-[#172B4D]">
            Sahifani yuklashda xatolik yuz berdi
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Qayta urinib ko‘ring. Muammo davom etsa, Buildy jamoasiga xabar bering.
          </p>
          <button
            onClick={reset}
            className="mt-6 rounded-xl bg-[#F59E0B] px-5 py-3 font-bold text-[#172B4D]"
          >
            Qayta urinish
          </button>
        </main>
      </body>
    </html>
  )
}
