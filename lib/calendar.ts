import {UserWithWorkouts} from '@/@types/apiResponseTypes'
import {Day} from '@/@types/types'

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

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate()
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

export function getWorkoutsToday(
  calendarDay: {
    day: number
    weekDay: number
    month: number
    year: number
  },
  workouts: UserWithWorkouts['workouts'] = [],
): UserWithWorkouts['workouts'] {
  const calendarDate = new Date(
    `${calendarDay.year}-${padZero(calendarDay.month + 1)}-${padZero(
      calendarDay.day,
    )}`,
  )

  const workoutsMap = workouts.map(workout => {
    const workoutDate = new Date(workout.date)

    if (areDatesEqual(calendarDate, workoutDate)) {
      return workout
    }
  })

  return workoutsMap.filter(Boolean) as UserWithWorkouts['workouts']
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
