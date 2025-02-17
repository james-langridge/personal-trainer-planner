'use client'

import {useGetUser} from '@/app/hooks/users'
import {DataTable} from '@/features/users/individual/DataTable'
import {columns} from '@/features/users/individual/Columns'

export default function UserView({userId}: {userId: string}) {
  const {data: user} = useGetUser(userId)

  if (!user) return null

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
