'use client'

import {SelectUserId} from '@/features/calendar/desktop/CalendarDesktop'
import {useUserIdsAndNames} from '@/app/hooks/users'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select'
import {User} from 'lucide-react'

const sortByName = (
  arr: {name: string; id: string}[],
): {name: string; id: string}[] => {
  return [...arr].sort((a, b) => a.name.localeCompare(b.name))
}

export default function MobileClientSelect({
  onSelect,
}: {
  onSelect: SelectUserId
}) {
  const {data: users} = useUserIdsAndNames()

  if (!users) return null
  const sortedUsers = sortByName(users)

  const handleValueChange = (value: string) => {
    onSelect(value, sortedUsers)
  }

  return (
    <div className="flex items-center gap-2 py-3">
      <User className="h-4 w-4 text-gray-500" />
      <Select onValueChange={handleValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a client" />
        </SelectTrigger>
        <SelectContent>
          {sortedUsers.map(user => (
            <SelectItem key={user.id} value={user.name}>
              {user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
