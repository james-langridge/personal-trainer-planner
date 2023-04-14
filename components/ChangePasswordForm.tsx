'use client'

import {updatePassword} from '@/lib/api'
import React, {useCallback, useState} from 'react'
import Info from '@/components/Info'
import {useStatus} from '@/hooks'

export default function ChangePasswordForm({userId}: {userId: string}) {
  const initialForm: {
    id: string
    oldPassword: string
    newPassword: string
    confirmNewPassword: string
  } = {
    id: userId,
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  }

  const [form, setForm] = useState({...initialForm})
  const {status, error, setStatus, setError, resetStatus} = useStatus()

  const handleSubmit = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault()

      setStatus('pending')

      try {
        await updatePassword(form)

        setForm(initialForm)
        setStatus('resolved')
      } catch (error) {
        setError(error as Error)
        setStatus('rejected')
      }
    },
    [form.id, form.newPassword, form.confirmNewPassword, form.oldPassword],
  )

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="container mx-auto mt-5 flex items-center justify-center px-6 sm:mt-20 ">
        <form className="w-full max-w-md" onSubmit={handleSubmit}>
          <h1 className="mt-3 text-2xl font-semibold capitalize text-gray-800 dark:text-white sm:text-3xl">
            Change your password
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </span>

            <input
              required
              onChange={e =>
                setForm(form => ({
                  ...form,
                  oldPassword: e.target.value,
                }))
              }
              type="password"
              className="block w-full rounded-lg border bg-white px-10 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
              placeholder="Old password"
              value={form.oldPassword}
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </span>

            <input
              required
              onChange={e =>
                setForm(form => ({
                  ...form,
                  newPassword: e.target.value,
                }))
              }
              type="password"
              className="block w-full rounded-lg border bg-white px-10 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
              placeholder="New password"
              value={form.newPassword}
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </span>

            <input
              required
              onChange={e =>
                setForm(form => ({
                  ...form,
                  confirmNewPassword: e.target.value,
                }))
              }
              type="password"
              className="block w-full rounded-lg border bg-white px-10 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
              placeholder="Confirm new password"
              value={form.confirmNewPassword}
            />
          </div>

          <Info
            reset={resetStatus}
            status={status}
            error={error}
            mode="changePassword"
          />

          <div className="mt-6">
            <button
              type="submit"
              className="w-full transform rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium capitalize tracking-wide text-white transition-colors duration-300 hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
