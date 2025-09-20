import Link from 'next/link'

import {Appointment} from '@/@types/apiResponseTypes'
import {formatTimeRange} from '@/lib/calendar'

export function AppointmentItemMobile({
  appointment,
  isAdmin = false,
}: {
  appointment: Appointment
  isAdmin?: boolean
}) {
  const getAppointmentDisplay = () => {
    let display = appointment.name

    if (appointment.startTime && appointment.endTime) {
      const startTime = new Date(appointment.startTime)
      const endTime = new Date(appointment.endTime)
      const timeRange = formatTimeRange(startTime, endTime)
      display = `${appointment.name} (${timeRange})`
    }

    if (isAdmin && appointment.owner?.name) {
      display = `${appointment.owner.name}: ${display}`
    }

    return display
  }

  return (
    <div className="flex items-center gap-2 text-lg">
      <Link
        href={
          isAdmin
            ? `/admin/appointment/${appointment?.id}`
            : `/appointment/${appointment?.id}`
        }
        className="p my-1 block w-full rounded bg-blue-400 px-2 text-white"
      >
        {getAppointmentDisplay()}
      </Link>
    </div>
  )
}
