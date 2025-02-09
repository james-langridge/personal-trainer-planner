import {useCallback, useState, useEffect} from 'react'
import {useRouter, useSearchParams} from 'next/navigation'
import {Day} from '@/@types/types'
import {generateCalendarMonth} from '@/lib/calendar'

interface UseCalendarDataProps {
  initialData?: Day[]
  onTopVisible: boolean
  onBottomVisible: boolean
}

export function useCalendarData({
  initialData,
  onTopVisible,
  onBottomVisible,
}: UseCalendarDataProps) {
  // Initialize with current date if no initial data
  const now = new Date()
  const today = now.getDate()
  const jsMonth = now.getMonth()
  const currentMonth = jsMonth + 1
  const currentYear = now.getFullYear()

  // Initialize state with either provided data or generate current month
  const [data, setData] = useState<Day[]>(() => {
    if (initialData?.length) {
      return initialData
    }
    const foo = generateCalendarMonth(currentMonth, currentYear)
    return foo
  })

  // Track the date range of our loaded calendar data
  const [dateRange, setDateRange] = useState(() => {
    if (initialData?.length) {
      return {
        startMonth: initialData[0].month,
        startYear: initialData[0].year,
        endMonth: initialData[initialData.length - 1].month,
        endYear: initialData[initialData.length - 1].year,
      }
    }
    return {
      startMonth: currentMonth, // Add 1 here too
      startYear: currentYear,
      endMonth: currentMonth, // And here
      endYear: currentYear,
    }
  })

  // Scroll position tracking
  const [scrollToThisDay, setScrollToThisDay] = useState<Day>({
    day: today,
    weekDay: 0,
    month: jsMonth,
    year: currentYear,
  })

  // Loading state
  const [isLoading, setIsLoading] = useState(false)

  // Router for URL updates
  const router = useRouter()
  const searchParams = useSearchParams()

  // Load next month data
  const loadNextMonth = useCallback(async () => {
    if (isLoading) return
    setIsLoading(true)

    try {
      let newMonth: number
      let newYear: number

      if (dateRange.endMonth === 12) {
        newMonth = 1
        newYear = dateRange.endYear + 1
      } else {
        newMonth = dateRange.endMonth + 1
        newYear = dateRange.endYear
      }

      // Generate new month's data
      const newMonthData = generateCalendarMonth(newMonth, newYear)

      // Update URL to reflect new date range
      const params = new URLSearchParams(searchParams)
      params.set('endMonth', newMonth.toString())
      params.set('endYear', newYear.toString())
      router.push(`?${params.toString()}`, {scroll: false})

      // Update state
      setData(prevData => [...prevData, ...newMonthData])
      setDateRange(prev => ({
        ...prev,
        endMonth: newMonth,
        endYear: newYear,
      }))
    } catch (error) {
      console.error('Error loading next month:', error)
    } finally {
      setIsLoading(false)
    }
  }, [dateRange, isLoading, router, searchParams])

  // Load previous month data with the delay handling from your original implementation
  const loadPreviousMonth = useCallback(async () => {
    if (isLoading) return
    setIsLoading(true)

    try {
      let newMonth: number
      let newYear: number

      if (dateRange.startMonth === 1) {
        newMonth = 12
        newYear = dateRange.startYear - 1
      } else {
        newMonth = dateRange.startMonth - 1
        newYear = dateRange.startYear
      }

      // Generate previous month's data
      const prevMonthData = generateCalendarMonth(newMonth, newYear)

      // Set scroll position to last day of new month
      setScrollToThisDay(prevMonthData[prevMonthData.length - 1])

      // Update URL
      const params = new URLSearchParams(searchParams)
      params.set('startMonth', newMonth.toString())
      params.set('startYear', newYear.toString())
      router.push(`?${params.toString()}`, {scroll: false})

      // Update state
      setData(prevData => [...prevMonthData, ...prevData])
      setDateRange(prev => ({
        ...prev,
        startMonth: newMonth,
        startYear: newYear,
      }))

      // Implement the delay from your original code
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.error('Error loading previous month:', error)
    } finally {
      setIsLoading(false)
    }
  }, [dateRange, isLoading, router, searchParams])

  // Handle intersection observer triggers
  useEffect(() => {
    if (onTopVisible && !isLoading) {
      void loadPreviousMonth()
    }
  }, [onTopVisible, loadPreviousMonth, isLoading])

  useEffect(() => {
    if (onBottomVisible && !isLoading) {
      void loadNextMonth()
    }
  }, [onBottomVisible, loadNextMonth, isLoading])

  return {
    data,
    scrollToThisDay,
    loadNextMonth,
    loadPreviousMonth,
    isLoading,
    dateRange,
  }
}
