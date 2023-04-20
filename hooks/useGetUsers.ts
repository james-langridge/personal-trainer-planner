import {useEffect, useState} from 'react'
import {getUsersWithSessions} from '@/lib/api'
import {SerialisedUser, sortUsers} from '@/lib/users'

export function useGetUsers() {
  const [users, setUsers] = useState<SerialisedUser[] | undefined>()

  const fetchUsers = async () => {
    const fetchedUsers = await getUsersWithSessions()
    const sortedUsers = sortUsers('firstName', fetchedUsers)

    setUsers(sortedUsers)
  }

  useEffect(() => {
    void fetchUsers()
  }, [])

  return {users}
}
