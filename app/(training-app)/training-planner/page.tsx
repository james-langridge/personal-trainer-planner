'use client'

import {generateCalendarMonth} from '@/lib/calendar'
import CalendarDropdown, {User} from '@/components/CalendarDropdown'
import GridSquare from '@/components/GridSquare'
import {useEffect, useState} from 'react'
import {fetchUser} from '@/lib/api'

export default function TrainingPlanner() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const monthData = generateCalendarMonth(month, year)
  const monthName = now.toLocaleString('default', {month: 'long'})
  const firstDayOfMonth = monthData[0].weekDay
  const emptyDays = Array(firstDayOfMonth).fill(null)
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const [user, setUser] = useState<User>()
  const [sessions, setSessions] = useState()

  useEffect(() => {
    const getUserSessions = async () => {
      if (user) {
        const userSessions = await fetchUser(user.id)

        setSessions(userSessions)
      }
    }

    void getUserSessions()
  }, [user])

  useEffect(() => {
    console.log(`Sessions for ${user}:`, sessions)
  }, [sessions])

  return (
    <>
      <div className="flex justify-between p-5">
        <div className="prose prose-xl">
          <h1>
            {monthName} {year} {user?.firstName} {user?.lastName}
          </h1>
        </div>
        <CalendarDropdown setUser={setUser} />
      </div>
      <div className="m-5 grid grid-cols-7 grid-rows-5 divide-x divide-y">
        {emptyDays &&
          emptyDays.map((day, i) => {
            return (
              <GridSquare key={i} isAdmin={true}>
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
            <GridSquare key={index} day={day} isAdmin={true}>
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
