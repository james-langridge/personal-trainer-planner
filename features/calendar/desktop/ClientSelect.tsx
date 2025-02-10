import {AddButton} from '@/components/AddButton'

import {ClientDropdown} from '@/features/calendar/desktop/ClientDropdown'
import {getUserIdsAndNames} from '@/app/actions/users'

const sortByName = (
  arr: {name: string; id: string}[],
): {name: string; id: string}[] => {
  return [...arr].sort((a, b) => a.name.localeCompare(b.name))
}

export default async function ClientSelect({
  year,
  month,
}: {
  year: number
  month: number
}) {
  const {users} = await getUserIdsAndNames()
  // Case-insensitive sorting is not possible via a Prisma query
  // TODO: sanitise the names before saving in the DB
  // https://www.prisma.io/docs/concepts/components/prisma-client/filtering-and-sorting#can-i-perform-case-insensitive-sorting
  const sortedUsers = sortByName(users)

  return (
    <div className="flex flex-col pt-5">
      <div className="mb-5 flex">
        <AddButton />
        <ClientDropdown users={sortedUsers} year={year} month={month} />
      </div>
      {/*<ClientTypeSwitch toggleClientType={setClientType} />*/}
    </div>
  )
}
