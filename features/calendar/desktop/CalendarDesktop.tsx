import {redirect} from 'next/navigation'
import {UserWithWorkouts} from '@/@types/apiResponseTypes'

export default function CalendarDesktop({user}: {user: UserWithWorkouts}) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  redirect(`/${user.id}/${year}/${month}`)

  return <div>Foobar</div>
}
