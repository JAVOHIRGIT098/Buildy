import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    group: 'Marketplace',
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'price', 'stockStatus'],
  },
  access: {
    read: () => true,
    create: ({ req }) =>
      req.user?.collection === 'admins' ||
      (req.user?.collection === 'users' &&
        req.user.role === 'supplier' &&
        req.user.verificationStatus === 'verified'),
    update: ({ req }) => req.user?.collection === 'admins',
    delete: ({ req }) => req.user?.collection === 'admins',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        'cement',
        'bricks',
        'sand-gravel',
        'steel',
        'roofing',
        'insulation',
        'electrical',
        'plumbing',
        'paint',
        'flooring',
        'doors-windows',
        'tools',
        'other',
      ],
    },
    { name: 'price', type: 'number', required: true, min: 0 },
    { name: 'unit', type: 'text', required: true },
    { name: 'supplierName', type: 'text', required: true },
    { name: 'location', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'stockStatus',
      type: 'select',
      defaultValue: 'available',
      options: [
        { label: 'Available', value: 'available' },
        { label: 'Low stock', value: 'low' },
        { label: 'Unavailable', value: 'unavailable' },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      access: {
        create: ({ req }) => req.user?.collection === 'admins',
        update: ({ req }) => req.user?.collection === 'admins',
      },
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
