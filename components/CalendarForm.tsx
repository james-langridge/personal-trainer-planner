import {WORKOUT_TYPE} from '@prisma/client'
import Link from 'next/link'
import React, {useEffect} from 'react'

import {useUser} from '@/app/Providers'
import Info from '@/components/Info'
import {useCalendarForm, useStatus, useUserWorkouts} from '@/hooks'
import {createWorkout, updateWorkout} from '@/lib/api'

export function CalendarForm() {
  const userState = useUser()
  const userId = userState?.user?.id ?? ''
  const [refreshUserWithWorkouts] = useUserWorkouts()
  const [workout, setWorkout, resetForm] = useCalendarForm()
  const {status, mode, setMode, error, setStatus, setError, resetStatus} =
    useStatus()
  const isDisabled = status !== 'idle'

  useEffect(() => {
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
        await updateWorkout(workout)
      } else {
        setMode('createWorkout')
        await createWorkout(workout)
      }

      setStatus('resolved')

      void refreshUserWithWorkouts()
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
      await updateWorkout({...workout, deleted: 'true'})

      setStatus('resolved')

      void refreshUserWithWorkouts()
    } catch (error) {
      setStatus('rejected')
      setError(error as Error)
    } finally {
      resetForm()
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
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
          placeholder="Date"
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
        <button
          disabled={isDisabled || !userId}
          type="submit"
          className="mt-4 w-full transform rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium capitalize tracking-wide text-white transition-colors duration-300 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 enabled:hover:bg-blue-400"
        >
          {workout.workoutId ? 'Update' : 'Create'}
        </button>
        {workout.workoutId && (
          <>
            <button
              disabled={isDisabled}
              type="button"
              onClick={handleDelete}
              className="mt-4 w-full transform rounded-lg bg-red-500 px-6 py-3 text-sm font-medium capitalize tracking-wide text-white transition-colors duration-300 hover:bg-red-400 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-50"
            >
              Delete
            </button>
            <Link href={`/workout/${workout.workoutId}`}>
              <button
                disabled={isDisabled}
                type="button"
                className="mt-4 w-full transform rounded-lg bg-emerald-500 px-6 py-3 text-sm font-medium capitalize tracking-wide text-white transition-colors duration-300 hover:bg-emerald-400 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-50"
              >
                View
              </button>
            </Link>
          </>
        )}
        <button
          disabled={isDisabled}
          type="button"
          onClick={resetForm}
          className="mt-4 w-full transform rounded-lg bg-yellow-500 px-6 py-3 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-yellow-400 focus:outline-none focus:ring focus:ring-yellow-300 focus:ring-opacity-50"
        >
          Reset form
        </button>
      </form>
    </>
  )
}
