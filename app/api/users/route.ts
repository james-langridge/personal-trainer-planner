import {NextRequest, NextResponse} from 'next/server'
import {getServerSession} from 'next-auth/next'

import {CreateUserBody, UpdateUserBody} from '@/@types/apiRequestTypes'
import {UserWithWorkouts} from '@/@types/apiResponseTypes'
import {authOptions} from '@/app/api/auth/[...nextauth]/route'
import {db} from '@/lib/db'

export const dynamic = 'force-dynamic'

// Using the Request object with the GET method opts out of Route Handler caching.
// https://nextjs.org/docs/app/building-your-application/routing/route-handlers#opting-out-of-caching
export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({message: 'You must be logged in.'}, {status: 401})
  }

  if (session.user?.role !== 'admin') {
    return NextResponse.json({message: 'Forbidden.'}, {status: 403})
  }

  const {searchParams} = new URL(request.url)
  const month = searchParams.get('month')

  let date = undefined

  if (month) {
    const thisMonth = new Date(month)
    const nextMonth = new Date(
      thisMonth.getFullYear(),
      thisMonth.getMonth() + 1,
    )

    date = {
      gte: thisMonth,
      lt: nextMonth,
    }
  }

  const users: UserWithWorkouts[] = await db.user.findMany({
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
          ...(date && {date: date}),
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
          ...(date && {date: date}),
        },
      },
      email: true,
      fee: true,
      id: true,
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
          ...(date && {date: date}),
        },
      },
    },
    where: {
      role: 'user',
    },
  })

  return NextResponse.json(users)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({message: 'You must be logged in.'}, {status: 401})
  }

  if (session.user?.role !== 'admin') {
    return NextResponse.json({message: 'Forbidden.'}, {status: 403})
  }

  const body: CreateUserBody = await req.json()

  const user = await db.user.create({
    data: {
      email: body.email,
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
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({message: 'You must be logged in.'}, {status: 401})
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
}
