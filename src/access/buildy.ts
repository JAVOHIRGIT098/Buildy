import type { Access, FieldAccess } from 'payload'

export const adminOnly: Access = ({ req }) => req.user?.collection === 'admins'
export const adminFieldOnly: FieldAccess = ({ req }) => req.user?.collection === 'admins'

export const selfOrAdmin: Access = ({ req }) => {
  if (req.user?.collection === 'admins') return true
  if (req.user?.collection !== 'users') return false
  return { id: { equals: req.user.id } }
}

export const requestOwnerOrAdmin: Access = ({ req }) => {
  if (req.user?.collection === 'admins') return true
  if (req.user?.collection !== 'users') return false
  return { owner: { equals: req.user.id } }
}
