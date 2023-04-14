import {Session} from '@prisma/client'
import {SessionSerialisedDate} from '@/app/(training-app)/training-studio/page'
import {
  Day,
  getMonthName,
  getLongWeekday,
  isDayToday,
  isDayTomorrow,
} from '@/lib/calendar'
import {SessionItemMobile} from '@/components/calendar/SessionItemMobile'

export function DayMobile({
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
  const weekday = getLongWeekday(dayData)
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
              {session && <SessionItemMobile session={session} />}
              {i < sessionsToday.length - 1 && (
                <hr className="my-4 h-px border-none bg-gray-200 dark:bg-gray-700" />
              )}
            </div>
          )
        })}
    </div>
  )
}
