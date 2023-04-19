import {useQuery} from '@tanstack/react-query'
import {getUsers} from '@/lib/api'
import {isValidKey} from '@/lib/users'
import {useState} from 'react'

export function useClientsTableData() {
  const [sortCol, setSortCol] = useState('')
  const {data} = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    select: users => {
      if (!sortCol) {
        return users
      }

      if (!isValidKey(sortCol)) {
        return users
      }

      return users.sort((a, b) => {
        const rowA = a[sortCol]
        const rowB = b[sortCol]

        if (!rowA || !rowB) {
          return 0
        }

        if (rowA < rowB) {
          return -1
        }

        if (rowA > rowB) {
          return 1
        }

        return 0
      })
    },
  })

  return {data, setSortCol}
}
