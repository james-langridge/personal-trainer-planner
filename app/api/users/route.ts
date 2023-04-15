import {NextResponse} from 'next/server'
import {db} from '@/lib/db'

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

  return NextResponse.json({
    status: 200,
    data: users,
  })
}

export interface User {
  firstName: string | null
  lastName: string | null
  id: string
}
