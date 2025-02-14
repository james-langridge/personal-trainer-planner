'use client'

import React, {createContext} from 'react'

export const DateContext = createContext('')

export default function DateProvider({
  children,
  date,
}: {
  children: React.ReactNode
  date: string
}) {
  return <DateContext.Provider value={date}>{children}</DateContext.Provider>
}
