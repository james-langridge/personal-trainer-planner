'use client'

import {Disclosure} from '@headlessui/react'
import {Bars3Icon, XMarkIcon} from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image'
import {useRouter} from 'next/navigation'
import {logout} from '@/lib/api'
import {classNames} from '@/lib/misc'

interface Props {
  logo: {
    src: string
    alt: string
    width: number | undefined
    height: number | undefined
  }
  isAdmin?: boolean
}

const adminNavigation = [
  {href: '/training-planner', name: 'Training planner'},
  {href: '/register', name: 'Create client'},
  {href: '/profile', name: 'Profile'},
]

const clientNavigation = [
  {href: '/training-studio', name: 'Training studio'},
  {href: '/profile', name: 'Profile'},
]

export function CalendarNavbarClient({logo, isAdmin}: Props) {
  const {src, alt, width, height} = logo
  const router = useRouter()
  const navigation = isAdmin ? adminNavigation : clientNavigation

  async function handleLogOut() {
    await logout({key: 'static_key'})

    router.push('/')
  }

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
                      className="block h-8 w-auto lg:hidden"
                      src={src}
                      alt={alt + '-mobile'}
                      width={width}
                      height={height}
                    />
                    <Image
                      className="hidden h-8 w-auto lg:block"
                      src={src}
                      alt={alt}
                      width={width}
                      height={height}
                    />
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation?.map(item => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium',
                        )}
                        aria-current={undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogOut}
                      className={classNames(
                        'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium',
                      )}
                    >
                      Log out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation?.map(item => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium',
                  )}
                  aria-current={undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              <Disclosure.Button
                onClick={handleLogOut}
                className={classNames(
                  'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'block rounded-md px-3 py-2 text-base font-medium',
                )}
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
