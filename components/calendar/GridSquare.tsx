'use client'

import React from 'react'

export default function GridSquare({children}: {children?: React.ReactNode}) {
  return <div className="h-40 w-40 text-center">{children}</div>
}
