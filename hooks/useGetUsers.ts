import {useEffect, useState} from 'react'

import {getUsersWithWorkouts} from '@/lib/api'
import {SerialisedUser, sortUsers} from '@/lib/users'

export function useGetUsers() {
  // TODO put this in redux
  const [users, setUsers] = useState<SerialisedUser[] | undefined>()

  const fetchUsers = async () => {
    const fetchedUsers = await getUsersWithWorkouts()
    const sortedUsers = sortUsers('name', fetchedUsers)

    setUsers(sortedUsers)
  }

  useEffect(() => {
    void fetchUsers()
  }, [])

  return {users}
}
