import { APIError, type CollectionConfig } from 'payload'
import { adminFieldOnly, selfOrAdmin } from '@/access/buildy'
import { boundedText, normalizePhone, validPassword } from '@/lib/buildy-validation'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    group: 'Buildy',
    useAsTitle: 'name',
  },
  auth: { tokenExpiration: 7200, maxLoginAttempts: 5, lockTime: 15 * 60 * 1000, useSessions: true },
  hooks: {
    beforeValidate: [
      ({ data, operation, req }) => {
        if (operation === 'create' && req.user?.collection !== 'admins') {
          if (
            !data ||
            !boundedText(data.name, 2, 100) ||
            !normalizePhone(data.phone) ||
            !boundedText(data.city, 2, 80) ||
            !validPassword(data.password)
          ) {
            throw new APIError(
              'Ism, +998 telefon, shahar va 8–128 belgili parolni tekshiring.',
              400,
            )
          }
          data.phone = normalizePhone(data.phone)
          data.name = data.name.trim()
        }
        return data
      },
    ],
  },
  access: {
    admin: () => false,
    create: () => true,
    read: selfOrAdmin,
    update: selfOrAdmin,
    delete: selfOrAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      access: { update: adminFieldOnly },
      options: [
        { label: 'Customer', value: 'customer' },
        { label: 'Supplier / Store', value: 'supplier' },
        { label: 'Worker / Professional', value: 'professional' },
        { label: 'Employer / Company', value: 'employer' },
      ],
    },
    {
      name: 'city',
      type: 'text',
      defaultValue: 'Toshkent',
    },
    {
      name: 'verificationStatus',
      type: 'select',
      defaultValue: 'pending',
      access: {
        create: () => false,
        update: ({ req }) => req.user?.collection === 'admins',
      },
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Verified', value: 'verified' },
        { label: 'Rejected', value: 'rejected' },
      ],
    },
  ],
}
