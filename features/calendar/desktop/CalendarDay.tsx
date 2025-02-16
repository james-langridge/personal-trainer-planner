'use client'

import clsx from 'clsx'
import React, {useState} from 'react'
import Modal from 'react-modal'

import {Day} from '@/@types/types'
import {CalendarForm} from '@/features/calendar/form'
import {getShortWeekday, isDayToday} from '@/lib/calendar'

Modal.setAppElement('#modal')

export function CalendarDay({
  day,
  isFirstWeek,
  children,
  isAdmin,
  userId,
}: {
  day: Day
  isFirstWeek: boolean
  children: React.ReactNode
  isAdmin: boolean
  userId: string
}) {
  const [isModalOpen, setIsOpen] = useState(false)
  const closeModal = (e: React.SyntheticEvent) => {
    e.stopPropagation()
    setIsOpen(false)
  }
  const openModal = () => {
    if (!isAdmin) {
      return
    }

    setIsOpen(true)
  }
  const weekday = getShortWeekday(day)
  const isToday = isDayToday(day)

  return (
    <div
      className={clsx('border text-center ring-1 ring-gray-400/25', {
        'cursor-default': !isAdmin,
      })}
      key={day.day + day.year + day.month}
      data-testid={`${day.year}-${day.month}-${day.day}`}
      onClick={() => openModal()}
      onKeyDown={() => openModal()}
      role="button"
      tabIndex={0}
    >
      {isFirstWeek && <div className="text-xs lg:text-base">{weekday}</div>}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        overlayClassName="bg-[rgba(0,0,0,.4)] flex justify-center items-center absolute top-0 left-0 h-screen w-screen"
        className="w-3/4 rounded-xl bg-white p-8"
      >
        <CalendarForm day={day} closeModal={closeModal} userId={userId} />
      </Modal>
      <div
        className={clsx(
          'mx-auto w-6 rounded-full p-1 text-xs lg:w-8 lg:text-base',
          {
            'bg-blue-900 text-white': isToday,
          },
        )}
      >
        {day.day}
      </div>
      {children}
    </div>
  )
}
