import {Day} from '@/@types/types'
import {APPOINTMENT_STATUS, WORKOUT_STATUS} from '@prisma/client'

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
  offset: number = 0,
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

function getDaysInMonth(jsMonth: number, year: number) {
  return new Date(year, jsMonth + 1, 0).getDate()
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

export function getUniqueMonthPaths(dates: Date[], userId: string) {
  const uniqueMonths = new Set(
    dates.map(date => {
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      return `${year}-${month.toString()}`
    }),
  )

  return Array.from(uniqueMonths).map(yearMonth => {
    const [year, month] = yearMonth.split('-')
    return `/calendar/${userId}/${year}/${month}`
  })
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
