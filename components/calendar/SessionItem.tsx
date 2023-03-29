'use client'

import React from 'react'
import {Session} from '@prisma/client'

export default function SessionItem({session}: {session?: Session}) {
  function clickHandler(event: React.SyntheticEvent) {
    event.stopPropagation()

    alert('Opening session...')
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={clickHandler}
      onClick={clickHandler}
      className="w-full rounded bg-emerald-400 font-bold text-white"
    >
      {session?.name}
    </div>
  )
}
