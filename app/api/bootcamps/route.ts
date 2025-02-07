import {NextRequest, NextResponse} from 'next/server'

import {CreateBootcampBody, UpdateBootcampBody} from '@/@types/apiRequestTypes'
import {Bootcamp} from '@/@types/apiResponseTypes'
import {auth} from '@/auth'
import {getRepeatingDates} from '@/lib/calendar'
import {db} from '@/lib/db'
import {errorHandler} from '@/lib/errors'

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

    const {
      date,
      description,
      name,
      selectedDays,
      videoUrl,
      weeksToRepeat,
    }: CreateBootcampBody = await req.json()

    const dates = getRepeatingDates(date, selectedDays, weeksToRepeat)

    const data = dates.map(date => {
      return {
        date,
        description,
        name,
        videoUrl,
      }
    })

    const bootcamps = await db.bootcamp.createMany({data})

    return NextResponse.json(
      {bootcamps},
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

    const body: UpdateBootcampBody = await req.json()

    let bootcamp

    if (body.userId !== undefined) {
      if (body.query === 'connect') {
        bootcamp = await db.bootcamp.update({
          where: {id: body.id},
          data: {
            attendees: {
              connect: {id: body.userId},
            },
          },
        })
      } else if (body.query === 'disconnect') {
        bootcamp = await db.bootcamp.update({
          where: {id: body.id},
          data: {
            attendees: {
              disconnect: {id: body.userId},
            },
          },
        })
      }
    } else {
      bootcamp = await db.bootcamp.update({
        where: {id: body.id},
        data: {
          ...(body.date !== undefined && {date: new Date(body.date)}),
          ...(body.deleted === true && {deleted: true}),
          ...(body.description !== undefined && {
            description: body.description,
          }),
          ...(body.name !== undefined && {name: body.name}),
          ...(body.videoUrl !== undefined && {videoUrl: body.videoUrl}),
        },
      })
    }

    return NextResponse.json({bootcamp}, {status: 201})
  } catch (e) {
    return errorHandler(e)
  }
}

export async function GET() {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        {message: 'You must be logged in.'},
        {status: 401},
      )
    }

    const isAdmin = session.user?.role === 'admin'

    const bootcamps = await db.bootcamp.findMany({
      select: {
        ...(isAdmin && {
          _count: {
            select: {attendees: true},
          },
          attendees: {
            select: {
              email: true,
              id: true,
              name: true,
              role: true,
              type: true,
            },
          },
        }),
        date: true,
        description: true,
        id: true,
        name: true,
        videoUrl: true,
      },
      where: {
        deleted: false,
      },
    })

    return NextResponse.json(bootcamps)
  } catch (e) {
    return errorHandler(e)
  }
}
