'use server'

import {auth} from '@/auth'
import {CreateUserBody, UpdateUserBody} from '@/@types/apiRequestTypes'
import {db} from '@/lib/db'

export async function createUser(body: CreateUserBody) {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    throw new Error('Forbidden.')
  }

  return db.user.create({
    data: {
      billingEmail: body.billingEmail || body.email,
      email: body.email,
      fee: body.fee,
      name: body.name,
      type: body.type,
    },
  })
}

export async function updateUser(body: UpdateUserBody) {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    throw new Error('Forbidden.')
  }

  return db.user.update({
    where: {
      id: body.id,
    },
    data: {
      ...(body.billingEmail !== undefined && {
        billingEmail: body.billingEmail,
      }),
      ...(body.credits !== undefined && {credits: body.credits}),
      ...(body.email && {email: body.email}),
      ...(body.fee && {fee: body.fee}),
      ...(body.name && {name: body.name}),
      ...(body.type && {type: body.type}),
    },
  })
}
