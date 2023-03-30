import {NextRequest, NextResponse} from 'next/server'
import {db} from '@/lib/db'

export async function GET(
  req: NextRequest,
  {params}: {params: {slug: string}},
) {
  const id = params.slug
  const user = await db.user.findUnique({
    where: {
      id: id,
    },
    select: {
      sessions: true,
    },
  })

  return NextResponse.json({
    status: 200,
    data: user,
  })
}
