import {RefObject} from 'react'
import {useIntersectionObserver} from 'usehooks-ts'

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
