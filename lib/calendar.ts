import {Day} from '@/@types/types'
import {APPOINTMENT_STATUS, WORKOUT_STATUS} from '@prisma/client'
import {format, addHours as addHoursDateFns, parse, set} from 'date-fns'
import {formatInTimeZone, toZonedTime} from 'date-fns-tz'

/**
 * Format time as HH:mm in 24-hour format
 */
export function formatTime24(date: Date): string {
  return format(date, 'HH:mm')
}

/**
 * Format time as h:mm a in 12-hour format
 */
export function formatTime12(date: Date): string {
  return format(date, 'h:mm a')
}

/**
 * Format time range for display
 */
export function formatTimeRange(
  startTime: Date,
  endTime: Date,
  use24Hour = false,
): string {
  const timeFormat = use24Hour ? 'HH:mm' : 'h:mm a'
  return `${format(startTime, timeFormat)} - ${format(endTime, timeFormat)}`
}

/**
 * Combine date and time strings into a DateTime
 */
export function combineDateAndTime(
  dateStr: string,
  timeStr: string,
): Date | null {
  if (!dateStr || !timeStr) return null

  try {
    const date = new Date(dateStr)
    const time = parse(timeStr, 'HH:mm', new Date())
    
    return set(date, {
      hours: time.getHours(),
      minutes: time.getMinutes(),
      seconds: 0,
      milliseconds: 0,
    })
  } catch {
    return null
  }
}

/**
 * Add hours to a date
 */
export function addHours(date: Date, hours: number): Date {
  return addHoursDateFns(date, hours)
}

/**
 * Extract time string from DateTime in HH:mm format
 */
export function extractTimeString(date: Date | null): string {
  if (!date) return ''
  return format(date, 'HH:mm')
}

/**
 * Format date with time in timezone
 */
export function formatDateTimeInTimezone(
  date: Date,
  timezone: string,
  formatStr = 'yyyy-MM-dd HH:mm zzz',
): string {
  return formatInTimeZone(date, timezone, formatStr)
}

/**
 * Convert date to timezone
 */
export function convertToTimezone(date: Date, timezone: string): Date {
  return toZonedTime(date, timezone)
}

function areDatesEqual(calendarDate: Date, workoutDate: Date) {
  const workoutYear = workoutDate.getFullYear()
  const workoutMonth = workoutDate.getMonth()
  const workoutDay = workoutDate.getDate()

  const calendarYear = calendarDate.getFullYear()
  const calendarMonth = calendarDate.getMonth()
  const calendarDay = calendarDate.getDate()

  return (
    workoutYear === calendarYear &&
    workoutMonth === calendarMonth &&
    workoutDay === calendarDay
  )
}

export type DateFilter = {
  gte: Date
  lt: Date
}

export function getPrismaDateFilter(
  year: number,
  jsMonth: number,
  offset = 0,
): DateFilter {
  if (offset % 2 !== 0) {
    throw new Error('Offset must be an even number')
  }
  const monthsEachWay = offset / 2
  const startDate = new Date(Date.UTC(year, jsMonth - monthsEachWay, 1))
  const endDate = new Date(Date.UTC(year, jsMonth + monthsEachWay + 1, 1))

  return {
    gte: startDate,
    lt: endDate,
  }
}

export function getNextMonthFilter(currentFilter: DateFilter) {
  const {year, month} = extractYearAndMonth(currentFilter.gte)
  if (month === 11) {
    return getPrismaDateFilter(year + 1, 0)
  }
  return getPrismaDateFilter(year, month + 1)
}

export function getPreviousMonthFilter(currentFilter: DateFilter) {
  const {year, month} = extractYearAndMonth(currentFilter.gte)
  if (month === 0) {
    return getPrismaDateFilter(year - 1, 11)
  }
  return getPrismaDateFilter(year, month - 1)
}

function extractYearAndMonth(date: Date) {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth(),
  }
}

export function generateCalendarMonth(dateFilter: DateFilter): Day[] {
  const allDays: Day[] = []
  const currentDate = new Date(dateFilter.gte)

  while (currentDate < dateFilter.lt) {
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()
    const currentDay = currentDate.getDate()
    const weekDay = currentDate.getDay()

    allDays.push({
      day: currentDay,
      weekDay,
      month: currentMonth,
      year: currentYear,
    })

    currentDate.setDate(currentDate.getDate() + 1)
  }

  return allDays
}

export function getLongDate(date: Date) {
  return new Date(date).toLocaleString('default', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function getLongWeekday(dayData: Day) {
  const {day, month, year} = dayData

  return new Date(year, month, day).toLocaleString('default', {
    weekday: 'long',
  })
}

export function getMonthName(dayData: Day) {
  const {day, month, year} = dayData

  return new Date(year, month, day).toLocaleString('default', {
    month: 'short',
  })
}

export function getShortWeekday(dayData: Day) {
  const {day, month, year} = dayData

  return new Date(year, month, day).toLocaleString('default', {
    weekday: 'short',
  })
}
export function getWeekday(dateString: string): number {
  const date = new Date(dateString)
  return date.getUTCDay()
}

export function getRepeatingDates(
  dateString: string,
  weekdays: number[],
  weeksToRepeat: number,
): Date[] {
  const date = new Date(dateString)
  const dayOfWeek = date.getDay()
  const dates: Date[] = []

  for (let week = 0; week <= weeksToRepeat; week++) {
    weekdays.forEach(weekday => {
      const newDate = new Date(date)

      if (weekday === 0) {
        newDate.setDate(date.getDate() + weekday - dayOfWeek + (week + 1) * 7)
      } else {
        newDate.setDate(date.getDate() + weekday - dayOfWeek + week * 7)
      }

      dates.push(newDate)
    })
  }

  return dates
}

export type Workout = {
  id: string
  name: string
  date: Date
  ownerId: string
  status: WORKOUT_STATUS
}

export type Appointment = {
  id: string
  name: string
  date: Date
  ownerId: string
  startTime: Date | null
  endTime: Date | null
  status: APPOINTMENT_STATUS
}

export type Bootcamp = {
  id: string
  name: string
  date: Date
}

export function getEventsToday<T extends Workout | Appointment | Bootcamp>(
  calendarDay: {
    day: number
    weekDay: number
    month: number
    year: number
  },
  items: T[] = [],
): T[] {
  const calendarDate = new Date(
    calendarDay.year,
    calendarDay.month,
    calendarDay.day,
  )

  const workoutsMap = items.map(item => {
    const workoutDate =
      item.date instanceof Date ? item.date : new Date(item.date)

    if (areDatesEqual(calendarDate, workoutDate)) {
      return item
    }
  })

  return workoutsMap.filter(Boolean) as T[]
}

export function isDayToday(dayData: Day) {
  const now = new Date()
  const {day, month, year} = dayData

  return (
    day === now.getDate() &&
    month === now.getMonth() &&
    year === now.getFullYear()
  )
}

export function isDayTomorrow(dayData: Day) {
  const now = new Date()
  const {day, month, year} = dayData

  return (
    day === now.getDate() + 1 &&
    month === now.getMonth() &&
    year === now.getFullYear()
  )
}

export function padZero(num: number | string) {
  return String(num).padStart(2, '0')
}

export function shouldScrollToThisDay(
  thisDay: Day,
  scrollToThisDay: Omit<Day, 'weekDay'>,
) {
  const {day, month, year} = thisDay

  return (
    scrollToThisDay.month === month &&
    scrollToThisDay.year === year &&
    scrollToThisDay.day === day
  )
}
