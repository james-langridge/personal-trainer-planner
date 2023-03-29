import {Session} from '@prisma/client'
import Link from 'next/link'

export default function SessionItem({session}: {session?: Session}) {
  return (
    <Link
      href={`/session/${session?.id}`}
      className="w-full rounded bg-emerald-400 font-bold text-white"
    >
      {session?.name}
    </Link>
  )
}
