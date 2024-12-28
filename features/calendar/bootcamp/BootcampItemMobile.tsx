import Link from 'next/link'

import {Bootcamp} from '@/@types/apiResponseTypes'

import {useToggleBootcamp} from '.'

export function BootcampItemMobile({bootcamp}: {bootcamp: Bootcamp}) {
  const {isAttending, isLoading, toggleAttendance} = useToggleBootcamp(bootcamp)

  return (
    <div className="flex items-center gap-2 text-lg">
      <input
        disabled={isLoading}
        type="checkbox"
        checked={isAttending}
        className="h-7 w-7 rounded"
        onChange={toggleAttendance}
      />

      <Link
        href={`/app/(restricted)/bootcamps/${bootcamp?.id}`}
        className="my-1 block w-full rounded bg-yellow-400 px-2 text-white"
      >
        {bootcamp?.name}
      </Link>
    </div>
  )
}
