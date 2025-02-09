import {useInView} from 'react-intersection-observer'

export function useIntersectionTriggers() {
  const {ref: topRef, inView: isTopVisible} = useInView({
    threshold: 0,
    rootMargin: '200px 0px', // Preload before reaching edge
    // This helps prevent the iOS infinite scroll issue you mentioned
    delay: 500,
  })

  const {ref: bottomRef, inView: isBottomVisible} = useInView({
    threshold: 0,
    rootMargin: '200px 0px',
  })

  return {
    topRef,
    bottomRef,
    isTopVisible,
    isBottomVisible,
  }
}
