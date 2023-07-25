import {WORKOUT_STATUS} from '@prisma/client'
import React from 'react'

export function Checkbox({
  onChange,
  status,
}: {
  onChange: () => void
  status: WORKOUT_STATUS
}) {
  return (
    <input
      type="checkbox"
      checked={status === WORKOUT_STATUS.COMPLETED}
      className="h-7 w-7 rounded"
      onChange={onChange}
      onClick={e => e.stopPropagation()}
    />
  )
}
