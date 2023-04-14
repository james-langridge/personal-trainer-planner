import React from 'react'

export function Sidebar({children}: {children: React.ReactNode}) {
  return (
    <aside className="flex w-72 flex-col overflow-y-auto border-r bg-white px-4 py-8 rtl:border-r-0 rtl:border-l dark:border-gray-700 dark:bg-gray-900">
      {children}
    </aside>
  )
}
