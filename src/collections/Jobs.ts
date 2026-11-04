import type { CollectionConfig } from 'payload'

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  admin: {
    group: 'Employment',
    useAsTitle: 'title',
    defaultColumns: ['title', 'company', 'location', 'status'],
  },
  access: {
    read: () => true,
    create: ({ req }) =>
      req.user?.collection === 'admins' ||
      (req.user?.collection === 'users' &&
        req.user.role === 'employer' &&
        req.user.verificationStatus === 'verified'),
    update: ({ req }) => req.user?.collection === 'admins',
    delete: ({ req }) => req.user?.collection === 'admins',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'company', type: 'text', required: true },
    { name: 'profession', type: 'text', required: true },
    { name: 'location', type: 'text', required: true },
    { name: 'salaryMin', type: 'number', required: true, min: 0 },
    { name: 'salaryMax', type: 'number', required: true, min: 0 },
    { name: 'workType', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
    { name: 'requirements', type: 'textarea', required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'open',
      options: ['open', 'closed'],
    },
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
