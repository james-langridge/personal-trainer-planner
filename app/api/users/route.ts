import {NextResponse} from 'next/server'

import {UserWithWorkouts} from '@/@types/apiResponseTypes'
import {db} from '@/lib/db'

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

  return NextResponse.json(users)
}
