import {WORKOUT_TYPE} from '@prisma/client'
import clsx from 'clsx'
import Link from 'next/link'
import React, {useEffect, useRef, useState} from 'react'

import {Day} from '@/@types/types'
import Button from '@/components/Button'
import {useCalendarForm} from '@/hooks'
import {
  useCreateWorkoutMutation,
  useDeleteWorkoutMutation,
  useUpdateWorkoutMutation,
} from '@/redux/apiSlice'
import {useAppDispatch, useAppSelector} from '@/redux/hooks'
import {resetWorkoutId} from '@/redux/workoutSlice'

export function CalendarForm({
  day,
  closeModal,
}: {
  day: Day
  closeModal: (e: React.SyntheticEvent) => void
}) {
  const user = useAppSelector(state => state.users.user)
  const dispatch = useAppDispatch()
  const userId = user?.id
  const [workout, setWorkout, toggleDay] = useCalendarForm({
    day,
  })
  const [error, setError] = useState<Error>()
  const [createWorkout, {isLoading: isCreating}] = useCreateWorkoutMutation()
  const [updateWorkout, {isLoading: isUpdating}] = useUpdateWorkoutMutation()
  const [deleteWorkout, {isLoading: isDeleting}] = useDeleteWorkoutMutation()
  const isDisabled = isCreating || isUpdating || isDeleting
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!userId) {
      return
    }

    setWorkout(workout => ({
      ...workout,
      ownerId: userId,
    }))
  }, [setWorkout, userId])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    try {
      if (workout.id) {
        await updateWorkout(workout).unwrap()
      } else {
        await createWorkout({
          ...workout,
          selectedDays: [...workout.selectedDays],
        }).unwrap()
      }

      closeModal(e)
    } catch (error) {
      setError(error as Error)
    }
  }

  async function handleDelete(e: React.SyntheticEvent) {
    if (isDisabled || !workout.id) {
      return
    }

    try {
      await deleteWorkout({
        deleted: true,
        ownerId: workout.ownerId,
        id: workout.id,
      }).unwrap()

      closeModal(e)
    } catch (error) {
      setError(error as Error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <input type="hidden" value={workout.id} />
      <input required type="hidden" value={userId} />
      <input
        required
        onChange={e =>
          setWorkout(workout => ({
            ...workout,
            date: e.target.value,
          }))
        }
        type="date"
        className="mt-4 block w-full rounded-lg border bg-white p-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
        value={workout.date}
      />
      <input
        required
        ref={inputRef}
        onChange={e =>
          setWorkout(workout => ({
            ...workout,
            name: e.target.value,
          }))
        }
        placeholder="Workout name"
        className="mt-4 block w-full rounded-lg border bg-white p-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
        value={workout.name}
      />
      <div className="flex justify-between">
        <fieldset className="mt-4">
          <legend>Workout Type:</legend>
          <div>
            <input
              type="radio"
              id={WORKOUT_TYPE.TRAINING}
              name="type"
              value={WORKOUT_TYPE.TRAINING}
              checked={workout.type === WORKOUT_TYPE.TRAINING}
              className="mr-2"
              onChange={e =>
                setWorkout(workout => ({
                  ...workout,
                  type: e.target.value as WORKOUT_TYPE,
                }))
              }
            />
            <label htmlFor={WORKOUT_TYPE.TRAINING}>Training</label>
          </div>

          <div>
            <input
              type="radio"
              id={WORKOUT_TYPE.APPOINTMENT}
              name="type"
              checked={workout.type === WORKOUT_TYPE.APPOINTMENT}
              value={WORKOUT_TYPE.APPOINTMENT}
              className="mr-2"
              onChange={e =>
                setWorkout(workout => ({
                  ...workout,
                  type: e.target.value as WORKOUT_TYPE,
                }))
              }
            />
            <label htmlFor={WORKOUT_TYPE.APPOINTMENT}>Appointment</label>
          </div>
        </fieldset>

        {!workout.id && (
          <div className="flex flex-col">
            <div className="mt-4 flex divide-x overflow-hidden rounded-lg border bg-white rtl:flex-row-reverse dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-900">
              <button
                type="button"
                onClick={() => toggleDay(1)}
                className={clsx(
                  'px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 dark:text-gray-300 dark:hover:bg-gray-800 sm:text-base',
                  {
                    'bg-blue-300 hover:bg-blue-100':
                      workout.selectedDays.has(1),
                    'hover:bg-gray-100': !workout.selectedDays.has(1),
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
                      workout.selectedDays.has(2),
                    'hover:bg-gray-100': !workout.selectedDays.has(2),
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
                      workout.selectedDays.has(3),
                    'hover:bg-gray-100': !workout.selectedDays.has(3),
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
                      workout.selectedDays.has(4),
                    'hover:bg-gray-100': !workout.selectedDays.has(4),
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
                      workout.selectedDays.has(5),
                    'hover:bg-gray-100': !workout.selectedDays.has(5),
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
                      workout.selectedDays.has(6),
                    'hover:bg-gray-100': !workout.selectedDays.has(6),
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
                      workout.selectedDays.has(0),
                    'hover:bg-gray-100': !workout.selectedDays.has(0),
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
                value={workout.weeksToRepeat}
                onChange={e =>
                  setWorkout(workout => ({
                    ...workout,
                    weeksToRepeat: Number(e.target.value),
                  }))
                }
              />{' '}
              {workout.weeksToRepeat === 1 ? 'week.' : 'weeks.'}{' '}
              <div className="text-sm">
                {workout.weeksToRepeat === 0
                  ? "(Don't repeat; this week only.)"
                  : workout.weeksToRepeat === 1
                  ? '(This week and next week.)'
                  : `(${
                      workout.weeksToRepeat + 1
                    } weeks total starting this week.)`}
              </div>
            </div>
          </div>
        )}
      </div>

      <textarea
        onChange={e =>
          setWorkout(workout => ({
            ...workout,
            description: e.target.value,
          }))
        }
        placeholder="Description"
        rows={5}
        cols={15}
        className="mt-4 block w-full rounded-lg border bg-white p-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
        value={workout.description ?? ''}
      />
      <input
        onChange={e =>
          setWorkout(workout => ({
            ...workout,
            videoUrl: e.target.value,
          }))
        }
        placeholder="Video url"
        type="url"
        className="mt-4 block w-full rounded-lg border bg-white p-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
        value={workout.videoUrl ?? ''}
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
            : workout.id
            ? 'Update'
            : 'Create'}
        </Button>
        {workout.id && (
          <>
            <Link
              href={`/workout/${workout.id}`}
              className="mx-2 w-full max-w-xs self-center"
              onClick={() => dispatch(resetWorkoutId())}
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
