import {useEffect} from 'react'
import {useIsMobile} from '@/hooks'

export function useLockBodyScroll() {
  const isMobile = useIsMobile()

  useEffect(() => {
    // Lock scroll for large screens
    if (!isMobile) document.body.style.overflow = 'hidden'
    if (isMobile) document.body.style.overflow = 'visible'

    return () => {
      document.body.style.overflow = 'visible'
    }
  }, [isMobile])
}
