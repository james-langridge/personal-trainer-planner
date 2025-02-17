import React from 'react'
import {Day} from '@/@types/types'
import {Bootcamp} from '@/lib/calendar'
import {BootcampItem} from '@/features/calendar/bootcamp'

export function BootcampsToday({
  day,
  userId,
  allBootcamps,
  userBootcamps,
}: {
  day: Day
  userId: string
  allBootcamps: Bootcamp[] | null
  userBootcamps: {id: string}[] | undefined
}) {
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
