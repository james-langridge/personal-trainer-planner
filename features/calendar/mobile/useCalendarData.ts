import {useCallback, useEffect, useState} from 'react'
import {useRouter, useSearchParams} from 'next/navigation'
import {Day} from '@/@types/types'
import {generateCalendarMonth} from '@/lib/calendar'

interface UseCalendarDataProps {
  initialMonthData?: Day[]
  onTopVisible: boolean
  onBottomVisible: boolean
}

export function useCalendarData({
  initialMonthData,
  onTopVisible,
  onBottomVisible,
}: UseCalendarDataProps) {
  const now = new Date()
  const today = now.getDate()
  const jsMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const [data, setData] = useState<Day[]>(() => {
    if (initialMonthData?.length) {
      return initialMonthData
    }
    return generateCalendarMonth(jsMonth, currentYear)
  })

  const [dateRange, setDateRange] = useState(() => {
    if (initialMonthData?.length) {
      return {
        startMonth: initialMonthData[0].month,
        startYear: initialMonthData[0].year,
        endMonth: initialMonthData[initialMonthData.length - 1].month,
        endYear: initialMonthData[initialMonthData.length - 1].year,
      }
    }
    return {
      startMonth: jsMonth,
      startYear: currentYear,
      endMonth: jsMonth,
      endYear: currentYear,
    }
  })

  const [scrollToThisDay, setScrollToThisDay] = useState<Day>({
    day: today,
    weekDay: 0,
    month: jsMonth,
    year: currentYear,
  })

  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

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

      const newMonthData = generateCalendarMonth(newMonth, newYear)

      const params = new URLSearchParams(searchParams)
      params.set('endMonth', newMonth.toString())
      params.set('endYear', newYear.toString())
      router.push(`?${params.toString()}`, {scroll: false})

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

      const prevMonthData = generateCalendarMonth(newMonth, newYear)

      setScrollToThisDay(prevMonthData[prevMonthData.length - 1])

      const params = new URLSearchParams(searchParams)
      params.set('startMonth', newMonth.toString())
      params.set('startYear', newYear.toString())
      router.push(`?${params.toString()}`, {scroll: false})

      setData(prevData => [...prevMonthData, ...prevData])
      setDateRange(prev => ({
        ...prev,
        startMonth: newMonth,
        startYear: newYear,
      }))

      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.error('Error loading previous month:', error)
    } finally {
      setIsLoading(false)
    }
  }, [dateRange, isLoading, router, searchParams])

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
