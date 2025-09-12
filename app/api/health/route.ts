import {NextResponse} from 'next/server'
import {db} from '@/lib/db'

export async function GET() {
  try {
    // Check database connection
    await db.$queryRaw`SELECT 1`

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Database connection failed',
        timestamp: new Date().toISOString(),
      },
      {status: 503},
    )
  }
}
