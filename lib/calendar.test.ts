import {Day} from '@/@types/types'
import {
  generateCalendarMonth,
  getEventsToday,
  getLongDate,
  getLongWeekday,
  getMonthName,
  getPrismaDateFilter,
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
      month: now.getMonth(),
      weekDay: 1,
      year: now.getFullYear(),
    }

    expect(isDayToday(day)).toBe(true)
  })

  it('should return false for last year', () => {
    const now = new Date()

    const day: Day = {
      day: now.getDate(),
      month: now.getMonth(),
      weekDay: 1,
      year: now.getFullYear() - 1,
    }
    expect(isDayToday(day)).toBe(false)
  })

  it('should return false for next year', () => {
    const now = new Date()

    const day: Day = {
      day: now.getDate(),
      month: now.getMonth(),
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
      month: now.getMonth(),
      weekDay: 1,
      year: now.getFullYear(),
    }

    expect(isDayTomorrow(day)).toBe(true)
  })

  it('should return false if day is today', () => {
    const now = new Date()

    const day: Day = {
      day: now.getDate(),
      month: now.getMonth(),
      weekDay: 1,
      year: now.getFullYear(),
    }

    expect(isDayTomorrow(day)).toBe(false)
  })
})

describe('generateCalendarMonth', () => {
  it('should generate correct days for a partial month range', () => {
    const dateFilter = {
      gte: new Date('2025-02-15'),
      lt: new Date('2025-03-15'),
    }
    const result = generateCalendarMonth(dateFilter)

    // Feb 15-28 (14 days) + March 1-14 (14 days) = 28 days
    expect(result.length).toBe(28)

    // Check first day (Feb 15)
    expect(result[0]).toEqual({
      day: 15,
      weekDay: 6, // Saturday
      month: 1, // February (0-based)
      year: 2025,
    })

    // Check a middle day (Feb 28)
    expect(result[13]).toEqual({
      day: 28,
      weekDay: 5, // Friday
      month: 1, // February (0-based)
      year: 2025,
    })

    // Check first day of next month (Mar 1)
    expect(result[14]).toEqual({
      day: 1,
      weekDay: 6, // Saturday
      month: 2, // March (0-based)
      year: 2025,
    })

    // Check last day (March 14)
    expect(result[27]).toEqual({
      day: 14,
      weekDay: 5, // Friday
      month: 2, // March (0-based)
      year: 2025,
    })

    // Verify that each day is consecutive
    for (let i = 1; i < result.length; i++) {
      const prevDay = result[i - 1]
      const currDay = result[i]

      // If it's the first of the month, skip this check
      if (currDay.day !== 1) {
        expect(currDay.day).toBe(prevDay.day + 1)
      }

      // Weekday should cycle 0-6
      expect(currDay.weekDay).toBe((prevDay.weekDay + 1) % 7)
    }
  })
})

describe('getPrismaDateFilter', () => {
  it('should throw error for odd offset numbers', () => {
    expect(() => getPrismaDateFilter(2024, 6, 3)).toThrow(
      'Offset must be an even number',
    )
  })

  it('should handle middle of year with offset 2', () => {
    const result = getPrismaDateFilter(2024, 5, 2) // June (0-based)

    expect(result.gte.toISOString()).toEqual(
      new Date(Date.UTC(2024, 4, 1)).toISOString(),
    ) // May 1
    expect(result.lt.toISOString()).toEqual(
      new Date(Date.UTC(2024, 7, 1)).toISOString(),
    ) // Aug 1 (to include full July)
  })

  it('should handle start of year with offset 2', () => {
    const result = getPrismaDateFilter(2024, 0, 2) // January

    expect(result.gte.toISOString()).toEqual(
      new Date(Date.UTC(2023, 11, 1)).toISOString(),
    ) // Dec 1, 2023
    expect(result.lt.toISOString()).toEqual(
      new Date(Date.UTC(2024, 2, 1)).toISOString(),
    ) // Mar 1, 2024
  })

  it('should handle end of year with offset 2', () => {
    const result = getPrismaDateFilter(2024, 11, 2) // December

    expect(result.gte.toISOString()).toEqual(
      new Date(Date.UTC(2024, 10, 1)).toISOString(),
    ) // Nov 1, 2024
    expect(result.lt.toISOString()).toEqual(
      new Date(Date.UTC(2025, 1, 1)).toISOString(),
    ) // Feb 1, 2025
  })

  it('should handle larger even offset (4)', () => {
    const result = getPrismaDateFilter(2024, 6, 4) // July

    expect(result.gte.toISOString()).toEqual(
      new Date(Date.UTC(2024, 4, 1)).toISOString(),
    ) // May 1
    expect(result.lt.toISOString()).toEqual(
      new Date(Date.UTC(2024, 9, 1)).toISOString(),
    ) // Sep 1
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
    expect(getLongWeekday(day)).toBe('Monday')
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
    expect(getMonthName(day)).toBe('Feb')
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
    expect(getWeekday('2024-01-01')).toBe(1)
    expect(getWeekday('2024-01-07')).toBe(0)
  })
})

describe('getRepeatingDates', () => {
  it('should generate correct repeating dates', () => {
    const startDate = '2024-01-01'
    const weekdays = [1, 3, 5]
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
      month: 0,
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
