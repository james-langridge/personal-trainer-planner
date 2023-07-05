import {useEffect, useRef, useState} from 'react'

import {SerialisedUser, SerialisedUserKey} from '@/@types/types'
import {sortUsers} from '@/lib/users'
import {useGetUsersQuery} from '@/redux/apiSlice'

export function useSortUsers() {
  const [sortCol, setSortCol] = useState<Record<string, SerialisedUserKey>>({
    key: 'name',
  })
  const [sortedUsers, setSortedUsers] = useState<SerialisedUser[] | undefined>()
  const {data: users} = useGetUsersQuery()
  const prevSortColRef = useRef<Record<string, SerialisedUserKey>>()
  const sortOrder = useRef<'asc' | 'des'>('asc')

  useEffect(() => {
    if (!users) {
      return
    }

    if (prevSortColRef.current?.key === sortCol.key) {
      sortOrder.current = sortOrder.current === 'asc' ? 'des' : 'asc'
    } else {
      sortOrder.current = 'asc'
    }

    const sorted = sortUsers(
      sortCol.key,
      [...users],
      sortOrder.current === 'asc',
    )

    setSortedUsers(sorted)
    prevSortColRef.current = sortCol
  }, [sortCol, users])

  return {sortedUsers, setSortCol}
}
