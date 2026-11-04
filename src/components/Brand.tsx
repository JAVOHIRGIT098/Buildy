import Link from 'next/link'

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2.5 font-black tracking-tight ${inverse ? 'text-white' : 'text-[#172B4D]'}`}
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#F59E0B] text-lg text-[#172B4D]">
        B
      </span>
      <span className="text-xl">Buildy</span>
    </Link>
  )
}
