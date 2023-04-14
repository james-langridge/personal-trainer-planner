import React from 'react'

export function Calendar({children}: {children: React.ReactNode}) {
  return (
    <div className="flex w-full flex-col px-5 sm:items-center ">{children}</div>
  )
}
