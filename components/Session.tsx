'use client'

import React from 'react'

export default function Session() {
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
      {/*Session name*/}
    </div>
  )
}
