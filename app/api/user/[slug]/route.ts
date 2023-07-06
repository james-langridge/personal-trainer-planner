import {NextRequest, NextResponse} from 'next/server'

import {UserWithWorkouts} from '@/@types/apiResponseTypes'
import {db} from '@/lib/db'

export async function GET(
  req: NextRequest,
  {params}: {params: {slug: string}},
) {
  const id = params.slug
  const user: UserWithWorkouts | null = await db.user.findUnique({
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
      id: id,
    },
  })

  return NextResponse.json(user)
}
