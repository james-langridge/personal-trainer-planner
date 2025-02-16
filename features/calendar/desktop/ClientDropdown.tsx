import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select'
import {SelectUserId} from '@/features/calendar/desktop/CalendarDesktop'

export function ClientDropdown({
  users,
  onSelect,
}: {
  users: {name: string; id: string}[]
  onSelect: SelectUserId
}) {
  return (
    <Select onValueChange={userName => onSelect(userName, users)}>
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
