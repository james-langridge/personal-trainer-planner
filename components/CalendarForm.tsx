'use client'

import React, {useCallback, useEffect, useState} from 'react'
import {createSession} from '@/lib/api'
import Info from '@/components/Info'

export default function CalendarForm({userId = ''}: {userId?: string}) {
  const initialState: {
    status: 'idle' | 'pending' | 'resolved' | 'rejected'
    form: {
      ownerId: string
      date: string
      name: string
      description: string
      videoUrl: string
    }
    error: null | Error
  } = {
    status: 'idle',
    form: {
      ownerId: userId,
      date: '',
      name: '',
      description: '',
      videoUrl: '',
    },
    error: null,
  }
  const [state, setState] = useState({...initialState})
  const {status, form, error} = state

  useEffect(() => {
    setState({
      ...state,
      form: {...state.form, ownerId: userId},
    })
  }, [userId])

  const handleSubmit = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault()

      setState({...state, status: 'pending'})

      try {
        await createSession(form)

        setState({
          ...initialState,
          status: 'resolved',
        })

        // router.replace('/training-studio')
      } catch (error) {
        setState({
          ...initialState,
          status: 'rejected',
          error: error as Error,
        })
      }
    },
    [form.ownerId, form.date, form.name, form.description, form.videoUrl],
  )

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" value={userId} />
      <input
        onChange={e =>
          setState(state => ({
            ...state,
            form: {...state.form, date: e.target.value},
          }))
        }
        placeholder="Date"
        type="date"
        className="mt-4 block w-full rounded-lg border bg-white p-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
        value={form.date}
      />
      <input
        onChange={e =>
          setState(state => ({
            ...state,
            form: {...state.form, name: e.target.value},
          }))
        }
        placeholder="Session name"
        className="mt-4 block w-full rounded-lg border bg-white p-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
        value={form.name}
      />
      <textarea
        onChange={e =>
          setState(state => ({
            ...state,
            form: {...state.form, description: e.target.value},
          }))
        }
        placeholder="Description"
        rows={5}
        cols={15}
        className="mt-4 block w-full rounded-lg border bg-white p-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
        value={form.description}
      />
      <input
        onChange={e =>
          setState(state => ({
            ...state,
            form: {...state.form, videoUrl: e.target.value},
          }))
        }
        placeholder="Video url"
        type="url"
        className="mt-4 block w-full rounded-lg border bg-white p-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
        value={form.videoUrl}
      />
      <Info status={status} error={error} mode="createSession" />
      <button
        type="submit"
        className="mt-4 w-full transform rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium capitalize tracking-wide text-white transition-colors duration-300 hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
      >
        Submit
      </button>
    </form>
  )
}
