import {NextRequest, NextResponse} from 'next/server'
import {db} from '@/lib/db'

export async function GET(
  req: NextRequest,
  {params}: {params: {slug: string}},
) {
  const id = params.slug
  const sessions = await db.session.findMany({
    where: {
      ownerId: id,
      NOT: {
        deleted: true,
      },
    },
  })

  return NextResponse.json({
    status: 200,
    data: sessions,
  })
}
