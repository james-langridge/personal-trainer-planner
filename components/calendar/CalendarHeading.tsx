import React from 'react'

import {CalendarDropdown, UserName} from '@/components/calendar'
import {monthNames} from '@/lib/calendar'
import {useAppSelector} from '@/redux/hooks'

export function CalendarHeading({
  year,
  month,
  setYear,
  setMonth,
}: {
  year: number
  month: number
  setYear: React.Dispatch<React.SetStateAction<number>>
  setMonth: React.Dispatch<React.SetStateAction<number>>
}) {
  const isAdmin = useAppSelector(state => state.auth.isAdmin)
  const monthName = monthNames[month]

  function decrementMonth() {
    if (month === 0) {
      setMonth(() => 11)
      setYear(year => year - 1)
    } else {
      setMonth(month => month - 1)
    }
  }

  function incrementMonth() {
    if (month === 11) {
      setMonth(() => 0)
      setYear(year => year + 1)
    } else {
      setMonth(month => month + 1)
    }
  }

  return (
    <div className="flex w-full flex-row justify-between p-5">
      {isAdmin ? <CalendarDropdown /> : <div />}

      <div className="flex flex-row items-center text-2xl">
        <button
          onClick={decrementMonth}
          className="mx-1 flex transform items-center justify-center rounded-md bg-white px-4 py-2 text-gray-700 transition-colors duration-300 hover:bg-blue-500 hover:text-white rtl:-scale-x-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-blue-500 dark:hover:text-gray-200"
          data-testid={'prevMonthBtn'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <p data-testid={'heading'} className="mx-5">
          {monthName} {year}
        </p>

        <button
          onClick={incrementMonth}
          className="mx-1 flex transform items-center justify-center rounded-md bg-white px-4 py-2 text-gray-700 transition-colors duration-300 hover:bg-blue-500 hover:text-white rtl:-scale-x-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-blue-500 dark:hover:text-gray-200"
          data-testid={'nextMonthBtn'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isAdmin ? <UserName /> : <div />}
    </div>
  )
}
