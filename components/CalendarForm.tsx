import {WORKOUT_TYPE} from '@prisma/client'
import Link from 'next/link'
import React, {useEffect} from 'react'

import Button from '@/components/Button'
import Info from '@/components/Info'
import {useCalendarForm, useStatus} from '@/hooks'
import {
  useCreateWorkoutMutation,
  useDeleteWorkoutMutation,
  useUpdateWorkoutMutation,
} from '@/redux/apiSlice'
import {useAppSelector} from '@/redux/hooks'

export function CalendarForm({date}: {date: string}) {
  const user = useAppSelector(state => state.users.user)
  const userId = user?.id
  const [workout, setWorkout, resetForm] = useCalendarForm({date})
  const {status, mode, setMode, error, setStatus, setError, resetStatus} =
    useStatus()
  const isDisabled = status !== 'idle'
  const [createWorkout] = useCreateWorkoutMutation()
  const [updateWorkout] = useUpdateWorkoutMutation()
  const [deleteWorkout] = useDeleteWorkoutMutation()

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

    setStatus('pending')

    try {
      if (workout.workoutId) {
        setMode('updateWorkout')
        await updateWorkout(workout).unwrap()
      } else {
        setMode('createWorkout')
        await createWorkout(workout).unwrap()
      }

      setStatus('resolved')
    } catch (error) {
      setStatus('rejected')
      setError(error as Error)
    } finally {
      resetForm()
    }
  }

  async function handleDelete() {
    if (status !== 'idle' || !workout.workoutId) {
      return
    }

    setMode('deleteWorkout')
    setStatus('pending')

    try {
      await deleteWorkout({
        deleted: true,
        ownerId: workout.ownerId,
        workoutId: workout.workoutId,
      }).unwrap()

      setStatus('resolved')
    } catch (error) {
      setStatus('rejected')
      setError(error as Error)
    } finally {
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
      <Info status={status} reset={resetStatus} error={error} mode={mode} />
      <Button
        type="submit"
        disabled={isDisabled || !userId}
        className="mt-4 w-full max-w-xs self-center"
      >
        {workout.workoutId ? 'Update' : 'Create'}
      </Button>
      {workout.workoutId && (
        <>
          <Button
            type="button"
            intent="danger"
            onClick={handleDelete}
            disabled={isDisabled}
            className="mt-4 w-full max-w-xs self-center"
          >
            Delete
          </Button>
          <Link
            href={`/workout/${workout.workoutId}`}
            className="w-full max-w-xs self-center"
          >
            <Button
              type="button"
              intent="success"
              disabled={isDisabled}
              className="mt-4 w-full max-w-xs self-center"
            >
              View
            </Button>
          </Link>
        </>
      )}
      <Button
        intent="warning"
        disabled={isDisabled}
        type="button"
        onClick={resetForm}
        className="mt-4 w-full max-w-xs self-center"
      >
        Reset form
      </Button>
    </form>
  )
}
