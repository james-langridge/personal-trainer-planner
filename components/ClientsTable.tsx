'use client'

import React, {useState} from 'react'
import SortSvg from '@/components/SortSvg'
import {
  isValidKey,
  keyMap,
  SerialisedUser,
  sortUsers,
  validKeys,
} from '@/lib/users'

export default function ClientsTable({
  initialUsers,
}: {
  initialUsers: SerialisedUser[]
}) {
  const [users, setUsers] = useState(initialUsers)

  function onClick(e: React.MouseEvent) {
    const key = e.currentTarget.id

    if (isValidKey(key)) {
      const sortedUsers = sortUsers(key, [...users])

      setUsers(sortedUsers)
    }
  }

  return (
    <section className="container mx-auto px-4">
      <div className="mt-6 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    {validKeys.map(key => {
                      if (key === 'id') {
                        return null
                      }

                      return (
                        <th
                          key={key}
                          scope="col"
                          className="py-3.5 px-4 text-left text-sm font-normal text-gray-500 rtl:text-right dark:text-gray-400"
                        >
                          <button
                            id={key}
                            onClick={e => onClick(e)}
                            className="flex items-center gap-x-3 focus:outline-none"
                          >
                            <span>{keyMap[key]}</span>
                            <SortSvg />
                          </button>
                        </th>
                      )
                    })}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                  {users.map(user => {
                    return (
                      <tr key={user.id}>
                        {validKeys.map(key => {
                          if (key === 'id') {
                            return null
                          }

                          return (
                            <td
                              key={key}
                              className="whitespace-nowrap px-4 py-4 text-sm"
                            >
                              <div>
                                <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
                                  {user[key]?.toString()}
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
  )
}
