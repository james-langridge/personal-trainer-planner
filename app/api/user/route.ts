import {NextRequest, NextResponse} from 'next/server'
import {getServerSession} from 'next-auth/next'

import {CreateUserBody} from '@/@types/apiRequestTypes'
import {authOptions} from '@/app/api/auth/[...nextauth]/route'
import {db} from '@/lib/db'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({message: 'You must be logged in.'}, {status: 401})
  }

  if (session.user?.role !== 'admin') {
    return NextResponse.json({message: 'Forbidden.'}, {status: 403})
  }

  const body: CreateUserBody = await req.json()

  const user = await db.user.create({
    data: {
      email: body.email,
      name: body.name,
      type: body.type,
    },
  })

  return NextResponse.json(
    {user},
    {
      status: 201,
    },
  )
}
