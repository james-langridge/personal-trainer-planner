import {NextResponse} from 'next/server'

import {UserWithWorkouts} from '@/@types/types'
import {db} from '@/lib/db'
import {serialiseUsersWithWorkouts} from '@/lib/users'

export const dynamic = 'force-dynamic'

export async function GET() {
  const users: UserWithWorkouts[] = await db.user.findMany({
    select: {
      email: true,
      id: true,
      name: true,
      role: true,
      workouts: {
        select: {
          date: true,
          description: true,
          id: true,
          name: true,
          ownerId: true,
          status: true,
          type: true,
          videoUrl: true,
        },
        where: {
          deleted: false,
        },
      },
    },
    where: {
      role: null,
    },
  })

  const serialisedUsers = serialiseUsersWithWorkouts(users)

  return NextResponse.json(serialisedUsers)
}
