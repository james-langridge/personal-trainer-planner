import React from 'react'

export function Container({children}: {children: React.ReactNode}) {
  return <div className="container mx-auto my-5 px-5">{children}</div>
}
