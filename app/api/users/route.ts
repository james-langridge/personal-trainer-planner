import {NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {User} from '@/lib/api'

export async function GET() {
  const users: User[] = await db.user.findMany({
    where: {
      admin: false,
    },
    select: {
      firstName: true,
      lastName: true,
      id: true,
    },
  })

  return NextResponse.json({users})
}
