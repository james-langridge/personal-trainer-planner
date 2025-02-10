import {redirect} from 'next/navigation'

export function CalendarDesktop({userId}: {userId: string}) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  return redirect(`/calendar/${userId}/${year}/${month}`)
}
