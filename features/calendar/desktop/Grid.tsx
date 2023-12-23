import clsx from 'clsx'
import React from 'react'

import {
  Appointment,
  Bootcamp,
  UserWithWorkouts,
  Workout,
} from '@/@types/apiResponseTypes'
import {Day} from '@/@types/types'
import {AppointmentItem} from '@/features/calendar/appointment'
import {BootcampItem} from '@/features/calendar/bootcamp'
import {WorkoutItem} from '@/features/calendar/workout'
import {getEventsToday} from '@/lib/calendar'

import {CalendarDay, EmptyDays} from '.'

export function Grid({
  monthData,
  user,
  isAdmin = false,
}: {
  monthData: Day[]
  user: UserWithWorkouts
  isAdmin?: boolean
}) {
  const bootcamps = user.bootcamps
  const workouts = user.workouts
  console.log({workouts})
  const appointments = user.appointments
  // const [workouts, appointments] = usePollForUserUpdates()
  const firstDayOfMonth = monthData[0].weekDay
  const emptyDaysLength = firstDayOfMonth > 0 ? firstDayOfMonth - 1 : 6
  const emptyDays = Array(emptyDaysLength).fill(null)
  const calendarSquares = firstDayOfMonth + monthData.length

  // console.log({workouts})
  // console.log(user.name)

  return (
    <div
      className={clsx(
        {
          'grid-rows-calendar-6': calendarSquares > 35,
          'grid-rows-calendar-5': calendarSquares <= 35,
        },
        'grid h-full w-full grid-cols-calendar ring-offset-1',
      )}
    >
      <EmptyDays emptyDays={emptyDays} />
      {monthData.map((day, index) => {
        const appointmentsToday: Appointment[] | null = appointments
          ? getEventsToday(day, appointments)
          : null
        const bootcampsToday: Bootcamp[] | null = bootcamps
          ? getEventsToday(day, bootcamps)
          : null
        const workoutsToday: Workout[] | null = workouts
          ? getEventsToday(day, workouts)
          : null
        const isFirstWeek = index + emptyDaysLength < 7

        return (
          <CalendarDay
            day={day}
            isFirstWeek={isFirstWeek}
            key={index}
            isAdmin={isAdmin}
            user={user}
          >
            {appointmentsToday &&
              appointmentsToday.map(appointment => {
                return (
                  <div key={appointment.id}>
                    {appointment && (
                      <AppointmentItem
                        appointment={appointment}
                        isAdmin={isAdmin}
                      />
                    )}
                  </div>
                )
              })}
            {bootcampsToday &&
              bootcampsToday.map(bootcamp => {
                return (
                  <div key={bootcamp.id}>
                    {bootcamp && (
                      <BootcampItem bootcamp={bootcamp} isAdmin={isAdmin} />
                    )}
                  </div>
                )
              })}
            {workoutsToday &&
              workoutsToday.map(workout => {
                return (
                  <div key={workout.id}>
                    {workout && (
                      <WorkoutItem workout={workout} isAdmin={isAdmin} />
                    )}
                  </div>
                )
              })}
          </CalendarDay>
        )
      })}
    </div>
  )
}
