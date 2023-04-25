import {NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {serialiseUsersWithSessions, UserWithSessions} from '@/lib/users'

export const dynamic = 'force-dynamic'

export async function GET() {
  const users: UserWithSessions[] = await db.user.findMany({
    select: {
      id: true,
      admin: true,
      createdAt: true,
      updatedAt: true,
      email: true,
      firstName: true,
      lastName: true,
      sessions: {
        where: {
          deleted: false,
        },
      },
    },
    where: {
      admin: false,
    },
  })

  const serialisedUsers = serialiseUsersWithSessions(users)

  return NextResponse.json({
    status: 200,
    data: serialisedUsers,
  })
}
