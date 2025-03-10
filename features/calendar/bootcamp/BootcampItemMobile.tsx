import Link from 'next/link'

import {Bootcamp} from '@/@types/apiResponseTypes'

import {useToggleBootcamp} from '@/features/calendar/bootcamp/useToggleBootcamp'

export function BootcampItemMobile({
  userBootcamps,
  bootcamp,
  userId,
}: {
  userBootcamps: {id: string}[]
  bootcamp: Bootcamp
  userId: string
}) {
  const {isAttending, toggle, status} = useToggleBootcamp(
    userBootcamps,
    bootcamp,
    userId,
  )

  return (
    <div className="flex items-center gap-2 text-lg">
      <input
        disabled={status === 'pending'}
        type="checkbox"
        checked={isAttending}
        className="h-7 w-7 rounded"
        onChange={toggle}
        data-testid="bootcamp-checkbox"
      />

      <Link
        href={`/bootcamp/${bootcamp?.id}`}
        className="my-1 block w-full rounded bg-yellow-400 px-2 text-white"
      >
        {bootcamp?.name}
      </Link>
    </div>
  )
}
