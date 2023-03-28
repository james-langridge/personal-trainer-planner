import GridSquare from '@/components/GridSquare'
import {generateCalendarMonth} from '@/lib/calendar'

export default function Calendar({
  isAdmin = false,
  sessions,
  user,
}: {
  isAdmin?: boolean
  sessions: any
  user: any
}) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const monthData = generateCalendarMonth(month, year)
  const monthName = now.toLocaleString('default', {month: 'long'})
  const firstDayOfMonth = monthData[0].weekDay
  const emptyDays = Array(firstDayOfMonth).fill(null)
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  console.log(sessions)

  return (
    <>
      <div className="flex justify-between p-5">
        <div className="prose prose-xl">
          {!isAdmin && <h2>Welcome back, {user}</h2>}
          <h3>
            {monthName} {year}
          </h3>
        </div>
      </div>
      <div className="m-5 grid grid-cols-7 grid-rows-5 divide-x divide-y">
        {emptyDays &&
          emptyDays.map((day, i) => {
            return (
              <GridSquare key={i} isAdmin={isAdmin}>
                <div>{dayNames[i]}</div>
              </GridSquare>
            )
          })}

        {monthData.map((day, index) => {
          const weekday = new Date(year, month, day.day).toLocaleString(
            'default',
            {
              weekday: 'short',
            },
          )

          const isToday =
            day.day === now.getDate() &&
            day.month === month &&
            day.year === year

          return (
            <GridSquare key={index} day={day} isAdmin={isAdmin}>
              {index + firstDayOfMonth < 7 && <div>{weekday}</div>}
              <div
                className={
                  'mx-auto w-8 rounded-full p-1' +
                  (isToday ? ` bg-blue-900 text-white` : '')
                }
              >
                {day.day}
              </div>
            </GridSquare>
          )
        })}
      </div>
    </>
  )
}
