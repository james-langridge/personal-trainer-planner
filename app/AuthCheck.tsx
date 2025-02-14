'use client'

import {useSession} from 'next-auth/react'
import {ReactNode} from 'react'
import {useRouter} from 'next/navigation'

export function AuthCheck({
  userIdParam,
  children,
}: {
  userIdParam: string
  children: ReactNode
}) {
  const router = useRouter()
  const {data: session} = useSession()
  const isAdmin = session?.user?.role === 'admin'
  const sessionId = session?.user?.id

  if (sessionId && userIdParam !== sessionId && !isAdmin) {
    router.replace('/')
  }

  if (userIdParam === sessionId || isAdmin) {
    return <>{children}</>
  }
}
