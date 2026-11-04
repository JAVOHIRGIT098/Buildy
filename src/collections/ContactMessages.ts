import { APIError, type CollectionConfig } from 'payload'
import { adminOnly } from '@/access/buildy'
import { boundedText, emailPattern } from '@/lib/buildy-validation'

export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  admin: { group: 'Operations', useAsTitle: 'name' },
  access: { create: () => true, read: adminOnly, update: adminOnly, delete: adminOnly },
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (
          operation === 'create' &&
          (!data ||
            !boundedText(data.name, 2, 100) ||
            !boundedText(data.email, 3, 160) ||
            !emailPattern.test(data.email) ||
            !boundedText(data.message, 10, 2000))
        ) {
          throw new APIError('Ism, email va xabarni tekshiring.', 400)
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'message', type: 'textarea', required: true },
  ],
}
