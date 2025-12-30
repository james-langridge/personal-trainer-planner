import {APPOINTMENT_STATUS} from '@prisma/client'

import {User} from '@/@types/apiResponseTypes'

/**
 * Calculates the UK tax year dates for a given date.
 * UK tax year runs from April 6 to April 5 the following year.
 */
export function calculateUKTaxYear(date: Date): {start: Date; end: Date} {
  const year = date.getFullYear()
  const month = date.getMonth()

  // If before April 6, we're in the previous tax year
  const taxYearStart =
    month < 3 || (month === 3 && date.getDate() < 6) ? year - 1 : year

  const start = new Date(Date.UTC(taxYearStart, 3, 6)) // April 6
  const end = new Date(Date.UTC(taxYearStart + 1, 3, 5)) // April 5 next year

  return {start, end}
}

type MonthlyRevenue = {
  month: string
  revenue: number
}

/**
 * Calculates monthly revenue totals from user data
 */
export function calculateMonthlyRevenue(users: User[]): MonthlyRevenue[] {
  const monthlyTotals = new Map<string, number>()

  // Aggregate all attended appointments by month
  for (const user of users) {
    for (const appointment of user.appointments) {
      if (appointment.status === APPOINTMENT_STATUS.ATTENDED) {
        const date = new Date(appointment.date)
        const monthKey = `${date.getUTCFullYear()}-${String(
          date.getUTCMonth() + 1,
        ).padStart(2, '0')}`

        const currentTotal = monthlyTotals.get(monthKey) || 0
        monthlyTotals.set(monthKey, currentTotal + appointment.fee)
      }
    }
  }

  // Convert to sorted array
  const monthlyData = Array.from(monthlyTotals.entries())
    .map(([monthKey, revenueInPence]) => ({
      month: monthKey,
      revenue: revenueInPence / 100, // Convert to pounds
    }))
    .sort((a, b) => a.month.localeCompare(b.month))

  return monthlyData
}

/**
 * Formats monthly revenue data as CSV string with header and total
 */
export function generateMonthlyRevenueCSV(
  monthlyData: MonthlyRevenue[],
  startDate: Date,
  endDate: Date,
): string {
  const csvRows: string[] = []

  // Add header with date range
  const dateRange = formatDateRangeForDisplay(startDate, endDate)
  csvRows.push(`Revenue Summary: ${dateRange}`)
  csvRows.push('')

  // Add column headers
  csvRows.push('Month,Revenue (£)')

  // Add monthly data
  for (const {month, revenue} of monthlyData) {
    const [year, monthNum] = month.split('-')
    const date = new Date(Date.UTC(parseInt(year), parseInt(monthNum) - 1, 1))
    const monthName = date.toLocaleString('en-GB', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    })
    csvRows.push(`${monthName},${revenue.toFixed(2)}`)
  }

  // Add total row
  const total = monthlyData.reduce((sum, {revenue}) => sum + revenue, 0)
  csvRows.push('')
  csvRows.push(`Total,${total.toFixed(2)}`)

  return csvRows.join('\n')
}

/**
 * Formats a date range for display (e.g., "6 Apr 2024 - 5 Apr 2025")
 */
export function formatDateRangeForDisplay(start: Date, end: Date): string {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date)
  }

  return `${formatDate(start)} - ${formatDate(end)}`
}

/**
 * Generates filename for CSV export
 */
export function generateCSVFilename(startDate: Date, endDate: Date): string {
  const formatDateForFilename = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const start = formatDateForFilename(startDate)
  const end = formatDateForFilename(endDate)

  return `monthly-revenue-${start}-to-${end}.csv`
}
