import Link from 'next/link'

import {Bootcamp} from '@/@types/apiResponseTypes'
import {useToggleBootcamp} from '@/features/calendar/bootcamp'

export function BootcampItemMobile({bootcamp}: {bootcamp: Bootcamp}) {
  const {isAttending, toggleAttendance} = useToggleBootcamp(bootcamp)

  return (
    <div className="flex items-center gap-2 text-lg">
      <input
        type="checkbox"
        checked={isAttending}
        className="h-7 w-7 rounded"
        onChange={toggleAttendance}
      />

      <Link
        href={`/workout/${bootcamp?.id}`}
        className="my-1 block w-full rounded bg-yellow-400 px-2 text-white"
      >
        {bootcamp?.name}
      </Link>
    </div>
  )
}
