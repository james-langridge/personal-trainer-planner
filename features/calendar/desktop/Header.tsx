import {NextMonthBtn} from '@/components/NextMonthBtn'
import {PrevMonthBtn} from '@/components/PrevMonthBtn'
import {monthNames} from '@/lib/constants'

import {SelectUserId} from '@/features/calendar/desktop/CalendarDesktop'
import {DateFilter, getPrismaDateFilter} from '@/lib/calendar'
import ClientSelect from '@/features/calendar/desktop/ClientSelect'

export function Header({
  dateFilter,
  isAdmin,
  onSelect,
  onChange,
}: {
  dateFilter: DateFilter
  isAdmin: boolean
  onSelect?: SelectUserId
  onChange: (dateFilter: DateFilter) => void
}) {
  return (
    <div className="flex w-full flex-col">
      {isAdmin && onSelect && <ClientSelect onSelect={onSelect} />}
      <DateChangeButtons dateFilter={dateFilter} onChange={onChange} />
    </div>
  )
}

export function DateChangeButtons({
  dateFilter,
  onChange,
}: {
  dateFilter: DateFilter
  onChange: (dateFilter: DateFilter) => void
}) {
  const jsMonth = dateFilter.gte.getMonth()
  const year = dateFilter.gte.getFullYear()
  const monthName = monthNames[jsMonth]

  function decrementMonth() {
    if (jsMonth === 0) {
      const newDateFilter = getPrismaDateFilter(year - 1, 11)
      onChange(newDateFilter)
    } else {
      const newDateFilter = getPrismaDateFilter(year, jsMonth - 1)
      onChange(newDateFilter)
    }
  }

  function incrementMonth() {
    if (jsMonth === 11) {
      const newDateFilter = getPrismaDateFilter(year + 1, 0)
      onChange(newDateFilter)
    } else {
      const newDateFilter = getPrismaDateFilter(year, jsMonth + 1)
      onChange(newDateFilter)
    }
  }

  return (
    <div className="flex flex-row items-center py-5 text-2xl">
      <PrevMonthBtn onClick={decrementMonth} />
      <NextMonthBtn onClick={incrementMonth} />
      <p data-testid={'heading'}>
        {monthName} {year}
      </p>
    </div>
  )
}
