export const accountRoles = ['customer', 'supplier', 'professional', 'employer'] as const
export const requestTypes = ['product-inquiry', 'service-request', 'job-application'] as const
export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function boundedText(value: unknown, min: number, max: number): string | null {
  if (typeof value !== 'string') return null
  const text = value.trim()
  return text.length >= min && text.length <= max ? text : null
}

export function validPassword(value: unknown): value is string {
  // Passwords are opaque: never trim or truncate them.
  return typeof value === 'string' && value.length >= 8 && value.length <= 128
}

export function normalizePhone(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const phone = value.replace(/[\s()-]/g, '')
  return /^\+998\d{9}$/.test(phone) ? phone : null
}

export function calculateEstimate(area: number, floors: number, type: string) {
  if (
    !Number.isFinite(area) ||
    area < 20 ||
    area > 2000 ||
    !Number.isInteger(floors) ||
    floors < 1 ||
    floors > 3 ||
    !['economy', 'standard', 'premium'].includes(type)
  )
    return null
  const totalArea = area * floors
  const factor = type === 'economy' ? 0.85 : type === 'premium' ? 1.35 : 1
  return {
    totalArea,
    cement: Math.ceil(totalArea * 0.42 * factor),
    blocks: Math.ceil(totalArea * 12.5),
    steel: Number((totalArea * 0.038 * factor).toFixed(1)),
    cost: Math.round(totalArea * 4_200_000 * factor),
  }
}
