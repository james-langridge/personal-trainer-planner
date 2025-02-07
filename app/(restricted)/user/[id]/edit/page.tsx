import React from 'react'

import EditForm from '@/app/(restricted)/user/[id]/edit/edit-form'
import {getSerialisedUser} from '@/prisma/api'

export default async function EditUser(props: {params: Promise<{id: string}>}) {
  const params = await props.params
  const {id} = params
  const {user} = await getSerialisedUser(id)

  if (!user) {
    return null
  }

  return <EditForm user={user} />
}
