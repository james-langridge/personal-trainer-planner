import React from 'react'

import {useAppSelector} from '@/redux/hooks'
import {selectUser} from '@/redux/usersSlice'

export function UserName() {
  const user = useAppSelector(selectUser)

  return (
    <span className="mt-4 text-center text-4xl font-medium capitalize text-gray-800 dark:text-gray-200">
      {user?.name}
    </span>
  )
}
