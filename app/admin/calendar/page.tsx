// TODO: make this route dynamic so admin always sees fresh data
import {redirect} from 'next/navigation'
import {getServerSession} from 'next-auth/next'
import React from 'react'

import {authOptions} from '@/app/api/auth/[...nextauth]/route'
import Providers from '@/app/Providers'
import {CalendarMediumUser} from '@/components/CalendarMediumUser'
import {CalendarMobile} from '@/components/CalendarMobile'
import ClientWrapper from '@/components/ClientWrapper'
import {Sidebar} from '@/components/Sidebar'
import {db} from '@/lib/db'
import {serialiseUserWithWorkouts, UserWithWorkouts} from '@/lib/users'

const getUserWithWorkouts = async (
  id?: string,
): Promise<{
  user: UserWithWorkouts | null | undefined
}> => {
  if (!id) {
    return {user: undefined}
  }

  const user: UserWithWorkouts | null = await db.user.findUnique({
    select: {
      id: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      email: true,
      name: true,
      workouts: {
        where: {
          deleted: false,
        },
      },
    },
    where: {
      id: id,
    },
  })

  return {user: user}
}

// TODO: no need to memoize this?
const SidebarMemo = React.memo(Sidebar)

export default async function Calender() {
  const session = await getServerSession(authOptions)
  const {user} = await getUserWithWorkouts(session?.user?.id)
  const serialisedUserWithWorkouts = serialiseUserWithWorkouts(user)

  if (!serialisedUserWithWorkouts) {
    return null
  }

  // Redirect admin to protected dynamic route.
  // Static route with revalidation is fine for users.
  if (user?.role === 'admin') {
    redirect('/admin/calendar')
  }

  return (
    <Providers>
      <ClientWrapper user={serialisedUserWithWorkouts}>
        <SidebarMemo />
        <div className="flex w-full flex-col px-5 sm:items-center ">
          <CalendarMobile />
          <CalendarMediumUser />
        </div>
      </ClientWrapper>
    </Providers>
  )
}
