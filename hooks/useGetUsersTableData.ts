'use client'

import {useCallback, useEffect, useState} from 'react'

import {SerialisedUser, SerialisedUserKey, sortUsers} from '@/lib/users'
import {useGetUsersQuery} from '@/redux/apiSlice'

export function useGetUsersTableData() {
  const [sortCol, setSortCol] = useState<SerialisedUserKey>('name')
  const [users, setUsers] = useState<SerialisedUser[] | undefined>()
  const {data: fetchedUsers} = useGetUsersQuery()

  const fetchUsers = useCallback(async () => {
    if (!fetchedUsers) {
      return
    }

    const sortedUsers = sortUsers(sortCol, fetchedUsers)

    setUsers(sortedUsers)
  }, [fetchedUsers, sortCol])

  useEffect(() => {
    void fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    if (!users) {
      return
    }

    const sortedUsers = sortUsers(sortCol, [...users])

    setUsers(sortedUsers)
  }, [sortCol])

  return {users, setSortCol}
}
