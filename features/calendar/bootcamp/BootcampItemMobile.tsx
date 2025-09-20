'use client'

import Link from 'next/link'
import React, {useState} from 'react'
import Modal from 'react-modal'
import {useQueryClient} from '@tanstack/react-query'

import {Bootcamp} from '@/@types/apiResponseTypes'
import {useToggleBootcamp} from '@/features/calendar/bootcamp/useToggleBootcamp'
import {CalendarForm} from '@/features/calendar/form'
import {Day} from '@/@types/types'

export function BootcampItemMobile({
  userBootcamps,
  bootcamp,
  userId,
  isAdmin = false,
  day,
}: {
  userBootcamps: {id: string}[]
  bootcamp: Bootcamp
  userId: string
  isAdmin?: boolean
  day?: Day
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

    if (!isAdmin || !day) {
      // For non-admin, navigate normally
      if (!isAdmin) {
        window.location.href = `/bootcamp/${bootcamp?.id}`
      }
      return
    }

    setEventId(bootcamp.id)
    queryClient.invalidateQueries({queryKey: ['bootcamp', bootcamp.id]})
    queryClient.refetchQueries({queryKey: ['bootcamp', bootcamp.id]})
    setIsOpen(true)
  }
  const {isAttending, toggle, status} = useToggleBootcamp(
    userBootcamps,
    bootcamp,
    userId,
  )

  if (isAdmin && day) {
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

        <div
          onClick={handleClick}
          className="my-1 block w-full cursor-pointer rounded bg-yellow-400 px-2 text-white"
        >
          {bootcamp?.name}
          {bootcamp.attendees && (
            <span className="ml-2 text-sm">
              ({bootcamp.attendees.length} attendees)
            </span>
          )}
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
            eventType={'BOOTCAMP'}
          />
        </Modal>
      </div>
    )
  }

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
