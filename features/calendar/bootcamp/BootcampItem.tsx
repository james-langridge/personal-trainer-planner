import React from 'react'

import {Bootcamp} from '@/@types/apiResponseTypes'

import {Checkbox, Title} from '.'

export function BootcampItem({
  bootcamp,
  isAdmin,
}: {
  bootcamp: Bootcamp
  isAdmin: boolean
}) {
  return (
    <div className="ml-2 mr-1 flex items-center gap-2 text-lg">
      <Checkbox bootcamp={bootcamp} />
      <Title bootcamp={bootcamp} isAdmin={isAdmin} />
    </div>
  )
}
