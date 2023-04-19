import {NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {Session, User} from '@prisma/client'

type Users = Omit<User, 'password' | 'admin'> & {sessions: Session[]}

export async function GET() {
  const users: Users[] = await db.user.findMany({
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      email: true,
      firstName: true,
      lastName: true,
      sessions: true,
    },
    where: {
      admin: false,
    },
  })

  return NextResponse.json({users})
}
