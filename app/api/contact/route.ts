import {NextRequest, NextResponse} from 'next/server'
import {db} from '@/lib/db'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const submission = await db.contactForm.create({
    data: {
      name: body.name,
      email: body.email,
      message: body.message,
    },
  })

  return NextResponse.json({submission})
}
