'use client'

import React from 'react'
import SortSvg from '@/components/SortSvg'
import {isValidKey, keyMap, validKeys} from '@/lib/users'
import {classNames} from '@/lib/misc'
import {useGetTableData} from '@/hooks'

export const dynamic = 'force-dynamic'

export default function ClientsTable() {
  const {users, setSortCol} = useGetTableData()

  function onClick(e: React.MouseEvent) {
    const key = e.currentTarget.id

    if (isValidKey(key)) {
      setSortCol(key)
    }
  }

  return (
    <>
      <h1 className="prose text-6xl font-bold leading-normal">
        Clients: {users && users.length}
      </h1>
      <section className="container mx-auto px-4">
        <div className="mt-6 flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      {validKeys.map(key => {
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
                    {users &&
                      users.map(user => {
                        return (
                          <tr key={user.id}>
                            {validKeys.map(key => {
                              return (
                                <td
                                  key={key}
                                  className={classNames(
                                    'whitespace-nowrap px-4 py-4 text-sm',
                                    key === 'firstName' || key === 'lastName'
                                      ? 'capitalize'
                                      : '',
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
    </>
  )
}
