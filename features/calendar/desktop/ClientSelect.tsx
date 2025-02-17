import {AddButton} from '@/components/AddButton'

import {ClientDropdown} from '@/features/calendar/desktop/ClientDropdown'
import {SelectUserId} from '@/features/calendar/desktop/CalendarDesktop'
import {useUserIdsAndNames} from '@/app/hooks/users'

const sortByName = (
  arr: {name: string; id: string}[],
): {name: string; id: string}[] => {
  return [...arr].sort((a, b) => a.name.localeCompare(b.name))
}

export default function ClientSelect({onSelect}: {onSelect: SelectUserId}) {
  const {data: users} = useUserIdsAndNames()
  // Case-insensitive sorting is not possible via a Prisma query
  // TODO: sanitise the names before saving in the DB
  // https://www.prisma.io/docs/concepts/components/prisma-client/filtering-and-sorting#can-i-perform-case-insensitive-sorting
  if (!users) return null
  const sortedUsers = sortByName(users)

  return (
    <div className="flex flex-col pt-5">
      <div className="mb-5 flex">
        <AddButton />
        <ClientDropdown onSelect={onSelect} users={sortedUsers} />
      </div>
      {/*<ClientTypeSwitch toggleClientType={setClientType} />*/}
    </div>
  )
}
