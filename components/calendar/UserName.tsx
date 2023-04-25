import React from 'react'
import {useUser} from '@/app/(training-app)/Providers'

export function UserName() {
  const userState = useUser()
  if (!userState.user) {
    return null
  }

  return (
    <span className="mt-4 text-center font-medium capitalize text-gray-800 dark:text-gray-200">
      {`${userState?.user?.firstName} ${userState?.user?.lastName}`}
    </span>
  )
}
