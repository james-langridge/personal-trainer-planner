import {NextRequest, NextResponse} from 'next/server'
import {getServerSession} from 'next-auth/next'

import {authOptions} from '@/app/api/auth/[...nextauth]/route'
import {db} from '@/lib/db'
import {errorHandler} from '@/lib/errors'

export const dynamic = 'force-dynamic'
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        {message: 'You must be logged in.'},
        {status: 401},
      )
    }

    const {userId, bootcampId, isAttending} = await req.json()

    let user

    if (!isAttending) {
      user = await db.user.update({
        where: {
          id: userId,
        },
        data: {
          credits: {decrement: 1},
          bootcamps: {
            connect: {
              id: bootcampId,
            },
          },
        },
      })
    }

    if (isAttending) {
      user = await db.user.update({
        where: {
          id: userId,
        },
        data: {
          credits: {increment: 1},
          bootcamps: {
            disconnect: {
              id: bootcampId,
            },
          },
        },
      })
    }

    return NextResponse.json(
      {user},
      {
        status: 201,
      },
    )
  } catch (e) {
    return errorHandler(e)
  }
}
