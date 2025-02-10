import {CalendarMobile} from '@/features/calendar/mobile/CalendarMobile'
import {Appointment, generateCalendarMonth, Workout} from '@/lib/calendar'
import {db} from '@/lib/db'
import {USER_TYPE} from '@prisma/client'

export default async function CalendarMobileContainer({
  userId,
}: {
  userId: string
}) {
  // TODO only fetch current month's events, and update on infinite scroll
  const user = await getUserEvents(userId)
  if (!user) return null
  const allBootcamps = await getAllBootcamps()
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()
  const monthData = generateCalendarMonth(currentMonth, currentYear)

  return (
    <CalendarMobile
      userId={userId}
      user={user}
      allBootcamps={allBootcamps}
      initialData={monthData}
    />
  )
}

export type UserEvents = {
  workouts: Workout[]
  bootcamps: {id: string}[]
  appointments: Appointment[]
  type: USER_TYPE
}

async function getUserEvents(
  id: string,
  dateFilter?: {gte: Date; lt: Date},
): Promise<UserEvents | null> {
  return db.user.findUnique({
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
}

export type Bootcamp = {
  date: Date
  id: string
  name: string
}

async function getAllBootcamps(dateFilter?: {
  gte: Date
  lt: Date
}): Promise<Bootcamp[]> {
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
