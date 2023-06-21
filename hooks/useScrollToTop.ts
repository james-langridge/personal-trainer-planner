import {useEffect} from 'react'

export function useScrollToTop() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
}
