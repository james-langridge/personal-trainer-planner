'use client'

import Link from 'next/link'
import React, {useState} from 'react'
import Modal from 'react-modal'
import {useQueryClient} from '@tanstack/react-query'

import {Appointment} from '@/@types/apiResponseTypes'
import {formatTimeRange} from '@/lib/calendar'
import {CalendarForm} from '@/features/calendar/form'
import {Day} from '@/@types/types'

export function AppointmentItemMobile({
  appointment,
  isAdmin = false,
  clientName,
  day,
  userId,
}: {
  appointment: Appointment
  isAdmin?: boolean
  clientName?: string
  day?: Day
  userId?: string
}) {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsOpen] = useState(false)
  const [eventId, setEventId] = useState<string>()

  const closeModal = (e: React.SyntheticEvent) => {
    e.stopPropagation()
    setIsOpen(false)
    setEventId(undefined)
  }

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    if (!isAdmin || !day || !userId) {
      // For non-admin, navigate normally
      if (!isAdmin) {
        window.location.href = `/appointment/${appointment?.id}`
      }
      return
    }

    setEventId(appointment.id)
    queryClient.invalidateQueries({queryKey: ['appointment', appointment.id]})
    queryClient.refetchQueries({queryKey: ['appointment', appointment.id]})
    setIsOpen(true)
  }
  const getAppointmentDisplay = () => {
    let display = appointment.name

    if (appointment.startTime && appointment.endTime) {
      const startTime = new Date(appointment.startTime)
      const endTime = new Date(appointment.endTime)
      const timeRange = formatTimeRange(startTime, endTime)
      display = `${appointment.name} (${timeRange})`
    }

    if (isAdmin && clientName) {
      display = `${clientName}: ${display}`
    }

    return display
  }

  if (isAdmin && day && userId) {
    return (
      <div className="flex items-center gap-2 text-lg">
        <div
          onClick={handleClick}
          className="p my-1 block w-full cursor-pointer rounded bg-blue-400 px-2 text-white"
        >
          {getAppointmentDisplay()}
        </div>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          overlayClassName="bg-[rgba(0,0,0,.4)] flex justify-center items-center fixed inset-0 z-50"
          className="max-h-[90vh] w-11/12 max-w-lg overflow-y-auto rounded-xl bg-white p-6"
        >
          <CalendarForm
            day={day}
            closeModal={closeModal}
            userId={userId}
            eventId={eventId}
            eventType={'APPOINTMENT'}
          />
        </Modal>
      </div>
    )
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
