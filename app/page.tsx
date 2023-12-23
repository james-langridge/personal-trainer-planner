import {redirect} from 'next/navigation'

export const dynamic = 'force-dynamic'

function getUrl() {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1

  return `/calendar/${year}/${month}`
}

export default async function Page() {
  redirect(getUrl())
}
