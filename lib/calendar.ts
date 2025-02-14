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

export function generateCalendarMonth(jsMonth: number, year: number) {
  const daysInMonth = getDaysInMonth(jsMonth, year)
  const monthData = []

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, jsMonth, day)
    const weekDay = date.getDay()
    monthData.push({
      day,
      weekDay,
      month: jsMonth,
      year,
    })
  }

  return monthData
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

export function getUniqueMonths(dates: Date[]) {
  return new Set(
    dates.map(date => {
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      return `${year}-${month.toString()}`
    }),
  )
}

export function getUniqueCalendarPaths(dates: Date[], userId: string) {
  const uniqueMonths = getUniqueMonths(dates)

  return Array.from(uniqueMonths).map(yearMonth => {
    const [year, month] = yearMonth.split('-')
    return `/calendar/${userId}/${year}/${month}`
  })
}

export function getUniqueUsersPaths(dates: Date[]) {
  const uniqueMonths = getUniqueMonths(dates)

  return Array.from(uniqueMonths).map(yearMonth => {
    const [year, month] = yearMonth.split('-')
    return `/users/${year}/${month}`
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

export function shouldScrollToThisDay(thisDay: Day, scrollToThisDay: Day) {
  const {day, month, year} = thisDay

  return (
    scrollToThisDay?.month === month &&
    scrollToThisDay.year === year &&
    scrollToThisDay.day === day
  )
}
