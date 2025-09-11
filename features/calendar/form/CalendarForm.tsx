import React from 'react'
import {Day} from '@/@types/types'
import {EventTypeSelect, SubmitButtons, WeekdayButtonGroup} from '.'
import {useCalendarForm} from '@/features/calendar/form/useCalendarForm'
import Loader from '@/components/Loader'
import {EVENT_TYPE} from '@prisma/client'

export function CalendarForm({
  day,
  closeModal,
  userId,
  eventId,
  eventType,
}: {
  day: Day
  closeModal: (e: React.SyntheticEvent) => void
  userId: string
  eventId?: string
  eventType?: EVENT_TYPE
}) {
  const {
    error,
    form: formData,
    handleDelete,
    handleStartTimeChange,
    handleSubmit,
    inputRef,
    isCreating,
    isDeleting,
    isDisabled,
    isUpdating,
    setForm,
    toggleDay,
  } = useCalendarForm({
    day,
    closeModal,
    userId,
    eventId,
    eventType,
  })

  if (eventId && !formData.id)
    return (
      <div className="flex h-20 w-20 items-center justify-center">
        <Loader />
      </div>
    )

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <input
        required
        onChange={e =>
          setForm(form => ({
            ...form,
            date: e.target.value,
          }))
        }
        type="date"
        className="block w-full rounded-lg border bg-white p-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
        value={formData.date}
      />
      <div className="flex items-center justify-between">
        <input
          required
          ref={inputRef}
          onChange={e =>
            setForm(form => ({
              ...form,
              name: e.target.value,
            }))
          }
          placeholder="Event name"
          className="block w-1/2 rounded-lg border bg-white p-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
          value={formData.name}
        />

        {formData.type === 'APPOINTMENT' && (
          <div className="flex items-center space-x-2">
            <label htmlFor="fee">Fee:</label>
            <input
              id="fee"
              className="block w-1/2 rounded-lg border bg-white p-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
              placeholder="0.00"
              value={formData.fee}
              onChange={e =>
                setForm(form => ({
                  ...form,
                  fee: e.target.value,
                }))
              }
            />
          </div>
        )}
      </div>

      {formData.type === 'APPOINTMENT' && (
        <div className="flex items-center space-x-4">
          <div className="flex flex-1 items-center space-x-2">
            <label htmlFor="startTime">Start:</label>
            <input
              id="startTime"
              type="time"
              className="block flex-1 rounded-lg border bg-white p-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
              value={formData.startTime}
              onChange={e => handleStartTimeChange(e.target.value)}
            />
          </div>
          <div className="flex flex-1 items-center space-x-2">
            <label htmlFor="endTime">End:</label>
            <input
              id="endTime"
              type="time"
              className="block flex-1 rounded-lg border bg-white p-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
              value={formData.endTime}
              onChange={e =>
                setForm(form => ({
                  ...form,
                  endTime: e.target.value,
                }))
              }
            />
          </div>
        </div>
      )}

      {formData.type === 'APPOINTMENT' && formData.startTime && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <button
            type="button"
            className="underline hover:text-gray-800 dark:hover:text-gray-200"
            onClick={() =>
              setForm(form => ({...form, startTime: '', endTime: ''}))
            }
          >
            Clear times (make all-day event)
          </button>
        </div>
      )}

      {!formData.id && (
        <div className="flex items-center justify-between">
          <EventTypeSelect form={formData} setForm={setForm} />
          <WeekdayButtonGroup
            form={formData}
            setForm={setForm}
            toggleDay={toggleDay}
          />
        </div>
      )}

      <textarea
        onChange={e =>
          setForm(form => ({
            ...form,
            description: e.target.value,
          }))
        }
        placeholder="Description"
        rows={5}
        cols={15}
        className="block w-full rounded-lg border bg-white p-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
        value={formData.description ?? ''}
      />
      <input
        onChange={e =>
          setForm(form => ({
            ...form,
            videoUrl: e.target.value,
          }))
        }
        placeholder="Video url"
        type="url"
        className="block w-full rounded-lg border bg-white p-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
        value={formData.videoUrl ?? ''}
      />
      <SubmitButtons
        form={formData}
        isCreating={isCreating}
        isDisabled={isDisabled}
        handleDelete={handleDelete}
        isDeleting={isDeleting}
        isUpdating={isUpdating}
      />
      <pre style={{whiteSpace: 'normal'}}>{error?.message}</pre>
    </form>
  )
}
