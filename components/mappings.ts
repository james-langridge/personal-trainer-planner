import React, {lazy} from 'react'

export const componentMap: {[key: string]: React.ComponentType<any>} = {
  image: lazy(() => import('@/components/Image')),
  programAd: lazy(() => import('@/components/ProgramAd')),
  programAdBanner: lazy(() => import('@/components/ProgramAdBanner')),
  richText: lazy(() => import('@/components/RichTextComponent')),
  testimonial: lazy(() => import('@/components/Testimonial')),
  videoHeroFeature: lazy(() => import('@/components/VideoHero')),
}
