import {NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {Session, User} from '@prisma/client'

type UserRes = Omit<User, 'password' | 'admin'> & {sessions: Session[]}

export const dynamic = 'force-dynamic'

export async function GET() {
  const users: UserRes[] = await db.user.findMany({
    select: {
      id: true,
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

  return NextResponse.json({
    status: 200,
    data: users,
  })
}
