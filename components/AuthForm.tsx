'use client'

import {login, register} from '@/lib/api'
import React, {useCallback, useState} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import Image from 'next/image'
import Info from '@/components/Info'
import {LOGO_URL} from '@/lib/constants'
import {useStatus} from '@/hooks'

const initialForm: {
  firstName: string
  lastName: string
  email: string
  password: string
} = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
}

const registerContent = {
  header: 'Create a new Account',
  buttonText: 'Register',
}

const loginContent = {
  header: 'Welcome Back',
  buttonText: 'Log In',
}

export default function AuthForm({mode}: {mode: 'register' | 'login'}) {
  const [form, setForm] = useState({...initialForm})
  const router = useRouter()
  const content = mode === 'register' ? registerContent : loginContent
  const {status, error, setStatus, setError, resetStatus} = useStatus()

  const handleSubmit = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault()

      setStatus('pending')

      try {
        if (mode === 'register') {
          await register(form)

          setForm(initialForm)
          setStatus('resolved')
        } else {
          await login(form)

          setStatus('resolved')

          router.push('/training-planner')
        }
      } catch (error) {
        setError(error as Error)
        setStatus('rejected')
      }
    },
    [form.email, form.firstName, form.lastName, form.password],
  )

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="container mx-auto mt-5 flex items-center justify-center px-6 sm:mt-20 ">
        <form className="w-full max-w-md" onSubmit={handleSubmit}>
          <Link href="/">
            <Image
              className="h-7 w-auto sm:h-8"
              src={LOGO_URL}
              alt=""
              width={300}
              height={138}
            />
          </Link>

          <h1 className="mt-3 text-2xl font-semibold capitalize text-gray-800 dark:text-white sm:text-3xl">
            {content.header}
          </h1>
          {mode === 'register' && (
            <>
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
                      firstName: e.target.value,
                    }))
                  }
                  type="text"
                  className="block w-full rounded-lg border bg-white py-3 px-11 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
                  placeholder="First name"
                  value={form.firstName}
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </span>

                <input
                  required
                  onChange={e =>
                    setForm(form => ({
                      ...form,
                      lastName: e.target.value,
                    }))
                  }
                  type="text"
                  className="block w-full rounded-lg border bg-white py-3 px-11 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
                  placeholder="Last name"
                  value={form.lastName}
                />
              </div>
            </>
          )}

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
                  password: e.target.value,
                }))
              }
              type="password"
              className="block w-full rounded-lg border bg-white px-10 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
              placeholder="Password"
              value={form.password}
            />
          </div>

          <Info reset={resetStatus} status={status} error={error} mode={mode} />

          <div className="mt-6">
            <button
              type="submit"
              className="w-full transform rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium capitalize tracking-wide text-white transition-colors duration-300 hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
            >
              {content.buttonText}
            </button>
            {mode === 'login' && (
              <div className="mt-6 text-center ">
                <Link
                  href="/contact"
                  className="text-sm text-blue-500 hover:underline dark:text-blue-400"
                >
                  Don’t have an account yet? Contact me!
                </Link>
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}
