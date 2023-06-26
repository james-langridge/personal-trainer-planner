import {NextResponse} from 'next/server'

import {db} from '@/lib/db'
import {serialiseUsersWithWorkouts, UserWithWorkouts} from '@/lib/users'

export const dynamic = 'force-dynamic'

export async function GET() {
  const users: UserWithWorkouts[] = await db.user.findMany({
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
      role: null,
    },
  })

  const serialisedUsers = serialiseUsersWithWorkouts(users)

  return NextResponse.json(serialisedUsers)
}
