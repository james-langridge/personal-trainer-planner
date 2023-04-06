import {NextRequest, NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {comparePasswords, hashPassword} from '@/lib/auth'

export async function PUT(req: NextRequest) {
  const body = await req.json()

  const user = await db.user.findUnique({
    where: {
      id: body.id,
    },
  })

  if (!user) {
    return NextResponse.json(
      {error: 'User ID not found'},
      {
        status: 401,
      },
    )
  }

  const isOldPasswordCorrect = await comparePasswords(
    body.oldPassword,
    user.password,
  )

  if (!isOldPasswordCorrect) {
    return NextResponse.json(
      {error: 'Password not recognised'},
      {
        status: 401,
      },
    )
  }

  if (body.newPassword !== body.confirmNewPassword) {
    return NextResponse.json(
      {error: 'Passwords do not match'},
      {
        status: 400,
      },
    )
  }

  const response = await db.user.update({
    where: {
      id: body.id,
    },
    data: {
      password: await hashPassword(body.newPassword),
    },
  })

  return NextResponse.json(
    {response},
    {
      status: 201,
    },
  )
}
