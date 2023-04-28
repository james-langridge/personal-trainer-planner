'use client'

import {useCallback, useEffect, useState} from 'react'
import {getUsersWithWorkouts} from '@/lib/api'
import {SerialisedUser, SerialisedUserKey, sortUsers} from '@/lib/users'

export function useGetClientsTableData() {
  const [sortCol, setSortCol] = useState<SerialisedUserKey>('firstName')
  const [users, setUsers] = useState<SerialisedUser[] | undefined>()

  const fetchUsers = useCallback(async () => {
    const fetchedUsers = await getUsersWithWorkouts()
    const sortedUsers = sortUsers(sortCol, fetchedUsers)

    setUsers(sortedUsers)
  }, [sortCol])

  useEffect(() => {
    void fetchUsers()
  }, [])

  useEffect(() => {
    if (!users) {
      return
    }

    const sortedUsers = sortUsers(sortCol, [...users])

    setUsers(sortedUsers)
  }, [sortCol])

  return {users, setSortCol}
}
