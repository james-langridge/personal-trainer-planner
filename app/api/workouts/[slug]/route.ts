import {NextRequest, NextResponse} from 'next/server'

import {auth} from '@/auth'
import {db} from '@/lib/db'
import {errorHandler} from '@/lib/errors'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  {params}: {params: {slug: string}},
) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        {message: 'You must be logged in.'},
        {status: 401},
      )
    }

    const id = params.slug
    const workout = await db.workout.findUnique({
      where: {
        id: id,
      },
    })

    return NextResponse.json(workout)
  } catch (e) {
    return errorHandler(e)
  }
}
