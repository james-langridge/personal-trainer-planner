'use client'

import {Disclosure} from '@headlessui/react'
import {Bars3Icon, XMarkIcon} from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import {signOut, useSession} from 'next-auth/react'

const clientNavigation = [
  {href: '/', name: 'Training planner'},
  {href: '/profile', name: 'Profile'},
]

const adminNavigation = [
  {href: '/admin/calendar', name: 'Training planner'},
  {href: `/admin/users`, name: 'Clients'},
  {href: '/admin/bootcamps', name: 'Bootcamps'},
  {href: '/profile', name: 'Profile'},
]

const logo = {
  src: String(process.env.NEXT_PUBLIC_LOGO_URL),
  alt: 'logo',
  width: 300,
  height: 138,
}

export function Navbar() {
  const {data} = useSession()
  const isAdmin = data?.user?.role === 'admin'
  const navigation = isAdmin ? adminNavigation : clientNavigation

  return (
    <Disclosure as="nav" className="fixed top-0 z-50 w-full bg-gray-800">
      {({open}) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Link href="/">
                    <Image
                      className="hidden h-8 w-auto lg:block"
                      src={logo.src}
                      alt={logo.alt}
                      width={logo.width}
                      height={logo.height}
                    />
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation?.map(item => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                        aria-current={undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                    <button
                      onClick={() => signOut({redirectTo: '/'})}
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Log out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation?.map(item => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  aria-current={undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              <Disclosure.Button
                onClick={() => signOut({redirectTo: '/'})}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                aria-current={undefined}
              >
                Log out
              </Disclosure.Button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
