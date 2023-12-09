import {NextRequest, NextResponse} from 'next/server'
import {getServerSession} from 'next-auth/next'

import {UserWithWorkouts} from '@/@types/apiResponseTypes'
import {authOptions} from '@/app/api/auth/[...nextauth]/route'
import {db} from '@/lib/db'
import {errorHandler} from '@/lib/errors'

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
    const user: UserWithWorkouts | null = await db.user.findUnique({
      select: {
        appointments: {
          select: {
            date: true,
            description: true,
            fee: true,
            id: true,
            name: true,
            ownerId: true,
            status: true,
            videoUrl: true,
          },
          where: {
            deleted: false,
          },
        },
        bootcamps: {
          select: {
            date: true,
            description: true,
            id: true,
            name: true,
            videoUrl: true,
          },
          where: {
            deleted: false,
          },
        },
        billingEmail: true,
        credits: true,
        email: true,
        fee: true,
        id: true,
        invoices: {
          select: {
            date: true,
          },
          where: {
            deleted: false,
          },
        },
        name: true,
        role: true,
        type: true,
        workouts: {
          select: {
            date: true,
            description: true,
            id: true,
            name: true,
            ownerId: true,
            status: true,
            videoUrl: true,
          },
          where: {
            deleted: false,
          },
        },
      },
      where: {
        id: id,
      },
    })

    return NextResponse.json(user)
  } catch (e) {
    return errorHandler(e)
  }
}
