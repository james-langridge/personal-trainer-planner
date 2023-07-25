import React from 'react'

export function Checkbox({
  onChange,
  status,
}: {
  onChange: () => void
  status: boolean
}) {
  return (
    <input
      type="checkbox"
      checked={status}
      className="h-7 w-7 rounded"
      onChange={onChange}
      onClick={e => e.stopPropagation()}
    />
  )
}
