import {redirect} from 'next/navigation'
import React from 'react'

import {auth} from '@/auth'
import {Calendar} from '@/features/calendar'
import {getSerialisedUser} from '@/prisma/api'

export const dynamic = 'force-dynamic'

export default async function TrainingStudio() {
  const session = await auth()
  const {user} = await getSerialisedUser(session?.user?.id)

  if (!user) {
    redirect('/api/auth/signin')
  }

  return <Calendar initialUser={user} />
}
