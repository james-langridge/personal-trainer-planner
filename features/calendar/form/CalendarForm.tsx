import React from 'react'

import {UserWithWorkouts} from '@/@types/apiResponseTypes'
import {Day} from '@/@types/types'

import {
  EventTypeSelect,
  SubmitButtons,
  useCalendarForm,
  WeekdayButtonGroup,
} from '.'

export function CalendarForm({
  day,
  closeModal,
  user,
}: {
  day: Day
  closeModal: (e: React.SyntheticEvent) => void
  user: UserWithWorkouts
}) {
  const {
    error,
    form: formData,
    handleDelete,
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
    user,
  })

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
      <pre style={{whiteSpace: 'normal'}}>{error}</pre>
    </form>
  )
}
