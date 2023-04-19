import {NextRequest, NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {Session, User} from '@prisma/client'

type UserRes = (Omit<User, 'password' | 'admin'> & {sessions: Session[]}) | null

export async function GET(
  req: NextRequest,
  {params}: {params: {slug: string}},
) {
  const id = params.slug
  const user: UserRes = await db.user.findUnique({
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
      id: id,
    },
  })

  return NextResponse.json({user})
}
