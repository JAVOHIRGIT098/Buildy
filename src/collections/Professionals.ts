import type { CollectionConfig } from 'payload'

export const Professionals: CollectionConfig = {
  slug: 'professionals',
  admin: {
    group: 'Services',
    useAsTitle: 'name',
    defaultColumns: ['name', 'profession', 'location', 'availability'],
  },
  access: {
    read: () => true,
    create: ({ req }) =>
      req.user?.collection === 'admins' ||
      (req.user?.collection === 'users' &&
        req.user.role === 'professional' &&
        req.user.verificationStatus === 'verified'),
    update: ({ req }) => req.user?.collection === 'admins',
    delete: ({ req }) => req.user?.collection === 'admins',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'profession', type: 'text', required: true },
    { name: 'location', type: 'text', required: true },
    { name: 'experienceYears', type: 'number', required: true, min: 0 },
    { name: 'startingPrice', type: 'number', required: true, min: 0 },
    { name: 'description', type: 'textarea', required: true },
    { name: 'skills', type: 'text', required: true },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'availability', type: 'checkbox', defaultValue: true },
    {
      name: 'isDemo',
      type: 'checkbox',
      defaultValue: false,
      access: {
        create: ({ req }) => req.user?.collection === 'admins',
        update: ({ req }) => req.user?.collection === 'admins',
      },
    },
  ],
}
