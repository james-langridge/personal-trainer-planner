import {db} from '@/lib/db'
import {NextRequest, NextResponse} from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  {params}: {params: {slug: string}},
) {
  const id = params.slug
  const session = await db.session.findUnique({
    where: {
      id: id,
    },
  })

  return NextResponse.json({
    status: 200,
    data: session,
  })
}
