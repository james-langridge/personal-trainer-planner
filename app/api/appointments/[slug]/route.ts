import {NextRequest, NextResponse} from 'next/server'
import {getServerSession} from 'next-auth/next'

import {authOptions} from '@/app/api/auth/[...nextauth]/route'
import {db} from '@/lib/db'
import {errorHandler} from '@/lib/errors'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  {params}: {params: {slug: string}},
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        {message: 'You must be logged in.'},
        {status: 401},
      )
    }

    const id = params.slug
    const appointment = await db.appointment.findUnique({
      where: {
        id: id,
      },
    })

    return NextResponse.json(appointment)
  } catch (e) {
    return errorHandler(e)
  }
}
