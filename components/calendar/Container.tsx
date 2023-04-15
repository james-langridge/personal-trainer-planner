import React from 'react'

export function Container({children}: {children: React.ReactNode}) {
  return <div className="flex h-[90vh]">{children}</div>
}
