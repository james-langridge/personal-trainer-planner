'use client'

import clsx from 'clsx'
import Link from 'next/link'
import {redirect} from 'next/navigation'
import {useSession} from 'next-auth/react'
import React from 'react'

import Container from '@/components/Container'
import Loader from '@/components/Loader'
import SortSvg from '@/components/SortSvg'
import {useSortUsers} from '@/hooks'
import {monthNames, userKeyMap, userKeys} from '@/lib/constants'
import {isValidKey} from '@/lib/users'

export default function Users() {
  const now = new Date()
  const {sortedUsers, setSortCol, setMonth, setYear, month, year} =
    useSortUsers({
      initialMonth: now.getMonth(),
      initialYear: now.getFullYear(),
    })
  const {data: session, status} = useSession()

  if (status === 'loading') {
    return <Loader />
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
    redirect('/')
  }

  function onClick(e: React.MouseEvent) {
    const key = e.currentTarget.id

    if (isValidKey(key)) {
      setSortCol({key})
    }
  }

  function decrementMonth() {
    if (month === 0) {
      setMonth(() => 11)
      setYear(year => year - 1)
    } else {
      setMonth(month => month - 1)
    }
  }

  function incrementMonth() {
    if (month === 11) {
      setMonth(() => 0)
      setYear(year => year + 1)
    } else {
      setMonth(month => month + 1)
    }
  }

  return (
    <Container>
      <div className="flex justify-center">
        <div className="flex flex-row items-center text-2xl">
          <button
            onClick={decrementMonth}
            className="mx-1 flex transform items-center justify-center rounded-md bg-white px-4 py-2 text-gray-700 transition-colors duration-300 hover:bg-blue-500 hover:text-white rtl:-scale-x-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-blue-500 dark:hover:text-gray-200"
            data-testid={'prevMonthBtn'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <p data-testid={'heading'} className="mx-5">
            {monthNames[month]} {year}
          </p>

          <button
            onClick={incrementMonth}
            className="mx-1 flex transform items-center justify-center rounded-md bg-white px-4 py-2 text-gray-700 transition-colors duration-300 hover:bg-blue-500 hover:text-white rtl:-scale-x-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-blue-500 dark:hover:text-gray-200"
            data-testid={'nextMonthBtn'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
      <section className="container mx-auto px-4">
        <div className="mt-6 flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="relative px-4 py-3.5">
                        <span className="sr-only">Edit</span>
                      </th>
                      {userKeys.map(key => {
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
                              <span>{userKeyMap[key]}</span>
                              <SortSvg />
                            </button>
                          </th>
                        )
                      })}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                    {sortedUsers?.map(user => {
                      return (
                        <tr key={user.id}>
                          <td className="whitespace-nowrap px-4 py-4 text-sm">
                            <div className="flex items-center gap-x-6">
                              <Link
                                className="text-gray-500 transition-colors duration-200 hover:text-yellow-500 focus:outline-none dark:text-gray-300 dark:hover:text-yellow-500"
                                href={`/users/${user.id}`}
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
                          {userKeys.map(key => {
                            return (
                              <td
                                key={key}
                                className={clsx(
                                  'whitespace-nowrap px-4 py-4 text-sm',
                                  {capitalize: key === 'name'},
                                )}
                              >
                                <div>
                                  <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
                                    {user[key]}
                                  </p>
                                </div>
                              </td>
                            )
                          })}
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
    </Container>
  )
}
