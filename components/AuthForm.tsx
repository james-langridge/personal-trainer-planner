'use client'

import {signin} from '@/lib/api'
import React, {useCallback, useState} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import Image from 'next/image'
import Info from '@/components/Info'

const initialState = {
  status: 'idle',
  form: {email: '', password: ''},
  error: null,
}

export default function AuthForm() {
  const [state, setState] = useState({...initialState})
  const {status, form, error} = state

  const router = useRouter()
  const handleSubmit = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault()

      setState({...state, status: 'pending'})

      await signin(form).then(
        () => {
          setState({
            ...initialState,
            status: 'resolved',
          })
          // TODO: reroute to page behind login
          router.replace('/home')
        },
        error =>
          setState({
            ...initialState,
            status: 'rejected',
            error,
          }),
      )
    },
    [form.email, form.password],
  )

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="container mx-auto mt-5 flex items-center justify-center px-6 sm:mt-20 ">
        <form className="w-full max-w-md" onSubmit={handleSubmit}>
          <Image
            className="h-7 w-auto sm:h-8"
            src="https://images.ctfassets.net/5ct6f2q9wwt3/2dQg3rHxURIhQCjK3Oxds2/10460c53028ab886bd8a1c925459cf53/FFLTrainer-logo-V1.png"
            alt=""
            width={300}
            height={138}
          />

          <h1 className="mt-3 text-2xl font-semibold capitalize text-gray-800 dark:text-white sm:text-3xl">
            Sign In
          </h1>

          <div className="relative mt-8 flex items-center">
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
              onChange={e =>
                setState({
                  ...state,
                  form: {...state.form, email: e.target.value},
                })
              }
              type="email"
              className="block w-full rounded-lg border bg-white py-3 px-11 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
              placeholder="Email address"
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
              onChange={e =>
                setState({
                  ...state,
                  form: {...state.form, password: e.target.value},
                })
              }
              type="password"
              className="block w-full rounded-lg border bg-white px-10 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
              placeholder="Password"
            />
          </div>

          <Info status={status} error={error} mode="login" />

          <div className="mt-6">
            <button
              type="submit"
              className="w-full transform rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium capitalize tracking-wide text-white transition-colors duration-300 hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
            >
              Sign in
            </button>

            <div className="mt-6 text-center ">
              <Link
                href="/contact"
                className="text-sm text-blue-500 hover:underline dark:text-blue-400"
              >
                Don’t have an account yet? Contact me!
              </Link>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}
