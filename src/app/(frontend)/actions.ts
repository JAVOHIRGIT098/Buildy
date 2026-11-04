'use server'

import { appAuth, getCurrentUser } from '@/lib/app-auth'
import { getPayloadClient } from '@/lib/payload'
import {
  accountRoles,
  boundedText,
  emailPattern,
  normalizePhone,
  requestTypes,
  validPassword,
} from '@/lib/buildy-validation'

export type ActionResult = { ok: boolean; message: string }

export async function loginAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  const email = boundedText(formData.get('email'), 3, 160)?.toLowerCase()
  const password = formData.get('password')
  if (!email || !emailPattern.test(email) || !validPassword(password)) {
    return { ok: false, message: 'Email yoki parol formati noto‘g‘ri.' }
  }

  try {
    await appAuth.login(email, password)
    return { ok: true, message: 'Xush kelibsiz.' }
  } catch {
    return { ok: false, message: 'Email yoki parol mos kelmadi.' }
  }
}

export async function registerAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  const name = boundedText(formData.get('name'), 2, 100)
  const phone = normalizePhone(formData.get('phone'))
  const city = boundedText(formData.get('city'), 2, 80)
  const role = formData.get('role')
  const email = boundedText(formData.get('email'), 3, 160)?.toLowerCase()
  const password = formData.get('password')

  if (!name || !phone || !city || !accountRoles.includes(role as (typeof accountRoles)[number])) {
    return {
      ok: false,
      message: 'Ism, shahar, hisob turi va +998 formatidagi telefonni tekshiring.',
    }
  }
  if (!email || !emailPattern.test(email) || !validPassword(password)) {
    return { ok: false, message: 'To‘g‘ri email va 8–128 belgili parol kiriting.' }
  }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'users',
      data: {
        name,
        phone,
        city,
        role: role as 'customer' | 'supplier' | 'professional' | 'employer',
        email,
        password,
      },
      overrideAccess: false,
    })
    return { ok: true, message: 'Hisob yaratildi. Endi tizimga kiring.' }
  } catch {
    return { ok: false, message: 'Bu email band yoki ma’lumotlarda xatolik bor.' }
  }
}

export async function logoutAction() {
  await appAuth.logout()
}

export async function createRequestAction(
  _: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const user = await getCurrentUser()
  if (!user) return { ok: false, message: 'So‘rov yuborish uchun tizimga kiring.' }

  const type = formData.get('type')
  const subject = boundedText(formData.get('subject'), 3, 140)
  const message = boundedText(formData.get('message'), 10, 1000)
  const targetId = boundedText(formData.get('targetId'), 1, 100)
  const collection = {
    'product-inquiry': 'products',
    'service-request': 'professionals',
    'job-application': 'jobs',
  }[String(type)]
  if (
    !requestTypes.includes(type as (typeof requestTypes)[number]) ||
    !collection ||
    !subject ||
    !message ||
    !targetId
  ) {
    return { ok: false, message: 'So‘rov mavzusi va izohini to‘liq kiriting.' }
  }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'requests',
      data: {
        owner: user.id,
        type: type as 'product-inquiry' | 'service-request' | 'job-application',
        subject,
        message,
        target: {
          relationTo: collection as 'products' | 'professionals' | 'jobs',
          value: targetId,
        },
      },
      user,
      overrideAccess: false,
    })
    return {
      ok: true,
      message:
        'So‘rovingiz saqlandi. Demo e’lonlar real yetkazib beruvchiga yuborilmaydi. Holatini shaxsiy kabinetda kuzating.',
    }
  } catch (error) {
    if (
      error instanceof Error &&
      'status' in error &&
      (error.status === 400 || error.status === 429)
    ) {
      return { ok: false, message: error.message }
    }
    return { ok: false, message: 'So‘rov saqlanmadi. Birozdan keyin qayta urinib ko‘ring.' }
  }
}

export async function contactAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  if (formData.get('website')) return { ok: false, message: 'Xabar yuborilmadi.' }
  const name = boundedText(formData.get('name'), 2, 100)
  const email = boundedText(formData.get('email'), 3, 160)?.toLowerCase()
  const message = boundedText(formData.get('message'), 10, 2000)
  if (!name || !email || !emailPattern.test(email) || !message) {
    return { ok: false, message: 'Ism, email va 10–2000 belgili xabar kiriting.' }
  }
  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'contact-messages',
      data: { name, email, message },
      overrideAccess: false,
    })
    return {
      ok: true,
      message: 'Xabaringiz qabul qilindi. Uni faqat Buildy administratorlari ko‘ra oladi.',
    }
  } catch {
    return { ok: false, message: 'Xabar saqlanmadi. Keyinroq qayta urinib ko‘ring.' }
  }
}
