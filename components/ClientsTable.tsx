'use client'

import React from 'react'
import SortSvg from '@/components/SortSvg'
import {keyMap, validKeys} from '@/lib/users'
import {useClientsTableData} from '@/hooks'

export default function ClientsTable() {
  const {data, setSortCol} = useClientsTableData()

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
                      if (key === 'id' || key === 'sessions') {
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
                            onClick={e => setSortCol(e.currentTarget.id)}
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
                  {data &&
                    data.map(user => {
                      return (
                        <tr key={user.id}>
                          {validKeys.map(key => {
                            if (key === 'id' || key === 'sessions') {
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
