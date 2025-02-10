import DateProvider from '@/app/(restricted)/users/[year]/[month]/DateProvider'
import {DateChangeButtons} from '@/components/DateChangeButtons'
import {columns, DataTable} from '@/features/users/summary'
import {sortByString} from '@/lib/users'
import {getUsers} from '@/app/actions/users'

export default async function Users(props: {
  params: Promise<{year: string; month: string}>
}) {
  const params = await props.params
  const {year, month} = params
  let dateFilter: {
    gte: Date
    lt: Date
  }
  const date = `${year}-${month}`
  const thisMonth = new Date(date)
  const nextMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() + 1)

  dateFilter = {
    gte: thisMonth,
    lt: nextMonth,
  }

  const {users: data} = await getUsers(dateFilter)

  // Case-insensitive sorting is not possible via a Prisma query
  // TODO: sanitise the names before saving in the DB
  // https://www.prisma.io/docs/concepts/components/prisma-client/filtering-and-sorting#can-i-perform-case-insensitive-sorting
  const users = sortByString('name', data)

  if (!users) {
    return null
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center space-x-2">
        <DateChangeButtons year={year} month={month} />
      </div>
      <DateProvider date={date}>
        <DataTable columns={columns} data={users} />
      </DateProvider>
    </div>
  )
}
