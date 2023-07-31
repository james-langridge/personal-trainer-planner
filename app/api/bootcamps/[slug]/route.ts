import {NextRequest, NextResponse} from 'next/server'
import {getServerSession} from 'next-auth/next'

import {Bootcamp} from '@/@types/apiResponseTypes'
import {authOptions} from '@/app/api/auth/[...nextauth]/route'
import {db} from '@/lib/db'

export async function GET(
  req: NextRequest,
  {params}: {params: {slug: string}},
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({message: 'You must be logged in.'}, {status: 401})
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
}
