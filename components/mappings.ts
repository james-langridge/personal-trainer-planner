import {lazy} from 'react'

export const componentMap = {
  programAd: lazy(() => import('@/components/ProgramAd')),
  programAdBanner: lazy(() => import('@/components/ProgramAdBanner')),
  richText: lazy(() => import('@/components/RichTextComponent')),
  testimonial: lazy(() => import('@/components/Testimonial')),
}
