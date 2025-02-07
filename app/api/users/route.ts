import {NextRequest, NextResponse} from 'next/server'

import {CreateUserBody, UpdateUserBody} from '@/@types/apiRequestTypes'
import {SerialisedUser} from '@/@types/apiResponseTypes'
import {auth} from '@/auth'
import {db} from '@/lib/db'
import {errorHandler} from '@/lib/errors'
import {getSerialisedUsers} from '@/prisma/api'

export const dynamic = 'force-dynamic'

// Using the Request object with the GET method opts out of Route Handler caching.
// https://nextjs.org/docs/app/building-your-application/routing/route-handlers#opting-out-of-caching
export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        {message: 'You must be logged in.'},
        {status: 401},
      )
    }

    if (session.user?.role !== 'admin') {
      return NextResponse.json({message: 'Forbidden.'}, {status: 403})
    }

    const {searchParams} = new URL(request.url)
    const dateQuery = searchParams.get('date')

    let dateFilter = undefined

    if (dateQuery) {
      const thisMonth = new Date(dateQuery)
      const nextMonth = new Date(
        thisMonth.getFullYear(),
        thisMonth.getMonth() + 1,
      )

      dateFilter = {
        gte: thisMonth,
        lt: nextMonth,
      }
    }

    const {users} = await getSerialisedUsers(dateFilter)

    return NextResponse.json(users)
  } catch (e) {
    return errorHandler(e)
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        {message: 'You must be logged in.'},
        {status: 401},
      )
    }

    if (session.user?.role !== 'admin') {
      return NextResponse.json({message: 'Forbidden.'}, {status: 403})
    }

    const body: CreateUserBody = await req.json()

    const user = await db.user.create({
      data: {
        billingEmail: body.billingEmail || body.email,
        email: body.email,
        fee: body.fee,
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
  } catch (e) {
    return errorHandler(e)
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        {message: 'You must be logged in.'},
        {status: 401},
      )
    }

    if (session.user?.role !== 'admin') {
      return NextResponse.json({message: 'Forbidden.'}, {status: 403})
    }

    const body: UpdateUserBody = await req.json()

    const user = await db.user.update({
      where: {
        id: body.id,
      },
      data: {
        ...(body.billingEmail !== undefined && {
          billingEmail: body.billingEmail,
        }),
        ...(body.credits !== undefined && {credits: body.credits}),
        ...(body.email && {email: body.email}),
        ...(body.fee && {fee: body.fee}),
        ...(body.name && {name: body.name}),
        ...(body.type && {type: body.type}),
      },
    })

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
