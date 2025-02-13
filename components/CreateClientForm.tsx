'use client'

import {USER_TYPE} from '@prisma/client'
import {useCallback, useEffect, useRef, useState} from 'react'

import {createUser} from '@/app/actions/users'

const initialForm: {
  billingEmail: string
  email: string
  fee: string
  name: string
  type: USER_TYPE
} = {
  billingEmail: '',
  email: '',
  fee: '0.00',
  name: '',
  type: USER_TYPE.INDIVIDUAL,
}

export function CreateClientForm() {
  const [form, setForm] = useState({...initialForm})
  const [error, setError] = useState<Error>()
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault()

      setIsLoading(true)

      try {
        await createUser({
          ...form,
          email: form.email.toLowerCase(),
          billingEmail: form.billingEmail.toLowerCase(),
          fee: Math.round(parseFloat(form.fee) * 100),
        })

        setForm(initialForm)
      } catch (error) {
        setError(error as Error)
      }

      setIsLoading(false)
    },
    [createUser, form, setError],
  )

  return (
    <form onSubmit={handleSubmit}>
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
          ref={inputRef}
          onChange={e =>
            setForm(form => ({
              ...form,
              name: e.target.value,
            }))
          }
          type="text"
          className="block w-full rounded-lg border bg-white px-11 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
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
              billingEmail: e.target.value,
            }))
          }
          type="email"
          className="block w-full rounded-lg border bg-white px-11 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
          placeholder="Email address"
          value={form.email}
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
              billingEmail: e.target.value,
            }))
          }
          type="email"
          className="block w-full rounded-lg border bg-white px-11 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
          placeholder="Billing email address"
          value={form.billingEmail}
        />
      </div>

      <div className="relative mt-4 flex items-center">
        <p className="rounded-l-lg border border-r-0 bg-gray-100 px-3 py-2.5 text-gray-500 rtl:rounded-l-none rtl:rounded-r-lg rtl:border-l-0 rtl:border-r dark:border-gray-700 dark:bg-gray-800">
          Fee
        </p>

        <input
          onChange={e =>
            setForm(form => ({
              ...form,
              fee: e.target.value,
            }))
          }
          type="number"
          className="block w-full rounded-lg rounded-l-none border border-gray-200 bg-white px-5 py-2.5 text-gray-700 placeholder-gray-400/70 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 rtl:rounded-l-lg rtl:rounded-r-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:placeholder-gray-500 dark:focus:border-blue-300"
          placeholder="0.00"
          value={form.fee}
        />
      </div>

      <div className="relative mt-4 flex items-center">
        <input
          onChange={() => {
            if (form.type === USER_TYPE.BOOTCAMP) {
              setForm(form => ({
                ...form,
                type: USER_TYPE.INDIVIDUAL,
              }))
            }
            if (form.type === USER_TYPE.INDIVIDUAL) {
              setForm(form => ({
                ...form,
                type: USER_TYPE.BOOTCAMP,
              }))
            }
          }}
          type="checkbox"
          checked={form.type === USER_TYPE.BOOTCAMP}
          className="mr-2 h-7 w-7 rounded"
        />
        <div className="text-lg">Bootcamper</div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="w-full transform rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium capitalize tracking-wide text-white transition-colors duration-300 hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 disabled:cursor-wait"
          disabled={isLoading}
        >
          {isLoading ? 'Creating client...' : 'Create client'}
        </button>
      </div>
      <pre style={{whiteSpace: 'normal'}}>{error?.message}</pre>
    </form>
  )
}
