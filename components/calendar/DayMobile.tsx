import Link from 'next/link'
import {Session} from '@prisma/client'
import {SessionSerialisedDate} from '@/app/(training-app)/training-studio/page'
import {Day} from '@/components/calendar/CalendarMobile'

const now = new Date()
const today = now.getDate()
const thisMonth = now.getMonth()
const thisYear = now.getFullYear()

export default function DayMobile({
  dayData,
  sessionsToday,
}: {
  dayData: Day
  sessionsToday:
    | (Session | SessionSerialisedDate | undefined)[]
    | null
    | undefined
}) {
  const isToday = isDayToday(dayData)
  const isTomorrow = isDayTomorrow(dayData)
  const weekday = getWeekday(dayData)
  const monthName = getMonthName(dayData)

  return (
    <div className={isToday ? 'scroll-mt-16' : ''}>
      <hr className="my-6 h-px border-none bg-gray-900 dark:bg-gray-700" />
      <div className="mb-2 flex justify-between text-sm text-gray-500">
        <div className="font-bold">{weekday}</div>
        <div>
          {isToday
            ? 'Today'
            : isTomorrow
            ? 'Tomorrow'
            : dayData.day + ' ' + monthName}
        </div>
      </div>
      {sessionsToday &&
        sessionsToday.map((session, i) => {
          return (
            <div key={session?.id}>
              <Link href={`/session/${session?.id}`} className="my-1 block">
                {session?.name}
              </Link>
              {i < sessionsToday.length - 1 && (
                <hr className="my-4 h-px border-none bg-gray-200 dark:bg-gray-700" />
              )}
            </div>
          )
        })}
    </div>
  )
}

export function isDayToday(dayData: Day) {
  const {day, month, year} = dayData

  return day === today && month === thisMonth && year === thisYear
}

function isDayTomorrow(dayData: Day) {
  const {day, month, year} = dayData

  return day === today + 1 && month === thisMonth && year === thisYear
}

function getWeekday(dayData: Day) {
  const {day, month, year} = dayData

  return new Date(year, month, day).toLocaleString('default', {
    weekday: 'long',
  })
}

function getMonthName(dayData: Day) {
  const {day, month, year} = dayData

  return new Date(year, month, day).toLocaleString('default', {
    month: 'short',
  })
}
