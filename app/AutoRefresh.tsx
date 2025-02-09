'use client'

import {useEffect} from 'react'
import {useRouter} from 'next/navigation'

export function AutoRefresh({intervalMs = 60000}) {
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh()
    }, intervalMs)

    return () => clearInterval(interval)
  }, [router, intervalMs])

  return null
}
