import clsx from 'clsx'
import React, {useState} from 'react'
import Modal from 'react-modal'

import {type Day} from '@/@types/types'
import {CalendarForm} from '@/features/calendar/form'
import {
  getMonthName,
  getLongWeekday,
  isDayToday,
  isDayTomorrow,
} from '@/lib/calendar'

Modal.setAppElement('#modal')

export function DayMobile({
  children,
  dayData,
  isAdmin = false,
  userId,
}: {
  children: React.ReactNode
  dayData: Day
  isAdmin?: boolean
  userId?: string
}) {
  const [isModalOpen, setIsOpen] = useState(false)
  const isToday = isDayToday(dayData)
  const isTomorrow = isDayTomorrow(dayData)
  const weekday = getLongWeekday(dayData)
  const monthName = getMonthName(dayData)

  const closeModal = (e: React.SyntheticEvent) => {
    e.stopPropagation()
    setIsOpen(false)
  }

  const openModal = () => {
    if (!isAdmin || !userId) return
    setIsOpen(true)
  }

  return (
    <div className={clsx({'scroll-mt-16': isToday})}>
      <hr className="my-6 h-px border-none bg-gray-900 dark:bg-gray-700" />
      <div
        className={clsx('mb-2 flex justify-between text-sm text-gray-500', {
          'cursor-pointer': isAdmin,
        })}
        onClick={openModal}
      >
        <div className="font-bold">{weekday}</div>
        <div>
          {isToday
            ? 'Today'
            : isTomorrow
            ? 'Tomorrow'
            : dayData.day + ' ' + monthName}
          {isAdmin && (
            <span className="ml-2 text-xs text-blue-600">+ Add event</span>
          )}
        </div>
      </div>
      {isAdmin && userId && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          overlayClassName="bg-[rgba(0,0,0,.4)] flex justify-center items-center fixed inset-0 z-50"
          className="w-11/12 max-w-lg rounded-xl bg-white p-6 max-h-[90vh] overflow-y-auto"
        >
          <CalendarForm day={dayData} closeModal={closeModal} userId={userId} />
        </Modal>
      )}
      {children}
    </div>
  )
}
