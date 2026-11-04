import { MapPin, MessageSquareText } from 'lucide-react'
import { ContactForm } from '@/components/ContactForm'

export const dynamic = 'force-static'

export default function ContactPage() {
  return (
    <section className="page-shell py-16 md:py-20">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Bog‘lanish</p>
          <h1 className="section-title mt-3">Savolingiz bormi?</h1>
          <p className="mt-4 max-w-lg leading-7 text-slate-600">
            Beta mahsulot bo‘yicha fikr, hamkorlik yoki muammo haqida yozing. Xabaringiz Buildy
            administratorlari uchun xavfsiz saqlanadi.
          </p>
          <div className="mt-8 grid gap-4 text-sm">
            <p className="flex items-center gap-3">
              <MessageSquareText className="text-amber-600" />
              Bizga ushbu forma orqali yozing
            </p>
            <p className="flex items-center gap-3">
              <MapPin className="text-amber-600" />
              O‘zbekiston
            </p>
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  )
}
