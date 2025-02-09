import {NextMonthBtn} from '@/components/NextMonthBtn'
import {PrevMonthBtn} from '@/components/PrevMonthBtn'
import {monthNames} from '@/lib/constants'

import ClientSelect from '@/features/calendar/desktop/ClientSelect'
import {auth} from '@/auth'
import Link from 'next/link'

export async function Header({
  year,
  month,
  userId,
}: {
  year: number
  month: number
  userId: string
}) {
  const session = await auth()
  const isAdmin = session?.user?.role === 'admin'

  return (
    <div className="flex w-full flex-col">
      {isAdmin && <ClientSelect year={year} month={month} />}
      <DateChangeButtons userId={userId} year={year} month={month} />
    </div>
  )
}

function DateChangeButtons({
  userId,
  month,
  year,
}: {
  userId: string
  year: number
  month: number
}) {
  const monthName = monthNames[month - 1]

  function decrementMonth() {
    if (month === 1) {
      return `/${userId}/${year - 1}/${12}`
    } else {
      return `/${userId}/${year}/${month - 1}`
    }
  }

  function incrementMonth() {
    if (month === 11) {
      return `/${userId}/${year + 1}/${1}`
    } else {
      return `/${userId}/${year}/${month + 1}`
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
