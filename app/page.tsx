import {redirect} from 'next/navigation'
import {getServerSession} from 'next-auth/next'
import React from 'react'

import {authOptions} from '@/app/api/auth/[...nextauth]/route'
import Providers from '@/app/Providers'
import {CalendarGridUser} from '@/components/CalendarGridUser'
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

export default async function Calender() {
  // const session = await getServerSession(authOptions)
  // const {user} = await getUserWithWorkouts(session?.user?.id)
  // TODO: some mapping takes place here, not just serialisation
  // const serialisedUserWithWorkouts = serialiseUserWithWorkouts(user)

  // if (!user) {
  //   return null
  // }

  // Redirect admin to protected dynamic route.
  // Static route with revalidation is fine for users.
  // FIXME: Unnecessary redirect.  Doesn't matter if admin can access.
  // if (user?.role === 'admin') {
  //   redirect('/admin/calendar')
  // }

  // TODO: are the providers needed?

  return (
    <Providers>
      {/*<ClientWrapper user={serialisedUserWithWorkouts}>*/}
      {/*<CalendarMediumUser className="flex w-full flex-col px-5 sm:items-center ">*/}
      <CalendarMobile />
      <CalendarMediumUser>
        <CalendarGridUser monthData={monthData} />
      </CalendarMediumUser>
      {/*</ClientWrapper>*/}
    </Providers>
  )
}
