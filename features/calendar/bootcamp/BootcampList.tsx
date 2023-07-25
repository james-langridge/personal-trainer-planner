import React from 'react'

import {Bootcamp} from '@/@types/apiResponseTypes'
import {BootcampItem} from '@/features/calendar/bootcamp'

export function BootcampList({bootcamps}: {bootcamps: Bootcamp[]}) {
  return (
    <>
      {bootcamps.map(bootcamp => {
        return (
          <div key={bootcamp.id}>
            {bootcamp && <BootcampItem bootcamp={bootcamp} />}
          </div>
        )
      })}
    </>
  )
}
