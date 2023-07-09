import {useEffect, useRef, useState} from 'react'

import {UserWithWorkoutsKey, UserWithWorkoutAndAttendance} from '@/@types/types'
import {addAttendanceData, sortUsers} from '@/lib/users'
import {filterByMonth} from '@/lib/workouts'
import {useGetUsersQuery} from '@/redux/apiSlice'

export function useSortUsers({
  initialMonth,
  initialYear,
}: {
  initialMonth: number
  initialYear: number
}) {
  const [prevMonth, setPrevMonth] = useState(() => initialMonth)
  const [prevYear, setPrevYear] = useState(() => initialYear)
  const [sortCol, setSortCol] = useState<Record<string, UserWithWorkoutsKey>>({
    key: 'name',
  })
  const [sortedUsers, setSortedUsers] = useState<
    UserWithWorkoutAndAttendance[] | undefined
  >()
  const [filteredUsers, setFilteredUsers] = useState<
    UserWithWorkoutAndAttendance[] | undefined
  >()
  const {data: users} = useGetUsersQuery()
  const prevSortColRef = useRef<Record<string, UserWithWorkoutsKey>>()
  const sortOrder = useRef<'asc' | 'des'>('asc')
  const [month, setMonth] = useState(() => initialMonth)
  const [year, setYear] = useState(() => initialYear)

  useEffect(() => {
    if (!users) {
      return
    }

    const filteredUsers = filterByMonth(year, month, [...users])
    const usersWithData = addAttendanceData(filteredUsers)

    //   setFilteredUsers(usersWithData)
    // }, [month, users, year])
    //
    // useEffect(() => {
    //   if (!filteredUsers) {
    //     return
    //   }

    if (
      prevSortColRef.current?.key === sortCol.key &&
      prevMonth === month &&
      prevYear === year
    ) {
      sortOrder.current = sortOrder.current === 'asc' ? 'des' : 'asc'
    } else {
      sortOrder.current = 'asc'
    }

    const sorted = sortUsers(
      sortCol.key,
      [...usersWithData],
      sortOrder.current === 'asc',
    )

    setSortedUsers(sorted)
    prevSortColRef.current = sortCol
    setPrevMonth(month)
    setPrevYear(year)
  }, [month, prevMonth, prevYear, sortCol, users, year])

  return {sortedUsers, setSortCol, month, setMonth, year, setYear}
}
