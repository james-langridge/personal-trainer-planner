import {useIntersectionObserver} from '@/hooks'
import {RefObject} from 'react'

export function useCalendarIntersectionObserver(
  startElementRef: RefObject<Element>,
  endElementRef: RefObject<Element>,
) {
  const startEntry = useIntersectionObserver(startElementRef, {})
  const endEntry = useIntersectionObserver(endElementRef, {})
  const isStartVisible = !!startEntry?.isIntersecting
  const isEndVisible = !!endEntry?.isIntersecting

  return {isStartVisible, isEndVisible}
}
