import clsx from 'clsx'

import {Appointment, Bootcamp, Workout} from '@/@types/apiResponseTypes'
import {Day} from '@/@types/types'
import {AppointmentItem} from '@/features/calendar/appointment'
import {BootcampItem} from '@/features/calendar/bootcamp'
import {WorkoutItem} from '@/features/calendar/workout'
import {getEventsToday} from '@/lib/calendar'

import {CalendarDay, EmptyDays} from '.'
import {db} from '@/lib/db'
import {redirect} from 'next/navigation'
import {auth} from '@/auth'
import {getBootcamps} from '@/app/actions/bootcamps'
import {USER_TYPE} from '@prisma/client'

const getUserWithWorkouts = async (
  dateFilter: {gte: Date; lt: Date},
  id?: string,
): Promise<{
  user: any // fixme
}> => {
  if (!id) {
    return {user: undefined}
  }

  const user = await db.user.findUnique({
    select: {
      appointments: {
        select: {
          date: true,
          description: true,
          fee: true,
          id: true,
          name: true,
          ownerId: true,
          status: true,
          videoUrl: true,
        },
        where: {
          deleted: false,
          date: dateFilter,
        },
      },
      bootcamps: {
        select: {
          date: true,
          description: true,
          id: true,
          name: true,
          videoUrl: true,
        },
        where: {
          deleted: false,
          date: dateFilter,
        },
      },
      fee: true,
      id: true,
      // name: true,
      // role: true,
      type: true,
      workouts: {
        select: {
          date: true,
          description: true,
          id: true,
          name: true,
          ownerId: true,
          status: true,
          videoUrl: true,
        },
        where: {
          deleted: false,
          date: dateFilter,
        },
      },
    },
    where: {
      id: id,
    },
  })

  return {user}
}

export async function Grid({
  monthData,
  year,
  month,
  userId,
}: {
  monthData: Day[]
  year: number
  month: number
  userId: string
}) {
  const session = await auth()
  const isAdmin = session?.user?.role === 'admin'
  let dateFilter: {
    gte: Date
    lt: Date
  }
  const date = `${year}-${month}`
  const thisMonth = new Date(date)
  const nextMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() + 1)

  dateFilter = {
    gte: thisMonth,
    lt: nextMonth,
  }
  const {user} = await getUserWithWorkouts(dateFilter, userId)

  // todo remove redirect?
  if (!user) {
    redirect('/api/auth/signin')
  }

  const allBootcamps = await getBootcamps()
  const {workouts, appointments, bootcamps} = user
  const firstDayOfMonth = monthData[0].weekDay
  const emptyDaysLength = firstDayOfMonth > 0 ? firstDayOfMonth - 1 : 6
  const emptyDays = Array(emptyDaysLength).fill(null)
  const calendarSquares = firstDayOfMonth + monthData.length

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
        const bootcampsToday: Bootcamp[] | null = allBootcamps
          ? getEventsToday(day, allBootcamps)
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
            userId={userId}
          >
            {appointmentsToday &&
              appointmentsToday.map(appointment => {
                return (
                  <div key={appointment.id}>
                    {appointment && (
                      <AppointmentItem
                        appointment={appointment}
                        day={day}
                        userId={userId}
                      />
                    )}
                  </div>
                )
              })}
            {user.type === USER_TYPE.BOOTCAMP &&
              bootcampsToday &&
              bootcampsToday.map(bootcamp => {
                return (
                  <div key={bootcamp.id}>
                    {bootcamp && (
                      <BootcampItem
                        userBootcamps={bootcamps}
                        bootcamp={bootcamp}
                        day={day}
                        userId={userId}
                      />
                    )}
                  </div>
                )
              })}
            {workoutsToday &&
              workoutsToday.map(workout => {
                return (
                  <div key={workout.id}>
                    {workout && (
                      <WorkoutItem
                        workout={workout}
                        day={day}
                        userId={userId}
                      />
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
