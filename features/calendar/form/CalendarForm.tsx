import clsx from 'clsx'
import Link from 'next/link'
import React, {useEffect, useRef, useState} from 'react'

import {Day, EventType} from '@/@types/types'
import Button from '@/components/Button'
import {useCalendarForm} from '@/features/calendar/form'
import {
  useCreateAppointmentMutation,
  useCreateBootcampMutation,
  useCreateWorkoutMutation,
  useDeleteAppointmentMutation,
  useDeleteBootcampMutation,
  useDeleteWorkoutMutation,
  useUpdateAppointmentMutation,
  useUpdateBootcampMutation,
  useUpdateWorkoutMutation,
} from '@/redux/apiSlice'
import {resetEvent} from '@/redux/eventSlice'
import {useAppDispatch, useAppSelector} from '@/redux/hooks'
import {selectUser} from '@/redux/usersSlice'

export function CalendarForm({
  day,
  closeModal,
}: {
  day: Day
  closeModal: (e: React.SyntheticEvent) => void
}) {
  const user = useAppSelector(selectUser)
  const dispatch = useAppDispatch()
  const userId = user?.id
  const [formData, setForm, toggleDay] = useCalendarForm({
    day,
  })
  const [error, setError] = useState<Error>()
  const [createAppointment, {isLoading: isCreatingAppointment}] =
    useCreateAppointmentMutation()
  const [updateAppointment, {isLoading: isUpdatingAppointment}] =
    useUpdateAppointmentMutation()
  const [deleteAppointment, {isLoading: isDeletingAppointment}] =
    useDeleteAppointmentMutation()
  const [createWorkout, {isLoading: isCreating}] = useCreateWorkoutMutation()
  const [updateWorkout, {isLoading: isUpdating}] = useUpdateWorkoutMutation()
  const [deleteWorkout, {isLoading: isDeleting}] = useDeleteWorkoutMutation()
  const [createBootcamp, {isLoading: isCreatingBootcamp}] =
    useCreateBootcampMutation()
  const [updateBootcamp, {isLoading: isUpdatingBootcamp}] =
    useUpdateBootcampMutation()
  const [deleteBootcamp, {isLoading: isDeletingBootcamp}] =
    useDeleteBootcampMutation()
  const isDisabled =
    isCreating ||
    isCreatingBootcamp ||
    isCreatingAppointment ||
    isUpdating ||
    isUpdatingBootcamp ||
    isUpdatingAppointment ||
    isDeleting ||
    isDeletingBootcamp ||
    isDeletingAppointment
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!userId) {
      return
    }

    setForm(form => ({
      ...form,
      ownerId: userId,
    }))
  }, [setForm, userId])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    if (formData.type === 'WORKOUT') {
      try {
        if (formData.id) {
          await updateWorkout(formData).unwrap()
        } else {
          await createWorkout({
            ...formData,
            selectedDays: [...formData.selectedDays],
          }).unwrap()
        }

        closeModal(e)
      } catch (error) {
        setError(error as Error)
      }
    }

    if (formData.type === 'APPOINTMENT') {
      try {
        if (formData.id) {
          await updateAppointment(formData).unwrap()
        } else {
          await createAppointment({
            ...formData,
            selectedDays: [...formData.selectedDays],
          }).unwrap()
        }

        closeModal(e)
      } catch (error) {
        setError(error as Error)
      }
    }

    if (formData.type === 'BOOTCAMP') {
      try {
        if (formData.id) {
          await updateBootcamp(formData).unwrap()
        } else {
          await createBootcamp({
            ...formData,
            selectedDays: [...formData.selectedDays],
          }).unwrap()
        }

        closeModal(e)
      } catch (error) {
        setError(error as Error)
      }
    }
  }

  async function handleDelete(e: React.SyntheticEvent) {
    if (isDisabled || !formData.id) {
      return
    }

    if (formData.type === 'APPOINTMENT') {
      try {
        await deleteAppointment({
          deleted: true,
          ownerId: formData.ownerId,
          id: formData.id,
        }).unwrap()

        closeModal(e)
      } catch (error) {
        setError(error as Error)
      }
    }

    if (formData.type === 'WORKOUT') {
      try {
        await deleteWorkout({
          deleted: true,
          ownerId: formData.ownerId,
          id: formData.id,
        }).unwrap()

        closeModal(e)
      } catch (error) {
        setError(error as Error)
      }
    }

    if (formData.type === 'BOOTCAMP') {
      try {
        await deleteBootcamp({
          deleted: true,
          id: formData.id,
        }).unwrap()

        closeModal(e)
      } catch (error) {
        setError(error as Error)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <input type="hidden" value={formData.id} />
      <input required type="hidden" value={userId} />
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
      <div className="flex justify-between">
        <fieldset className="mt-4">
          <legend>Workout Type:</legend>
          <div>
            <input
              type="radio"
              id="WORKOUT"
              name="type"
              value="WORKOUT"
              checked={formData.type === 'WORKOUT'}
              className="mr-2"
              onChange={e =>
                setForm(form => ({
                  ...form,
                  type: e.target.value as EventType,
                }))
              }
            />
            <label htmlFor="WORKOUT">Training</label>
          </div>

          <div>
            <input
              type="radio"
              id="APPOINTMENT"
              name="type"
              checked={formData.type === 'APPOINTMENT'}
              value="APPOINTMENT"
              className="mr-2"
              onChange={e =>
                setForm(form => ({
                  ...form,
                  type: e.target.value as EventType,
                }))
              }
            />
            <label htmlFor="APPOINTMENT">Appointment</label>
          </div>
          <div>
            <input
              type="radio"
              id="BOOTCAMP"
              name="type"
              checked={formData.type === 'BOOTCAMP'}
              value="BOOTCAMP"
              className="mr-2"
              onChange={e =>
                setForm(form => ({
                  ...form,
                  type: e.target.value as EventType,
                }))
              }
            />
            <label htmlFor="BOOTCAMP">Bootcamp</label>
          </div>
        </fieldset>

        {!formData.id && (
          <div className="flex flex-col">
            <div className="mt-4 flex divide-x overflow-hidden rounded-lg border bg-white rtl:flex-row-reverse dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-900">
              <button
                type="button"
                onClick={() => toggleDay(1)}
                className={clsx(
                  'px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 dark:text-gray-300 dark:hover:bg-gray-800 sm:text-base',
                  {
                    'bg-blue-300 hover:bg-blue-100':
                      formData.selectedDays.has(1),
                    'hover:bg-gray-100': !formData.selectedDays.has(1),
                  },
                )}
              >
                M
              </button>

              <button
                type="button"
                onClick={() => toggleDay(2)}
                className={clsx(
                  'px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 dark:text-gray-300 dark:hover:bg-gray-800 sm:text-base',
                  {
                    'bg-blue-300 hover:bg-blue-100':
                      formData.selectedDays.has(2),
                    'hover:bg-gray-100': !formData.selectedDays.has(2),
                  },
                )}
              >
                T
              </button>

              <button
                type="button"
                onClick={() => toggleDay(3)}
                className={clsx(
                  'px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 dark:text-gray-300 dark:hover:bg-gray-800 sm:text-base',
                  {
                    'bg-blue-300 hover:bg-blue-100':
                      formData.selectedDays.has(3),
                    'hover:bg-gray-100': !formData.selectedDays.has(3),
                  },
                )}
              >
                W
              </button>

              <button
                type="button"
                onClick={() => toggleDay(4)}
                className={clsx(
                  'px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 dark:text-gray-300 dark:hover:bg-gray-800 sm:text-base',
                  {
                    'bg-blue-300 hover:bg-blue-100':
                      formData.selectedDays.has(4),
                    'hover:bg-gray-100': !formData.selectedDays.has(4),
                  },
                )}
              >
                T
              </button>

              <button
                type="button"
                onClick={() => toggleDay(5)}
                className={clsx(
                  'px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 dark:text-gray-300 dark:hover:bg-gray-800 sm:text-base',
                  {
                    'bg-blue-300 hover:bg-blue-100':
                      formData.selectedDays.has(5),
                    'hover:bg-gray-100': !formData.selectedDays.has(5),
                  },
                )}
              >
                F
              </button>

              <button
                type="button"
                onClick={() => toggleDay(6)}
                className={clsx(
                  'px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 dark:text-gray-300 dark:hover:bg-gray-800 sm:text-base',
                  {
                    'bg-blue-300 hover:bg-blue-100':
                      formData.selectedDays.has(6),
                    'hover:bg-gray-100': !formData.selectedDays.has(6),
                  },
                )}
              >
                S
              </button>

              <button
                type="button"
                onClick={() => toggleDay(0)}
                className={clsx(
                  'px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 dark:text-gray-300 dark:hover:bg-gray-800 sm:text-base',
                  {
                    'bg-blue-300 hover:bg-blue-100':
                      formData.selectedDays.has(0),
                    'hover:bg-gray-100': !formData.selectedDays.has(0),
                  },
                )}
              >
                S
              </button>
            </div>

            <div className="mt-2">
              Repeat for{' '}
              <input
                className="w-10"
                type="number"
                min="0"
                value={formData.weeksToRepeat}
                onChange={e =>
                  setForm(form => ({
                    ...form,
                    weeksToRepeat: Number(e.target.value),
                  }))
                }
              />{' '}
              {formData.weeksToRepeat === 1 ? 'week.' : 'weeks.'}{' '}
              <div className="text-sm">
                {formData.weeksToRepeat === 0
                  ? "(Don't repeat; this week only.)"
                  : formData.weeksToRepeat === 1
                  ? '(This week and next week.)'
                  : `(${
                      formData.weeksToRepeat + 1
                    } weeks total starting this week.)`}
              </div>
            </div>
          </div>
        )}
      </div>

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
      <div className="mt-4 flex justify-between">
        <Button
          type="submit"
          disabled={isDisabled || !userId}
          className="w-full max-w-xs self-center"
        >
          {isUpdating
            ? 'Updating...'
            : isCreating
            ? 'Creating...'
            : formData.id
            ? 'Update'
            : 'Create'}
        </Button>
        {formData.id && (
          <>
            <Link
              href={`/workout/${formData.id}`}
              className="mx-2 w-full max-w-xs self-center"
              onClick={() => dispatch(resetEvent())}
            >
              <Button
                type="button"
                intent="success"
                disabled={isDisabled}
                className="w-full max-w-xs self-center"
              >
                View
              </Button>
            </Link>
            <Button
              type="button"
              intent="danger"
              onClick={handleDelete}
              disabled={isDisabled}
              className="w-full max-w-xs self-center"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </>
        )}
      </div>
      <pre style={{whiteSpace: 'normal'}}>{error?.message}</pre>
    </form>
  )
}
