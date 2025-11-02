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
  const end = new Date(Date.UTC(taxYearStart + 1, 3, 6)) // April 6 next year

  return {start, end}
}

/**
 * Calculates total revenue for a user from attended appointments
 */
function calculateUserRevenue(user: User): number {
  return user.appointments.reduce((total, appointment) => {
    if (appointment.status === APPOINTMENT_STATUS.ATTENDED) {
      return total + appointment.fee
    }
    return total
  }, 0)
}

/**
 * Formats a user record for CSV export
 */
function formatUserForCSV(user: User): Record<string, string | number> {
  const booked = user.appointments.length
  const attended = user.appointments.filter(
    appointment => appointment.status === APPOINTMENT_STATUS.ATTENDED,
  ).length
  const revenueInPence = calculateUserRevenue(user)
  const revenueInPounds = revenueInPence / 100
  const feeInPounds = user.fee / 100
  const hasInvoice = user.invoices.length > 0

  return {
    Name: user.name,
    Type: user.type,
    Email: user.email,
    'Billing Email': user.billingEmail || user.email,
    'Fee (£)': feeInPounds.toFixed(2),
    Credits: user.credits,
    'Appointments Booked': booked,
    'Appointments Attended': attended,
    'Total Revenue (£)': revenueInPounds.toFixed(2),
    'Invoice Sent': hasInvoice ? 'Yes' : 'No',
  }
}

/**
 * Transforms user data array into CSV rows
 */
export function formatUsersForCSV(
  users: User[],
): Array<Record<string, string | number>> {
  return users.map(formatUserForCSV)
}

/**
 * Converts data rows to CSV string format
 */
export function generateCSVString(
  data: Array<Record<string, string | number>>,
): string {
  if (data.length === 0) {
    return ''
  }

  const headers = Object.keys(data[0])
  const csvRows: string[] = []

  // Add headers
  csvRows.push(headers.join(','))

  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header]
      // Escape values that contain commas or quotes
      const stringValue = String(value)
      if (stringValue.includes(',') || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      return stringValue
    })
    csvRows.push(values.join(','))
  }

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

  return `user-summary-${start}-to-${end}.csv`
}
