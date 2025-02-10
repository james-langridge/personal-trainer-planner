'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select'
import {useRouter} from 'next/navigation'

export function ClientDropdown({
  users,
  year,
  month,
}: {
  users: {name: string; id: string}[]
  year: number
  month: number
}) {
  const router = useRouter()
  const onSelect = (userName: string) => {
    const user = users.find(user => user.name === userName)
    if (!user) return
    router.push(`/calendar/${user.id}/${year}/${month}`)
  }

  return (
    <Select onValueChange={userName => onSelect(userName)}>
      <SelectTrigger className="w-[180px] capitalize">
        <SelectValue placeholder="Select a client" />
      </SelectTrigger>
      <SelectContent>
        {users.map(user => {
          return (
            <SelectItem
              key={user.id}
              value={user.name || ''}
              className="capitalize"
            >
              {user.name}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
