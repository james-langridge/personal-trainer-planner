import Link from 'next/link'

import {Bootcamp} from '@/@types/apiResponseTypes'

import {useToggleBootcamp} from '@/features/calendar/bootcamp/useToggleBootcamp'

export function BootcampItemMobile({
  userBootcamps,
  bootcamp,
  userId,
  isAdmin = false,
}: {
  userBootcamps: {id: string}[]
  bootcamp: Bootcamp
  userId: string
  isAdmin?: boolean
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
        href={
          isAdmin
            ? `/admin/bootcamp/${bootcamp?.id}`
            : `/bootcamp/${bootcamp?.id}`
        }
        className="my-1 block w-full rounded bg-yellow-400 px-2 text-white"
      >
        {bootcamp?.name}
        {isAdmin && bootcamp.attendees && (
          <span className="ml-2 text-sm">
            ({bootcamp.attendees.length} attendees)
          </span>
        )}
      </Link>
    </div>
  )
}
