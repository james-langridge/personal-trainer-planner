import {useEffect} from 'react'

export function useLockBodyScroll(dependency: any) {
  useEffect(() => {
    // Lock scroll for large screens
    if (!dependency) document.body.style.overflow = 'hidden'
    if (dependency) document.body.style.overflow = 'visible'
  }, [dependency])
}
