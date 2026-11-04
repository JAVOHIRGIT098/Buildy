import 'server-only'

import { getPayloadClient } from '@/lib/payload'

export async function getProducts(limit = 30) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'products',
    depth: 1,
    limit,
    sort: '-featured',
    overrideAccess: false,
  })
  return result.docs
}

export async function getProfessionals(limit = 30) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'professionals',
    depth: 1,
    limit,
    sort: '-availability',
    overrideAccess: false,
  })
  return result.docs
}

export async function getJobs(limit = 30) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'jobs',
    limit,
    where: { status: { equals: 'open' } },
    overrideAccess: false,
  })
  return result.docs
}

export function mediaData(value: unknown) {
  if (!value || typeof value === 'string') return null
  const media = value as {
    url?: string | null
    alt?: string
    width?: number | null
    height?: number | null
  }
  if (!media.url) return null
  return {
    url: media.url,
    alt: media.alt || '',
    width: media.width || 1200,
    height: media.height || 800,
  }
}
