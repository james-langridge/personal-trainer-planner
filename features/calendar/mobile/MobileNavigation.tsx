'use client'

import {ChevronLeft, ChevronRight} from 'lucide-react'
import {DateFilter, getPrismaDateFilter} from '@/lib/calendar'
import {monthNames} from '@/lib/constants'
import {Button} from '@/components/button'

export function MobileNavigation({
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
      const newDateFilter = getPrismaDateFilter(year - 1, 11, 6)
      onChange(newDateFilter)
    } else {
      const newDateFilter = getPrismaDateFilter(year, jsMonth - 1, 6)
      onChange(newDateFilter)
    }
  }

  function incrementMonth() {
    if (jsMonth === 11) {
      const newDateFilter = getPrismaDateFilter(year + 1, 0, 6)
      onChange(newDateFilter)
    } else {
      const newDateFilter = getPrismaDateFilter(year, jsMonth + 1, 6)
      onChange(newDateFilter)
    }
  }

  return (
    <div className="flex items-center justify-between py-3 border-b">
      <h2 className="text-lg font-semibold">
        {monthName} {year}
      </h2>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={decrementMonth}
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={incrementMonth}
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}