import {NextRequest, NextResponse} from 'next/server'

import {UserWithWorkouts} from '@/@types/types'
import {db} from '@/lib/db'
import {serialiseUserWithWorkouts} from '@/lib/users'

export async function GET(
  req: NextRequest,
  {params}: {params: {slug: string}},
) {
  const id = params.slug
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

  const serialisedUser = serialiseUserWithWorkouts(user)

  return NextResponse.json(serialisedUser)
}
