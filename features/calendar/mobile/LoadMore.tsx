'use client'

import {useInView} from 'react-intersection-observer'
import {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'

export default function LoadMore({page}: {page: number}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {ref, inView} = useInView({
    threshold: 0.5,
    triggerOnce: true,
  })

  useEffect(() => {
    if (inView && !isLoading) {
      setIsLoading(true)

      // Use Next.js router to update the URL with the new page
      // This will trigger a new server component render
      router.push(`/?page=${page + 1}`, {scroll: false})
    }
  }, [inView, router, page, isLoading])

  return (
    <div ref={ref} className="w-full py-8">
      {isLoading ? (
        <div className="text-center">Loading more posts...</div>
      ) : (
        <div className="text-center">Scroll to load more</div>
      )}
    </div>
  )
}
