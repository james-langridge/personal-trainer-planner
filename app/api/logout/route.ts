import {serialize} from 'cookie'
import {NextRequest, NextResponse} from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()

  if (body.key === 'static_key') {
    const cookie = serialize(process.env.COOKIE_NAME || '', '', {
      httpOnly: true,
      maxAge: -1,
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV !== 'development',
    })

    return NextResponse.json(
      {roles: null, auth: false},
      {
        status: 201,
        headers: {'Set-Cookie': cookie},
      },
    )
  }

  return NextResponse.json(
    {status: 'fail', message: 'Bad request'},
    {
      status: 400,
    },
  )
}
