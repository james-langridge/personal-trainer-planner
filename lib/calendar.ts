import {Session} from '@prisma/client'
import {SerialisedSession} from '@/app/(training-app)/training-studio/page'

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate()
}

export function generateCalendarMonth(month: number, year: number) {
  const daysInMonth = getDaysInMonth(month, year)
  const monthData = []

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const weekDay = date.getDay()
    monthData.push({day, weekDay, month, year})
  }

  return monthData
}

function areDatesEqual(calendarDate: Date, sessionDate: Date) {
  const sessionYear = sessionDate.getFullYear()
  const sessionMonth = sessionDate.getMonth()
  const sessionDay = sessionDate.getDate()

  const calendarYear = calendarDate.getFullYear()
  const calendarMonth = calendarDate.getMonth()
  const calendarDay = calendarDate.getDate()

  return (
    sessionYear === calendarYear &&
    sessionMonth === calendarMonth &&
    sessionDay === calendarDay
  )
}

export function getSessionsToday(
  sessions: Session[] | SerialisedSession[],
  calendarDay: {
    day: number
    weekDay: number
    month: number
    year: number
  },
) {
  if (!sessions) {
    return
  }

  const calendarDate = new Date(
    `${calendarDay.year}-${String(calendarDay.month + 1).padStart(
      2,
      '0',
    )}-${String(calendarDay.day).padStart(2, '0')}`,
  )

  const sessionsMap = sessions.map(session => {
    if (session.deleted) {
      return
    }

    const sessionDate = new Date(session.date)

    if (areDatesEqual(calendarDate, sessionDate)) {
      return session
    }
  })

  return sessionsMap.filter(Boolean)
}

export type Day = {
  day: number
  weekDay: number
  month: number
  year: number
}

export function shouldScrollToThisDay(thisDay: Day, scrollToThisDay: Day) {
  const {day, month, year} = thisDay

  return (
    scrollToThisDay?.month === month &&
    scrollToThisDay.year === year &&
    scrollToThisDay.day === day
  )
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

export function getLongWeekday(dayData: Day) {
  const {day, month, year} = dayData

  return new Date(year, month, day).toLocaleString('default', {
    weekday: 'long',
  })
}

export function getShortWeekday(dayData: Day) {
  const {day, month, year} = dayData

  return new Date(year, month, day).toLocaleString('default', {
    weekday: 'short',
  })
}

export function getMonthName(dayData: Day) {
  const {day, month, year} = dayData

  return new Date(year, month, day).toLocaleString('default', {
    month: 'short',
  })
}

export function serialiseDates(sessions: Session[]) {
  return sessions.map(session => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {createdAt, updatedAt, ...rest} = session

    return {...rest, date: session.date.toDateString()}
  })
}
