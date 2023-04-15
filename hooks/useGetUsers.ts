import {useEffect, useState} from 'react'
import {fetchUsers} from '@/lib/api'
import {User} from '@/app/api/users/route'

export function useGetUsers() {
  const [users, setUsers] = useState<User[]>()

  const getUsers = async () => {
    const users = await fetchUsers()

    setUsers(users)
  }

  useEffect(() => {
    void getUsers()
  }, [])

  return [users]
}
