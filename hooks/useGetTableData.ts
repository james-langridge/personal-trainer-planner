'use client'

import {useCallback, useEffect, useState} from 'react'
import {getUsersWithSessions} from '@/lib/api'
import {SerialisedUser, SerialisedUserKey, sortUsers} from '@/lib/users'

export function useGetTableData() {
  const [sortCol, setSortCol] = useState<SerialisedUserKey>('firstName')
  const [users, setUsers] = useState<SerialisedUser[] | undefined>()

  const fetchUsers = useCallback(async () => {
    const fetchedUsers = await getUsersWithSessions()
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
