'use client'

import Link from 'next/link'
import {useSession} from 'next-auth/react'
import React from 'react'

import SortSvg from '@/components/SortSvg'
import {useSortWorkouts} from '@/hooks'
import {workoutKeys, workoutKeyMap} from '@/lib/constants'
import {isValidKey} from '@/lib/workouts'

export default function UserDetails({params}: {params: {slug: string}}) {
  const {slug} = params
  const {data: session, status} = useSession()

  const {sortedWorkouts, user, setSortCol} = useSortWorkouts(slug)

  if (status === 'loading') {
    return <p>Loading...</p>
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
    return <p>Access Denied</p>
  }

  if (!user) {
    return null
  }

  function onClick(e: React.MouseEvent) {
    const key = e.currentTarget.id

    if (isValidKey(key)) {
      setSortCol({key})
    }
  }

  return (
    <div className="p-5">
      <h1 className="mb-5 text-6xl font-bold capitalize">{user.name}</h1>
      <div className="m-2 max-w-fit border p-2">
        <div>Email: {user.email}</div>
        <div>Workouts assigned: {user.workoutsAssigned}</div>
        <div>Workouts completed: {user.workoutsCompleted}</div>
        <div>Appointments: {user.appointments}</div>
        <div>Appointments attended: {user.appointmentsAttended}</div>
      </div>

      <section className="container mx-auto px-4">
        <div className="mt-6 flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      {workoutKeys.map(key => {
                        return (
                          <th
                            key={key}
                            scope="col"
                            className="px-4 py-3.5 text-left text-sm font-normal text-gray-500 rtl:text-right dark:text-gray-400"
                          >
                            <button
                              id={key}
                              onClick={e => onClick(e)}
                              className="flex items-center justify-start gap-x-3 focus:outline-none"
                            >
                              <span>{workoutKeyMap[key]}</span>
                              <SortSvg />
                            </button>
                          </th>
                        )
                      })}
                      <th scope="col" className="relative px-4 py-3.5">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                    {sortedWorkouts?.map(workout => {
                      return (
                        <tr key={workout.id}>
                          {workoutKeys.map(key => {
                            return (
                              <td
                                key={key}
                                className="whitespace-normal px-4 py-4 text-sm"
                              >
                                <div>
                                  <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
                                    {workout[key]}
                                  </p>
                                </div>
                              </td>
                            )
                          })}
                          <td className="whitespace-nowrap px-4 py-4 text-sm">
                            <div className="flex items-center gap-x-6">
                              <Link
                                className="text-gray-500 transition-colors duration-200 hover:text-yellow-500 focus:outline-none dark:text-gray-300 dark:hover:text-yellow-500"
                                href={`/workout/${workout.id}`}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                  className="h-5 w-5"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                  />
                                </svg>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
