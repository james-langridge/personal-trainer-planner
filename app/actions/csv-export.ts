'use server'

import {User} from '@/@types/apiResponseTypes'
import {auth} from '@/auth'
import {formatUsersForCSV, generateCSVString} from '@/lib/csv-export'
import {db} from '@/lib/db'

export type ExportUsersToCSVParams = {
  startDate: Date
  endDate: Date
}

export type ExportUsersToCSVResult = {
  csv: string
  userCount: number
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
            lt: endDate,
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
            lt: endDate,
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
            lt: endDate,
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
            lt: endDate,
          },
        },
      },
    },
  })

  // Transform to CSV format using pure functions
  const csvData = formatUsersForCSV(users)
  const csv = generateCSVString(csvData)

  return {
    csv,
    userCount: users.length,
  }
}
