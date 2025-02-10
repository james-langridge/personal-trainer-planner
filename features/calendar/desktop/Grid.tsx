import clsx from 'clsx'

import {AppointmentItem} from '@/features/calendar/appointment'
import {BootcampItem} from '@/features/calendar/bootcamp'
import {WorkoutItem} from '@/features/calendar/workout'
import {generateCalendarMonth, getEventsToday} from '@/lib/calendar'

import {CalendarDay, EmptyDays} from '.'
import {auth} from '@/auth'
import {USER_TYPE} from '@prisma/client'
import {db} from '@/lib/db'
import {Workout, Bootcamp, Appointment} from '@/lib/calendar'

export async function Grid({
  year,
  month,
  userId,
}: {
  year: number
  month: number
  userId: string
}) {
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
  const {user} = await getUserEvents(userId, dateFilter)

  if (!user) return null

  const session = await auth()
  const isAdmin = session?.user?.role === 'admin'
  const {workouts, appointments, bootcamps} = user
  const allBootcamps = await getAllBootcamps(dateFilter)
  const monthData = generateCalendarMonth(month, year)
  const firstDayOfMonth = monthData[0].weekDay
  const emptyDaysLength = firstDayOfMonth > 0 ? firstDayOfMonth - 1 : 6
  const emptyDays = Array(emptyDaysLength).fill(null)
  const totalSpaces = emptyDaysLength + monthData.length
  const rows = Math.ceil(totalSpaces / 7)

  return (
    <div
      className={clsx(
        {
          'grid-rows-calendar-6': rows === 6,
          'grid-rows-calendar-5': rows === 5,
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
            userFee={user.fee}
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

async function getUserEvents(id: string, dateFilter: {gte: Date; lt: Date}) {
  const user = await db.user.findUnique({
    select: {
      appointments: {
        select: {
          date: true,
          id: true,
          name: true,
          ownerId: true,
          status: true,
        },
        where: {
          deleted: false,
          date: dateFilter,
        },
      },
      bootcamps: {
        select: {
          id: true,
        },
        where: {
          deleted: false,
          date: dateFilter,
        },
      },
      fee: true,
      type: true,
      workouts: {
        select: {
          date: true,
          id: true,
          name: true,
          ownerId: true,
          status: true,
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

async function getAllBootcamps(dateFilter: {gte: Date; lt: Date}) {
  return db.bootcamp.findMany({
    select: {
      date: true,
      id: true,
      name: true,
    },
    where: {
      deleted: false,
      date: dateFilter,
    },
  })
}
