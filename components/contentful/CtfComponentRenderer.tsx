import React from 'react'
import {
  CtfImage,
  CtfContactPage,
  CtaForm,
  CtfCtaSimple,
  CtfHeroSideImage,
  CtfVideoHero,
  CtfHeroImageHeading,
  CtfHeroBackgroundImage,
  CtfTestimonial,
  CtfRichText,
  CtfProgramAd,
  CtfProgramAdBanner,
} from '@/components/contentful/index'
import {IEntry} from '@/@types/generated/contentful'

const componentMap: {[key: string]: React.ComponentType<any>} = {
  contact: CtfContactPage,
  ctaForm: CtaForm,
  ctaSimple: CtfCtaSimple,
  heroBackgroundImage: CtfHeroBackgroundImage,
  heroImageHeading: CtfHeroImageHeading,
  heroSideImage: CtfHeroSideImage,
  image: CtfImage,
  programAd: CtfProgramAd,
  programAdBanner: CtfProgramAdBanner,
  richText: CtfRichText,
  testimonial: CtfTestimonial,
  videoHeroFeature: CtfVideoHero,
}

export function CtfComponentRenderer({entry}: {entry: IEntry}) {
  const {contentType} = entry.sys
  const entryType = contentType.sys.id
  const Component = componentMap[entryType]

  if (!Component) {
    return null
  }

  const {fields} = entry
  let childrenEntries = []

  for (const value of Object.values(fields)) {
    if (
      Array.isArray(value) &&
      typeof value[0] === 'object' &&
      'sys' in value[0]
    ) {
      childrenEntries = value
      break
    }
  }

  return (
    <Component entry={entry} key={entry.sys.id}>
      {childrenEntries.length &&
        childrenEntries.map(entry => (
          <CtfComponentRenderer key={entry.sys.id} entry={entry} />
        ))}
    </Component>
  )
}
