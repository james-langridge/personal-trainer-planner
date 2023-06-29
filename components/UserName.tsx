import React from 'react'

import {useAppSelector} from '@/redux/hooks'

export function UserName() {
  const user = useAppSelector(state => state.users.user)
  const isAdmin = useAppSelector(state => state.auth.isAdmin)

  if (!isAdmin) {
    return <div></div>
  }

  return (
    <span className="mt-4 text-center text-4xl font-medium capitalize text-gray-800 dark:text-gray-200">
      {user?.name}
    </span>
  )
}
