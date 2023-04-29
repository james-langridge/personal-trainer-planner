'use client'

import {register} from '@/lib/api'
import React, {useCallback, useState} from 'react'
import Info from '@/components/Info'
import {useStatus} from '@/hooks'
import {useSession} from 'next-auth/react'

const initialForm: {
  name: string
  email: string
} = {
  name: '',
  email: '',
}

export default function Register() {
  const [form, setForm] = useState({...initialForm})
  const {status, error, setStatus, setError, resetStatus} = useStatus()
  const {data: session, status: sessionStatus} = useSession()

  const handleSubmit = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault()

      setStatus('pending')

      try {
        await register(form)

        setForm(initialForm)
        setStatus('resolved')
      } catch (error) {
        setError(error as Error)
        setStatus('rejected')
      }
    },
    [form.email, form.name],
  )

  if (sessionStatus === 'loading') {
    return <p>Loading...</p>
  }

  if (sessionStatus === 'unauthenticated' || session?.user?.role !== 'admin') {
    return <p>Access Denied</p>
  }

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="container mx-auto mt-5 flex items-center justify-center px-6 sm:mt-20 ">
        <form className="w-full max-w-md" onSubmit={handleSubmit}>
          <h1 className="mt-3 text-2xl font-semibold capitalize text-gray-800 dark:text-white sm:text-3xl">
            Create a new client
          </h1>

          <div className="relative mt-4 flex items-center">
            <span className="absolute">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-3 h-6 w-6 text-gray-300 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </span>

            <input
              required
              onChange={e =>
                setForm(form => ({
                  ...form,
                  name: e.target.value,
                }))
              }
              type="text"
              className="block w-full rounded-lg border bg-white py-3 px-11 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
              placeholder="Full name"
              value={form.name}
            />
          </div>

          <div className="relative mt-4 flex items-center">
            <span className="absolute">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-3 h-6 w-6 text-gray-300 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </span>

            <input
              required
              onChange={e =>
                setForm(form => ({
                  ...form,
                  email: e.target.value,
                }))
              }
              type="email"
              className="block w-full rounded-lg border bg-white py-3 px-11 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
              placeholder="Email address"
              value={form.email}
            />
          </div>

          <Info
            reset={resetStatus}
            status={status}
            error={error}
            mode="register"
          />

          <div className="mt-6">
            <button
              type="submit"
              className="w-full transform rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium capitalize tracking-wide text-white transition-colors duration-300 hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
            >
              Create client
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
