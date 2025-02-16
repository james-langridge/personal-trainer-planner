import React from 'react'
import {Day} from '@/@types/types'
import {Bootcamp, getEventsToday} from '@/lib/calendar'
import {USER_TYPE} from '@prisma/client'
import {BootcampItem} from '@/features/calendar/bootcamp'
import {useUserEvents} from '@/app/api/hooks/users'
import {useAllBootcamps} from '@/app/api/hooks/bootcamps'

export function BootcampsToday({
  day,
  userId,
  // dateFilter,
  allBootcamps,
  userBootcamps,
}: {
  day: Day
  userId: string
  // dateFilter: {gte: Date; lt: Date}
  allBootcamps: Bootcamp[] | null
  userBootcamps: {id: string}[] | undefined
}) {
  // const {data: allBootcamps, isLoading: isLoadingAllBootcamps} =
  //   useAllBootcamps({
  //     dateFilter,
  //   })
  // const {data, isLoading: isLoadingUserBootcamps} = useUserEvents({
  //   id: userId,
  //   dateFilter,
  // })
  //
  // if (isLoadingAllBootcamps || isLoadingUserBootcamps || !allBootcamps || !data)
  //   return null

  // if (data.type !== USER_TYPE.BOOTCAMP) return null

  // const bootcampsToday: Bootcamp[] | null = allBootcamps
  //   ? getEventsToday(day, allBootcamps)
  //   : null

  if (!allBootcamps || !userBootcamps) return null

  return (
    <div>
      {allBootcamps.map(bootcamp => {
        return (
          <div key={bootcamp.id}>
            {bootcamp && (
              <BootcampItem
                userBootcamps={userBootcamps}
                bootcamp={bootcamp}
                day={day}
                userId={userId}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
