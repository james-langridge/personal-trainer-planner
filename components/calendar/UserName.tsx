import React from 'react'

export function UserName({
  firstName,
  lastName,
}: {
  firstName?: string | null
  lastName?: string | null
}) {
  if (!firstName || !lastName) {
    return null
  }

  return (
    <span className="mt-4 text-center font-medium text-gray-800 dark:text-gray-200">
      {`${firstName} ${lastName}`}
    </span>
  )
}
