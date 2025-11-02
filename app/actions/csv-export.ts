'use server'

import {User} from '@/@types/apiResponseTypes'
import {auth} from '@/auth'
import {
  calculateMonthlyRevenue,
  generateMonthlyRevenueCSV,
} from '@/lib/csv-export'
import {db} from '@/lib/db'

export type ExportUsersToCSVParams = {
  startDate: Date
  endDate: Date
}

export type ExportUsersToCSVResult = {
  csv: string
  monthCount: number
}

/**
 * Server action to export user data as CSV for a given date range.
 * Only accessible to admin users.
 */
export async function exportUsersToCSV(
  params: ExportUsersToCSVParams,
): Promise<ExportUsersToCSVResult> {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    throw new Error('Forbidden.')
  }

  const {startDate, endDate} = params

  // For database query, we need exclusive upper bound (lt), so add 1 day to endDate
  // User selects April 5, we query with lt April 6 to include all of April 5
  const queryEndDate = new Date(endDate)
  queryEndDate.setUTCDate(queryEndDate.getUTCDate() + 1)

  // Fetch users with their appointments and invoices in the date range
  const users: User[] = await db.user.findMany({
    select: {
      appointments: {
        select: {
          date: true,
          description: true,
          fee: true,
          id: true,
          name: true,
          ownerId: true,
          startTime: true,
          endTime: true,
          status: true,
          videoUrl: true,
        },
        where: {
          deleted: false,
          date: {
            gte: startDate,
            lt: queryEndDate,
          },
        },
      },
      bootcamps: {
        select: {
          date: true,
          description: true,
          id: true,
          name: true,
          videoUrl: true,
        },
        where: {
          deleted: false,
          date: {
            gte: startDate,
            lt: queryEndDate,
          },
        },
      },
      billingEmail: true,
      credits: true,
      email: true,
      fee: true,
      id: true,
      invoices: {
        select: {
          date: true,
        },
        where: {
          deleted: false,
          date: {
            gte: startDate,
            lt: queryEndDate,
          },
        },
      },
      name: true,
      role: true,
      type: true,
      workouts: {
        select: {
          date: true,
          description: true,
          id: true,
          name: true,
          ownerId: true,
          status: true,
          videoUrl: true,
        },
        where: {
          deleted: false,
          date: {
            gte: startDate,
            lt: queryEndDate,
          },
        },
      },
    },
  })

  // Calculate monthly revenue totals using pure functions
  const monthlyData = calculateMonthlyRevenue(users)
  const csv = generateMonthlyRevenueCSV(monthlyData, startDate, endDate)

  return {
    csv,
    monthCount: monthlyData.length,
  }
}
