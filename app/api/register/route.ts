import {db} from '@/lib/db'
import {hashPassword} from '@/lib/auth'
import {NextRequest, NextResponse} from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const user = await db.user.create({
    data: {
      email: body.email,
      password: await hashPassword(body.password),
      firstName: body.firstName,
      lastName: body.lastName,
    },
  })

  return NextResponse.json(
    {user},
    {
      status: 201,
    },
  )
}
