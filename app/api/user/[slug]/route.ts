import {NextRequest, NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {serialiseUserWithSessions, UserWithSessions} from '@/lib/users'

export async function GET(
  req: NextRequest,
  {params}: {params: {slug: string}},
) {
  const id = params.slug
  const user: UserWithSessions | null = await db.user.findUnique({
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
      id: id,
    },
  })

  const serialisedUser = serialiseUserWithSessions(user)

  return NextResponse.json({
    status: 200,
    data: serialisedUser,
  })
}
