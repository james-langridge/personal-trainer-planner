import {USER_TYPE} from '@prisma/client'
import React, {useEffect, useState} from 'react'

import {AddButton} from '@/components/AddButton'
import {ClientDropdown} from '@/features/calendar/desktop/ClientDropdown'
import {ClientTypeSwitch} from '@/features/calendar/desktop/ClientTypeSwitch'
import {sortByString} from '@/lib/users'
import {useGetUsersQuery} from '@/redux/apiSlice'

export function ClientSelect() {
  const [clientType, setClientType] = useState<USER_TYPE>(USER_TYPE.INDIVIDUAL)
  const {data = []} = useGetUsersQuery()
  // Case-insensitive sorting is not possible via a Prisma query
  // https://www.prisma.io/docs/concepts/components/prisma-client/filtering-and-sorting#can-i-perform-case-insensitive-sorting
  const filteredUsers = data.filter(user => user.type === clientType)
  const users = sortByString('name', filteredUsers)

  function toggleClientType() {
    if (clientType === 'BOOTCAMP') {
      setClientType('INDIVIDUAL')
    } else {
      setClientType('BOOTCAMP')
    }
  }

  return (
    <div className="flex w-1/3 items-center">
      <AddButton />
      <ClientDropdown users={users} />
      <ClientTypeSwitch
        clientType={clientType}
        toggleClientType={toggleClientType}
      />
    </div>
  )
}
