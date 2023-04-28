import {NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {serialiseUsersWithWorkouts, UserWithWorkouts} from '@/lib/users'

export const dynamic = 'force-dynamic'

export async function GET() {
  const users: UserWithWorkouts[] = await db.user.findMany({
    select: {
      id: true,
      admin: true,
      createdAt: true,
      updatedAt: true,
      email: true,
      firstName: true,
      lastName: true,
      workouts: {
        where: {
          deleted: false,
        },
      },
    },
    where: {
      admin: false,
    },
  })

  const serialisedUsers = serialiseUsersWithWorkouts(users)

  return NextResponse.json({
    status: 200,
    data: serialisedUsers,
  })
}
