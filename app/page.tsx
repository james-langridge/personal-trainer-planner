import {redirect} from 'next/navigation'

export default async function Page() {
  // todo redirect with middleware instead?
  redirect('/calendar/me')

  return null
}
