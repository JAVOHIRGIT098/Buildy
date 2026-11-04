import { APIError, type CollectionConfig } from 'payload'
import { adminFieldOnly, adminOnly, requestOwnerOrAdmin } from '@/access/buildy'
import { boundedText } from '@/lib/buildy-validation'

export const Requests: CollectionConfig = {
  slug: 'requests',
  admin: { group: 'Operations', useAsTitle: 'subject' },
  access: {
    create: ({ req }) => req.user?.collection === 'users',
    read: requestOwnerOrAdmin,
    update: adminOnly,
    delete: requestOwnerOrAdmin,
  },
  hooks: {
    beforeValidate: [
      ({ data, operation, req }) => {
        if (operation === 'create' && req.user?.collection === 'users' && data) {
          data.owner = req.user.id
        }
        return data
      },
    ],
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data
        if (req.user?.collection !== 'users') throw new APIError('Tizimga kiring.', 401)
        if (!boundedText(data.message, 10, 1000))
          throw new APIError('Izoh 10–1000 belgi bo‘lsin.', 400)
        const target = data.target
        const expected = {
          'product-inquiry': 'products',
          'service-request': 'professionals',
          'job-application': 'jobs',
        }[data.type as string]
        if (!target || target.relationTo !== expected || typeof target.value !== 'string') {
          throw new APIError('So‘rov uchun mos e’lonni tanlang.', 400)
        }
        const records = await req.payload.find({
          collection: target.relationTo,
          where: { id: { equals: target.value } },
          limit: 1,
          depth: 0,
          user: req.user,
          overrideAccess: false,
          req,
        })
        const record = records.docs[0]
        if (
          !record ||
          ('stockStatus' in record && record.stockStatus === 'unavailable') ||
          ('status' in record && record.status === 'closed') ||
          ('availability' in record && !record.availability)
        ) {
          throw new APIError('Bu e’lon hozir so‘rov qabul qilmaydi.', 400)
        }
        const recent = await req.payload.find({
          collection: 'requests',
          where: {
            and: [
              { owner: { equals: req.user.id } },
              { type: { equals: data.type } },
              { 'target.value': { equals: target.value } },
              { createdAt: { greater_than: new Date(Date.now() - 60_000).toISOString() } },
            ],
          },
          limit: 1,
          depth: 0,
          user: req.user,
          overrideAccess: false,
          req,
        })
        if (recent.docs.length)
          throw new APIError(
            'Shu e’longa so‘rov yuborilgan. Bir daqiqadan keyin qayta urinib ko‘ring.',
            429,
          )
        // Set server-owned fields after field access has removed caller input.
        data.owner = req.user.id
        data.status = 'new'
        data.subject = 'title' in record ? record.title : record.name
        data.message = data.message.trim()
        return data
      },
    ],
  },
  fields: [
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
      access: { create: () => false, update: () => false },
    },
    {
      name: 'target',
      type: 'relationship',
      relationTo: ['products', 'professionals', 'jobs'],
      access: { update: adminFieldOnly },
      admin: {
        description:
          'New requests are bound to an eligible public listing. Legacy requests remain intact.',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: ['product-inquiry', 'service-request', 'job-application'],
    },
    { name: 'subject', type: 'text', required: true },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      access: { create: () => false, update: adminFieldOnly },
      options: ['new', 'in-review', 'accepted', 'closed'],
    },
  ],
}
