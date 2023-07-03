import clsx from 'clsx'
import React, {useState} from 'react'
import Modal from 'react-modal'

import {Day} from '@/@types/types'
import {CalendarForm} from '@/components/calendar'
import {getShortWeekday, isDayToday} from '@/lib/calendar'
import {useAppDispatch, useAppSelector} from '@/redux/hooks'
import {resetWorkoutId} from '@/redux/workoutSlice'

Modal.setAppElement('#modal')

export function CalendarDay({
  day,
  isFirstWeek,
  children,
}: {
  day: Day
  isFirstWeek: boolean
  children: React.ReactNode
}) {
  const dispatch = useAppDispatch()
  const isAdmin = useAppSelector(state => state.auth.isAdmin)
  const [isModalOpen, setIsOpen] = useState(false)
  const closeModal = (e: React.SyntheticEvent) => {
    e.stopPropagation()
    dispatch(resetWorkoutId())
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
        <CalendarForm
          date={`${day.year}-${padZero(day.month + 1)}-${padZero(day.day)}`}
          closeModal={closeModal}
        />
      </Modal>
      <div
        className={
          'mx-auto w-6 rounded-full p-1 text-xs lg:w-8 lg:text-base' +
          (isToday ? ` bg-blue-900 text-white` : '')
        }
      >
        {day.day}
      </div>
      {children}
    </div>
  )
}
