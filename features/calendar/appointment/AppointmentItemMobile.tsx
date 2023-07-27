import Link from 'next/link'

import {Appointment} from '@/@types/apiResponseTypes'

export function AppointmentItemMobile({
  appointment,
}: {
  appointment: Appointment
}) {
  return (
    <div className="flex items-center gap-2 text-lg">
      <Link
        href={`/appointment/${appointment?.id}`}
        className="p my-1 block w-full rounded bg-blue-400 px-2 text-white"
      >
        {appointment?.name}
      </Link>
    </div>
  )
}
