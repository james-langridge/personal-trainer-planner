import {Menu, Transition} from '@headlessui/react'
import {ChevronDownIcon} from '@heroicons/react/20/solid'
import React, {Fragment} from 'react'

import {useUserDispatch} from '@/app/Providers'
import {useGetUsers} from '@/hooks'
import {classNames} from '@/lib/misc'

export function CalendarDropdown() {
  const dispatch = useUserDispatch()
  const {users} = useGetUsers()

  return (
    <Menu as="div" className="relative mt-4 inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          Select client
          <ChevronDownIcon
            className="-mr-1 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="w-50 absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {users &&
              users.map(user => {
                return (
                  <Menu.Item key={user.id}>
                    {({active}) => (
                      <button
                        onClick={() => dispatch({type: 'setUser', user: user})}
                        className={classNames(
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'block w-44 px-4 py-2 text-sm capitalize',
                        )}
                      >
                        {user.name}
                      </button>
                    )}
                  </Menu.Item>
                )
              })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
