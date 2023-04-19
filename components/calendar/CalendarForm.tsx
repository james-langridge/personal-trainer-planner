import React, {useEffect} from 'react'
import {createSession, updateSession} from '@/lib/api'
import {SESSION_TYPE} from '@prisma/client'
import {useCalendarForm} from '@/hooks'
import {useMutation, useQueryClient} from '@tanstack/react-query'

export function CalendarForm({
  sessionId,
  userId = '',
}: {
  sessionId?: string
  userId?: string
}) {
  const [session, setSession, resetForm] = useCalendarForm(userId, sessionId)
  const queryClient = useQueryClient()

  useEffect(() => {
    setSession(session => ({
      ...session,
      ownerId: userId,
    }))
  }, [setSession, userId])

  const updateMutation = useMutation({
    mutationFn: updateSession,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['sessions', userId]})
      resetForm()
    },
  })

  const createMutation = useMutation({
    mutationFn: createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['sessions', userId]})
      resetForm()
    },
  })

  const isDisabled =
    createMutation.status === 'loading' || updateMutation.status === 'loading'

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    if (session.sessionId) {
      updateMutation.mutate(session)
    } else {
      createMutation.mutate(session)
    }
  }

  async function handleDelete() {
    updateMutation.mutate({...session, deleted: 'true'})
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="hidden" value={sessionId} />
        <input required type="hidden" value={userId} />
        <input
          required
          onChange={e =>
            setSession(session => ({
              ...session,
              date: e.target.value,
            }))
          }
          placeholder="Date"
          type="date"
          className="mt-4 block w-full rounded-lg border bg-white p-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
          value={session.date}
        />
        <input
          required
          onChange={e =>
            setSession(session => ({
              ...session,
              name: e.target.value,
            }))
          }
          placeholder="Session name"
          className="mt-4 block w-full rounded-lg border bg-white p-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
          value={session.name}
        />
        <fieldset className="mt-4">
          <legend>Session Type:</legend>
          <div>
            <input
              type="radio"
              id={SESSION_TYPE.TRAINING}
              name="sessionType"
              value={SESSION_TYPE.TRAINING}
              checked={session.sessionType === SESSION_TYPE.TRAINING}
              className="mr-2"
              onChange={e =>
                setSession(session => ({
                  ...session,
                  sessionType: e.target.value as SESSION_TYPE,
                }))
              }
            />
            <label htmlFor={SESSION_TYPE.TRAINING}>Training</label>
          </div>

          <div>
            <input
              type="radio"
              id={SESSION_TYPE.APPOINTMENT}
              name="sessionType"
              checked={session.sessionType === SESSION_TYPE.APPOINTMENT}
              value={SESSION_TYPE.APPOINTMENT}
              className="mr-2"
              onChange={e =>
                setSession(session => ({
                  ...session,
                  sessionType: e.target.value as SESSION_TYPE,
                }))
              }
            />
            <label htmlFor={SESSION_TYPE.APPOINTMENT}>Appointment</label>
          </div>
        </fieldset>
        <textarea
          onChange={e =>
            setSession(session => ({
              ...session,
              description: e.target.value,
            }))
          }
          placeholder="Description"
          rows={5}
          cols={15}
          className="mt-4 block w-full rounded-lg border bg-white p-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
          value={session.description}
        />
        <input
          onChange={e =>
            setSession(session => ({
              ...session,
              videoUrl: e.target.value,
            }))
          }
          placeholder="Video url"
          type="url"
          className="mt-4 block w-full rounded-lg border bg-white p-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
          value={session.videoUrl}
        />
        <button
          disabled={isDisabled || !userId}
          type="submit"
          className="mt-4 w-full transform rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium capitalize tracking-wide text-white transition-colors duration-300 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 enabled:hover:bg-blue-400"
        >
          {session.sessionId ? 'Update' : 'Create'}
        </button>
        {session.sessionId && (
          <button
            disabled={isDisabled}
            type="button"
            onClick={handleDelete}
            className="mt-4 w-full transform rounded-lg bg-red-500 px-6 py-3 text-sm font-medium capitalize tracking-wide text-white transition-colors duration-300 hover:bg-red-400 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-50"
          >
            Delete
          </button>
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
