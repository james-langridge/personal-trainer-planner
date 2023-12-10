import React from 'react'

import {UserWithWorkouts} from '@/@types/apiResponseTypes'
import {columns} from '@/features/users/individual/Columns'
import {DataTable} from '@/features/users/individual/DataTable'
import {db} from '@/lib/db'

const getUser = async (
  id?: string,
): Promise<{
  user: UserWithWorkouts | null | undefined
}> => {
  if (!id) {
    return {user: undefined}
  }

  const user: UserWithWorkouts | null = await db.user.findUnique({
    select: {
      appointments: {
        select: {
          date: true,
          description: true,
          fee: true,
          id: true,
          name: true,
          ownerId: true,
          status: true,
          videoUrl: true,
        },
        where: {
          deleted: false,
        },
      },
      bootcamps: {
        select: {
          date: true,
          description: true,
          id: true,
          name: true,
          videoUrl: true,
        },
        where: {
          deleted: false,
        },
      },
      billingEmail: true,
      credits: true,
      email: true,
      fee: true,
      id: true,
      invoices: {
        select: {
          date: true,
        },
        where: {
          deleted: false,
        },
      },
      name: true,
      role: true,
      type: true,
      workouts: {
        select: {
          date: true,
          description: true,
          id: true,
          name: true,
          ownerId: true,
          status: true,
          videoUrl: true,
        },
        where: {
          deleted: false,
        },
      },
    },
    where: {
      id: id,
    },
  })

  return {user}
}

export default async function UserDetails({params}: {params: {id: string}}) {
  const {id} = params
  const {user} = await getUser(id)

  if (!user) {
    return null
  }

  return (
    <div className="p-5">
      <h1 className="mb-5 text-6xl font-bold capitalize">{user.name}</h1>
      {/*TODO: re-think this*/}
      {/*<div className="m-2 max-w-fit border p-2">*/}
      {/*<div>Email: {user.email}</div>*/}
      {/*<div>Workouts assigned: {user.workoutsAssigned}</div>*/}
      {/*<div>Workouts completed: {user.workoutsCompleted}</div>*/}
      {/*<div>Appointments: {user.appointments}</div>*/}
      {/*<div>Appointments attended: {user.appointmentsAttended}</div>*/}
      {/*</div>*/}

      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={user.workouts} />
      </div>
    </div>
  )
}
