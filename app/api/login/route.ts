import {NextApiResponse} from 'next'
import {db} from '@/lib/db'
import {comparePasswords, createJWT} from '@/lib/auth'
import {serialize} from 'cookie'
import {NextRequest, NextResponse} from 'next/server'

export async function POST(req: NextRequest, res: NextApiResponse) {
  const body = await req.json()

  const user = await db.user.findUnique({
    where: {
      email: body.email,
    },
  })

  if (!user) {
    return NextResponse.json(
      {error: 'Username or password not recognised'},
      {
        status: 401,
      },
    )
  }

  const isUser = await comparePasswords(body.password, user.password)

  if (isUser) {
    const jwt = await createJWT(user)
    const cookie = serialize(process.env.COOKIE_NAME || '', jwt, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return NextResponse.json(
      {data: 'Authenticated'},
      {
        status: 201,
        headers: {'Set-Cookie': cookie},
      },
    )
  } else {
    return NextResponse.json(
      {error: 'Username or password not recognised'},
      {
        status: 401,
      },
    )
  }
}
