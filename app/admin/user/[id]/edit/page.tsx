import {USER_TYPE} from '@prisma/client'

import EditForm from '@/app/admin/user/[id]/edit/edit-form'
import {db} from '@/lib/db'

export default async function EditUser(props: {params: Promise<{id: string}>}) {
  const params = await props.params
  const {id} = params
  const {user} = await getUser(id)

  if (!user) {
    return null
  }

  return <EditForm user={user} />
}

export type User = {
  billingEmail: string | null
  credits: number
  fee: number
  type: USER_TYPE
  email: string
  id: string
  name: string
}

async function getUser(id?: string) {
  if (!id) {
    return {user: undefined}
  }

  const user = await db.user.findUnique({
    select: {
      billingEmail: true,
      credits: true,
      email: true,
      fee: true,
      id: true,
      name: true,
      type: true,
    },
    where: {
      id: id,
    },
  })

  return {user}
}
