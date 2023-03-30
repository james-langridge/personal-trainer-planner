import {NextResponse} from 'next/server'
import {serialize} from 'cookie'

export async function GET() {
  const cookie = serialize(process.env.COOKIE_NAME || '', '', {
    path: '/',
    maxAge: -1,
  })

  return NextResponse.json(
    {data: 'Logged out'},
    {
      status: 201,
      headers: {'Set-Cookie': cookie},
    },
  )
}
