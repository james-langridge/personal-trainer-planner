import Link from 'next/link'

import {Appointment} from '@/@types/apiResponseTypes'
import {formatTimeRange} from '@/lib/calendar'

export function AppointmentItemMobile({
  appointment,
}: {
  appointment: Appointment
}) {
  const getAppointmentDisplay = () => {
    if (appointment.startTime && appointment.endTime) {
      const startTime = new Date(appointment.startTime)
      const endTime = new Date(appointment.endTime)
      const timeRange = formatTimeRange(startTime, endTime)
      return `${appointment.name} (${timeRange})`
    }
    return appointment.name
  }

  return (
    <div className="flex items-center gap-2 text-lg">
      <Link
        href={`/appointment/${appointment?.id}`}
        className="p my-1 block w-full rounded bg-blue-400 px-2 text-white"
      >
        {getAppointmentDisplay()}
      </Link>
    </div>
  )
}
