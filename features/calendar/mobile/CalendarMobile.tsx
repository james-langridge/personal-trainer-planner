import React from 'react'

import {UserWithWorkouts} from '@/@types/apiResponseTypes'
import {DateChangeButtons} from '@/components/DateChangeButtons'
import {AppointmentItemMobile} from '@/features/calendar/appointment'
import {BootcampItemMobile} from '@/features/calendar/bootcamp'
import {WorkoutItemMobile} from '@/features/calendar/workout'
import {generateCalendarMonth, getEventsToday} from '@/lib/calendar'

import {Day} from '.'

export function CalendarMobile({
  user,
  date,
}: {
  user: UserWithWorkouts
  date: string
}) {
  const dates = date.split('-')
  const year = dates[0]
  const month = dates[1]
  const workouts = user.workouts
  const appointments = user.appointments
  const bootcamps = user.bootcamps
  const monthData = generateCalendarMonth(month, year)

  return (
    <div className="py-5">
      {monthData.map(day => {
        const appointmentsToday = appointments
          ? getEventsToday(day, appointments)
          : null
        const bootcampsToday = bootcamps ? getEventsToday(day, bootcamps) : null
        const workoutsToday = workouts ? getEventsToday(day, workouts) : null

        return (
          <div key={`${day.day}-${day.month}-${day.year}`}>
            <Day dayData={day}>
              {appointmentsToday &&
                appointmentsToday.map((appointment, i) => {
                  return (
                    <div key={appointment?.id}>
                      {appointment && (
                        <AppointmentItemMobile appointment={appointment} />
                      )}
                      {i < appointmentsToday.length - 1 && (
                        <hr className="my-4 h-px border-none bg-gray-200 dark:bg-gray-700" />
                      )}
                    </div>
                  )
                })}

              {bootcampsToday &&
                bootcampsToday.map((bootcamp, i) => {
                  return (
                    <div key={bootcamp?.id}>
                      {bootcamp && <BootcampItemMobile bootcamp={bootcamp} />}
                      {i < bootcampsToday.length - 1 && (
                        <hr className="my-4 h-px border-none bg-gray-200 dark:bg-gray-700" />
                      )}
                    </div>
                  )
                })}

              {workoutsToday &&
                workoutsToday.map((workout, i) => {
                  return (
                    <div key={workout?.id}>
                      {workout && <WorkoutItemMobile workout={workout} />}
                      {i < workoutsToday.length - 1 && (
                        <hr className="my-4 h-px border-none bg-gray-200 dark:bg-gray-700" />
                      )}
                    </div>
                  )
                })}
            </Day>
          </div>
        )
      })}
      <footer className="sticky bottom-0 left-0 flex w-full justify-center p-4">
        <DateChangeButtons year={year} month={month} route="calendar/m" />
      </footer>
    </div>
  )
}
