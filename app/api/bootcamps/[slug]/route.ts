import {NextRequest, NextResponse} from 'next/server'

import {Bootcamp} from '@/@types/apiResponseTypes'
import {auth} from '@/auth'
import {db} from '@/lib/db'
import {errorHandler} from '@/lib/errors'

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

    const isAdmin = session.user?.role === 'admin'

    const id = params.slug
    const bootcamp: Bootcamp | null = await db.bootcamp.findUnique({
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
        id: id,
      },
    })

    return NextResponse.json(bootcamp)
  } catch (e) {
    return errorHandler(e)
  }
}
