import {WORKOUT_TYPE} from '@prisma/client'
import Link from 'next/link'
import React, {useEffect, useState} from 'react'

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
  date,
  closeModal,
}: {
  date: string
  closeModal: (e: React.SyntheticEvent) => void
}) {
  const user = useAppSelector(state => state.users.user)
  const dispatch = useAppDispatch()
  const userId = user?.id
  const [workout, setWorkout, resetForm] = useCalendarForm({date})
  const [error, setError] = useState<Error>()
  const [createWorkout, {isLoading: isCreating}] = useCreateWorkoutMutation()
  const [updateWorkout, {isLoading: isUpdating}] = useUpdateWorkoutMutation()
  const [deleteWorkout, {isLoading: isDeleting}] = useDeleteWorkoutMutation()
  const isDisabled = isCreating || isUpdating || isDeleting

  useEffect(() => {
    if (!userId) {
      return
    }

    setWorkout(workout => ({
      ...workout,
      ownerId: userId,
    }))
  }, [setWorkout, userId])

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    try {
      if (workout.workoutId) {
        await updateWorkout(workout).unwrap()
      } else {
        await createWorkout(workout).unwrap()
      }
    } catch (error) {
      setError(error as Error)
    } finally {
      closeModal(e)
      resetForm()
    }
  }

  async function handleDelete(e: React.SyntheticEvent) {
    if (isDisabled || !workout.workoutId) {
      return
    }

    try {
      await deleteWorkout({
        deleted: true,
        ownerId: workout.ownerId,
        workoutId: workout.workoutId,
      }).unwrap()
    } catch (error) {
      setError(error as Error)
    } finally {
      closeModal(e)
      resetForm()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <input type="hidden" value={workout.workoutId} />
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
        value={workout.description}
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
        value={workout.videoUrl}
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
            : workout.workoutId
            ? 'Update'
            : 'Create'}
        </Button>
        {workout.workoutId && (
          <>
            <Link
              href={`/workout/${workout.workoutId}`}
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
