import clsx from 'clsx'
import React from 'react'

import {CalendarFormState} from '@/@types/types'

export function WeekdayButtonGroup({
  form,
  setForm,
  toggleDay,
}: {
  form: CalendarFormState
  setForm: React.Dispatch<React.SetStateAction<CalendarFormState>>
  toggleDay: (weekday: number) => void
}) {
  return (
    <div className="flex flex-col">
      <div className="mt-4 flex divide-x overflow-hidden rounded-lg border bg-white rtl:flex-row-reverse dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-900">
        <button
          type="button"
          onClick={() => toggleDay(1)}
          className={clsx(
            'px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 dark:text-gray-300 dark:hover:bg-gray-800 sm:text-base',
            {
              'bg-blue-300 hover:bg-blue-100': form.selectedDays.has(1),
              'hover:bg-gray-100': !form.selectedDays.has(1),
            },
          )}
        >
          M
        </button>

        <button
          type="button"
          onClick={() => toggleDay(2)}
          className={clsx(
            'px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 dark:text-gray-300 dark:hover:bg-gray-800 sm:text-base',
            {
              'bg-blue-300 hover:bg-blue-100': form.selectedDays.has(2),
              'hover:bg-gray-100': !form.selectedDays.has(2),
            },
          )}
        >
          T
        </button>

        <button
          type="button"
          onClick={() => toggleDay(3)}
          className={clsx(
            'px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 dark:text-gray-300 dark:hover:bg-gray-800 sm:text-base',
            {
              'bg-blue-300 hover:bg-blue-100': form.selectedDays.has(3),
              'hover:bg-gray-100': !form.selectedDays.has(3),
            },
          )}
        >
          W
        </button>

        <button
          type="button"
          onClick={() => toggleDay(4)}
          className={clsx(
            'px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 dark:text-gray-300 dark:hover:bg-gray-800 sm:text-base',
            {
              'bg-blue-300 hover:bg-blue-100': form.selectedDays.has(4),
              'hover:bg-gray-100': !form.selectedDays.has(4),
            },
          )}
        >
          T
        </button>

        <button
          type="button"
          onClick={() => toggleDay(5)}
          className={clsx(
            'px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 dark:text-gray-300 dark:hover:bg-gray-800 sm:text-base',
            {
              'bg-blue-300 hover:bg-blue-100': form.selectedDays.has(5),
              'hover:bg-gray-100': !form.selectedDays.has(5),
            },
          )}
        >
          F
        </button>

        <button
          type="button"
          onClick={() => toggleDay(6)}
          className={clsx(
            'px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 dark:text-gray-300 dark:hover:bg-gray-800 sm:text-base',
            {
              'bg-blue-300 hover:bg-blue-100': form.selectedDays.has(6),
              'hover:bg-gray-100': !form.selectedDays.has(6),
            },
          )}
        >
          S
        </button>

        <button
          type="button"
          onClick={() => toggleDay(0)}
          className={clsx(
            'px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 dark:text-gray-300 dark:hover:bg-gray-800 sm:text-base',
            {
              'bg-blue-300 hover:bg-blue-100': form.selectedDays.has(0),
              'hover:bg-gray-100': !form.selectedDays.has(0),
            },
          )}
        >
          S
        </button>
      </div>

      <div className="mt-2">
        Repeat for{' '}
        <input
          className="w-10"
          type="number"
          min="0"
          value={form.weeksToRepeat}
          onChange={e =>
            setForm(form => ({
              ...form,
              weeksToRepeat: Number(e.target.value),
            }))
          }
        />{' '}
        {form.weeksToRepeat === 1 ? 'week.' : 'weeks.'}{' '}
        <div className="text-sm">
          {form.weeksToRepeat === 0
            ? "(Don't repeat; this week only.)"
            : form.weeksToRepeat === 1
            ? '(This week and next week.)'
            : `(${form.weeksToRepeat + 1} weeks total starting this week.)`}
        </div>
      </div>
    </div>
  )
}
