import {Day} from '@/@types/types'
import {
  generateCalendarMonth,
  getEventsToday,
  getLongDate,
  getLongWeekday,
  getMonthName,
  getRepeatingDates,
  getShortWeekday,
  getWeekday,
  isDayToday,
  isDayTomorrow,
  padZero,
  shouldScrollToThisDay,
} from '@/lib/calendar'

describe('isDayToday', () => {
  it('should return true is day is today', () => {
    const now = new Date()

    const day: Day = {
      day: now.getDate(),
      month: now.getMonth() + 1,
      weekDay: 1,
      year: now.getFullYear(),
    }

    expect(isDayToday(day)).toBe(true)
  })

  it('should return false for last year', () => {
    const now = new Date()

    const day: Day = {
      day: now.getDate(),
      month: now.getMonth() + 1,
      weekDay: 1,
      year: now.getFullYear() - 1,
    }
    expect(isDayToday(day)).toBe(false)
  })

  it('should return false for next year', () => {
    const now = new Date()

    const day: Day = {
      day: now.getDate(),
      month: now.getMonth() + 1,
      weekDay: 1,
      year: now.getFullYear() + 1,
    }
    expect(isDayToday(day)).toBe(false)
  })
})

describe('isDayTomorrow', () => {
  it('should return true if day is tomorrow', () => {
    const now = new Date()

    const day: Day = {
      day: now.getDate() + 1,
      month: now.getMonth() + 1,
      weekDay: 1,
      year: now.getFullYear(),
    }

    expect(isDayTomorrow(day)).toBe(true)
  })

  it('should return false if day is today', () => {
    const now = new Date()

    const day: Day = {
      day: now.getDate(),
      month: now.getMonth() + 1,
      weekDay: 1,
      year: now.getFullYear(),
    }

    expect(isDayTomorrow(day)).toBe(false)
  })
})

describe('generateCalendarMonth', () => {
  it('should generate correct days for January 2025', () => {
    const month = 1 // January (NOT 0-based)
    const year = 2025
    const result = generateCalendarMonth(month, year)

    expect(result.length).toBe(31)
    expect(result[0]).toEqual({
      day: 1,
      weekDay: 3, // Wednesday
      month: 1,
      year: 2025,
    })
  })

  it('should generate correct days for April 2025', () => {
    const month = 4 // April (0-based)
    const year = 2025
    const result = generateCalendarMonth(month, year)

    expect(result.length).toBe(30)
    expect(result[0]).toEqual({
      day: 1,
      weekDay: 2, // Tuesday
      month: 4,
      year: 2025,
    })
  })
})

describe('getLongDate', () => {
  it('should format date correctly', () => {
    const date = new Date(2024, 0, 1) // Jan 1, 2024
    expect(getLongDate(date)).toMatch(/Monday, January 1, 2024/)
  })
})

describe('getLongWeekday', () => {
  it('should return correct long weekday name', () => {
    const day: Day = {
      day: 1,
      month: 0,
      weekDay: 1,
      year: 2024,
    }
    expect(getLongWeekday(day)).toBe('Friday')
  })
})

describe('getMonthName', () => {
  it('should return correct short month name', () => {
    const day: Day = {
      day: 1,
      month: 1,
      weekDay: 1,
      year: 2024,
    }
    expect(getMonthName(day)).toBe('Jan')
  })
})

describe('getShortWeekday', () => {
  it('should return correct short weekday name', () => {
    const day: Day = {
      day: 1,
      month: 0,
      weekDay: 1,
      year: 2024,
    }
    expect(getShortWeekday(day)).toBe('Mon')
  })
})

describe('getWeekday', () => {
  it('should return correct weekday number', () => {
    expect(getWeekday('2024-01-01')).toBe(1) // Monday
    expect(getWeekday('2024-01-07')).toBe(0) // Sunday
  })
})

describe('getRepeatingDates', () => {
  it('should generate correct repeating dates', () => {
    const startDate = '2024-01-01' // Monday
    const weekdays = [1, 3, 5] // Mon, Wed, Fri
    const weeks = 2

    const result = getRepeatingDates(startDate, weekdays, weeks)

    expect(result).toHaveLength(9) // 3 days * 3 weeks (including start week)

    // First week
    expect(result[0].toISOString()).toMatch(/2024-01-01/) // Mon
    expect(result[1].toISOString()).toMatch(/2024-01-03/) // Wed
    expect(result[2].toISOString()).toMatch(/2024-01-05/) // Fri

    // Second week
    expect(result[3].toISOString()).toMatch(/2024-01-08/) // Mon
    expect(result[4].toISOString()).toMatch(/2024-01-10/) // Wed
    expect(result[5].toISOString()).toMatch(/2024-01-12/) // Fri
  })
})

describe('getEventsToday', () => {
  it('should return events for the given day', () => {
    const calendarDay = {
      day: 1,
      weekDay: 1,
      month: 1,
      year: 2024,
    }

    const events = [
      {date: '2024-01-01', id: 1},
      {date: '2024-01-02', id: 2},
      {date: '2024-01-01', id: 3},
    ]

    const result = getEventsToday(calendarDay, events)
    expect(result).toHaveLength(2)
    expect(result.map(e => e.id)).toEqual([1, 3])
  })

  it('should return empty array when no events match', () => {
    const calendarDay = {
      day: 1,
      weekDay: 1,
      month: 0,
      year: 2024,
    }

    const events = [
      {date: '2024-01-02', id: 1},
      {date: '2024-01-03', id: 2},
    ]

    const result = getEventsToday(calendarDay, events)
    expect(result).toHaveLength(0)
  })
})

describe('shouldScrollToThisDay', () => {
  it('should return true when days match', () => {
    const thisDay: Day = {
      day: 1,
      month: 0,
      weekDay: 1,
      year: 2024,
    }

    const scrollToDay: Day = {
      day: 1,
      month: 0,
      weekDay: 1,
      year: 2024,
    }

    expect(shouldScrollToThisDay(thisDay, scrollToDay)).toBe(true)
  })

  it('should return false when days do not match', () => {
    const thisDay: Day = {
      day: 1,
      month: 0,
      weekDay: 1,
      year: 2024,
    }

    const scrollToDay: Day = {
      day: 2,
      month: 0,
      weekDay: 2,
      year: 2024,
    }

    expect(shouldScrollToThisDay(thisDay, scrollToDay)).toBe(false)
  })
})

describe('padZero', () => {
  it('should pad single digit with zero', () => {
    expect(padZero(5)).toBe('05')
  })

  it('should not pad double digits', () => {
    expect(padZero(15)).toBe('15')
  })

  it('should handle string input', () => {
    expect(padZero('5')).toBe('05')
    expect(padZero('15')).toBe('15')
  })
})
