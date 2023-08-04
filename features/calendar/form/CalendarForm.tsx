import React from 'react'

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
}: {
  day: Day
  closeModal: (e: React.SyntheticEvent) => void
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
  })

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <input
        required
        onChange={e =>
          setForm(form => ({
            ...form,
            date: e.target.value,
          }))
        }
        type="date"
        className="mt-4 block w-full rounded-lg border bg-white p-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
        value={formData.date}
      />
      <input
        required
        ref={inputRef}
        onChange={e =>
          setForm(form => ({
            ...form,
            name: e.target.value,
          }))
        }
        placeholder="Workout name"
        className="mt-4 block w-full rounded-lg border bg-white p-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
        value={formData.name}
      />

      {!formData.id && (
        <div className="flex justify-between">
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
        className="mt-4 block w-full rounded-lg border bg-white p-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
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
        className="mt-4 block w-full rounded-lg border bg-white p-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
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
