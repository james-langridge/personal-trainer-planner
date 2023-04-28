import {classNames} from '@/lib/misc'
import Link from 'next/link'

export default async function Login() {
  return (
    <Link
      href={'/login'}
      className={classNames(
        'text-gray-300 hover:bg-gray-700 hover:text-white',
        'rounded-md px-3 py-2 text-sm font-medium',
      )}
    >
      Log in
    </Link>
  )
}
