import {redirect} from 'next/navigation'

import {UserWithWorkouts} from '@/@types/apiResponseTypes'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select'
// import {useAppDispatch} from '@/redux/store'
// import {setUser} from '@/redux/usersSlice'

export function ClientDropdown({
  users,
  year,
  month,
}: {
  users: UserWithWorkouts[]
  year: string
  month: string
}) {
  // const dispatch = useAppDispatch()

  const onSelect = (userId: string) => {
    // dispatch(setUser(users.find(user => user.name === userName)))
    redirect(`/calendar/${year}/${month}/${userId}`)

    // TODO need to change the month prev next btns too
  }

  return (
    <Select onValueChange={userId => onSelect(userId)}>
      <SelectTrigger className="w-[180px] capitalize">
        <SelectValue placeholder="Select a client" />
      </SelectTrigger>
      <SelectContent>
        {users.map(user => {
          return (
            <SelectItem
              key={user.id}
              value={user.id || ''}
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
