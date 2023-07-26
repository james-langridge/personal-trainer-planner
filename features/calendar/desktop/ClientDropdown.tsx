import {UserWithWorkouts} from '@/@types/apiResponseTypes'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select'
import {useAppDispatch} from '@/redux/hooks'
import {setUser} from '@/redux/usersSlice'

export function ClientDropdown({users}: {users: UserWithWorkouts[]}) {
  const dispatch = useAppDispatch()

  const onSelect = (userName: string) => {
    dispatch(setUser(users.find(user => user.name === userName)))
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
