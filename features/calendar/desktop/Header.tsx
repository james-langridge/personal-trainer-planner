import {NextMonthBtn} from '@/components/NextMonthBtn'
import {PrevMonthBtn} from '@/components/PrevMonthBtn'
import {monthNames} from '@/lib/constants'

import ClientSelect from '@/features/calendar/desktop/ClientSelect'
import {auth} from '@/auth'
import Link from 'next/link'

export async function Header({
  year,
  jsMonth,
  userId,
}: {
  year: number
  jsMonth: number
  userId: string
}) {
  const session = await auth()
  const isAdmin = session?.user?.role === 'admin'

  return (
    <div className="flex w-full flex-col">
      {isAdmin && <ClientSelect year={year} jsMonth={jsMonth} />}
      <DateChangeButtons userId={userId} year={year} jsMonth={jsMonth} />
    </div>
  )
}

function DateChangeButtons({
  userId,
  jsMonth,
  year,
}: {
  userId: string
  year: number
  jsMonth: number
}) {
  const monthName = monthNames[jsMonth]
  const month = jsMonth + 1

  function decrementMonth() {
    if (jsMonth === 0) {
      return `/calendar/${userId}/${year - 1}/${12}`
    } else {
      return `/calendar/${userId}/${year}/${month - 1}`
    }
  }

  function incrementMonth() {
    if (jsMonth === 11) {
      return `/calendar/${userId}/${year + 1}/${1}`
    } else {
      return `/calendar/${userId}/${year}/${month + 1}`
    }
  }

  return (
    <div className="flex flex-row items-center py-5 text-2xl">
      <Link href={decrementMonth()}>
        <PrevMonthBtn />
      </Link>
      <Link href={incrementMonth()}>
        <NextMonthBtn />
      </Link>
      <p data-testid={'heading'}>
        {monthName} {year}
      </p>
    </div>
  )
}
