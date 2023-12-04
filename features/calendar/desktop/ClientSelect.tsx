import {USER_TYPE} from '@prisma/client'
import {useState} from 'react'

import {AddButton} from '@/components/AddButton'
import {sortByString} from '@/lib/users'
import {useGetUsersQuery} from '@/redux/services/users'

import {ClientDropdown, ClientTypeSwitch} from '.'

export function ClientSelect() {
  const [clientType, setClientType] = useState<USER_TYPE>(USER_TYPE.INDIVIDUAL)
  const {data = []} = useGetUsersQuery()
  const filteredUsers = data.filter(user => user.type === clientType)
  // Case-insensitive sorting is not possible via a Prisma query
  // TODO: sanitise the names before saving in the DB
  // https://www.prisma.io/docs/concepts/components/prisma-client/filtering-and-sorting#can-i-perform-case-insensitive-sorting
  const users = sortByString('name', filteredUsers)

  return (
    <div className="flex flex-col pt-5">
      <div className="mb-5 flex">
        <AddButton />
        <ClientDropdown users={users} />
      </div>
      <ClientTypeSwitch toggleClientType={setClientType} />
    </div>
  )
}
