import React from 'react'

export default function Container({children}: {children: React.ReactNode}) {
  return <div className="container mx-auto px-5">{children}</div>
}
