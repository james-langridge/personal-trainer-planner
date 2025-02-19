import {useEffect} from 'react'
import {
  DateFilter,
  getNextMonthFilter,
  getPreviousMonthFilter,
} from '@/lib/calendar'
import {getUserEvents} from '@/app/actions/users'
import {getAllBootcamps} from '@/app/actions/bootcamps'
import {useQueryClient} from '@tanstack/react-query'

export function usePrefetchAdjacentMonths({
  userId,
  dateFilter,
}: {
  userId: string
  dateFilter: DateFilter
}) {
  const queryClient = useQueryClient()

  useEffect(() => {
    const nextMonth = getNextMonthFilter(dateFilter)
    const previousMonth = getPreviousMonthFilter(dateFilter)

    queryClient.prefetchQuery({
      queryKey: [
        'user-events',
        userId,
        nextMonth.gte.toISOString(),
        nextMonth.lt.toISOString(),
      ],
      queryFn: () => getUserEvents({id: userId, dateFilter: nextMonth}),
    })

    queryClient.prefetchQuery({
      queryKey: [
        'user-events',
        userId,
        previousMonth.gte.toISOString(),
        previousMonth.lt.toISOString(),
      ],
      queryFn: () => getUserEvents({id: userId, dateFilter: previousMonth}),
    })

    queryClient.prefetchQuery({
      queryKey: [
        'bootcamps',
        nextMonth.gte.toISOString(),
        nextMonth.lt.toISOString(),
      ],
      queryFn: () => getAllBootcamps({dateFilter: nextMonth}),
    })

    queryClient.prefetchQuery({
      queryKey: [
        'bootcamps',
        previousMonth.gte.toISOString(),
        previousMonth.lt.toISOString(),
      ],
      queryFn: () => getAllBootcamps({dateFilter: previousMonth}),
    })
  }, [dateFilter, userId])
}
