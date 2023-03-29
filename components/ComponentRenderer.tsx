import {IEntry} from '@/@types/generated/contentful'
import React from 'react'
import {Entry} from 'contentful'
import Image from '@/components/contentful/Image'
import ProgramAd from '@/components/contentful/ProgramAd'
import ProgramAdBanner from '@/components/contentful/ProgramAdBanner'
import RichText from '@/components/contentful/RichText'
import Testimonial from '@/components/contentful/Testimonial'
import VideoHero from '@/components/contentful/VideoHero'
import HeroImageHeading from '@/components/contentful/HeroImageHeading'
import Contact from '@/components/contentful/Contact'
import HeroSideImage from '@/components/contentful/HeroSideImage'
import CtaForm from '@/components/contentful/CtaForm'
import CtaSimple from '@/components/contentful/CtaSimple'
import HeroBackgroundImage from '@/components/contentful/HeroBackgroundImage'

const componentMap: {[key: string]: React.ComponentType<any>} = {
  contact: Contact,
  ctaForm: CtaForm,
  ctaSimple: CtaSimple,
  heroBackgroundImage: HeroBackgroundImage,
  heroImageHeading: HeroImageHeading,
  heroSideImage: HeroSideImage,
  image: Image,
  programAd: ProgramAd,
  programAdBanner: ProgramAdBanner,
  richText: RichText,
  testimonial: Testimonial,
  videoHeroFeature: VideoHero,
}

export const ComponentRenderer: React.FC<{entry: Entry<IEntry>}> = ({
  entry,
}) => {
  const {contentType} = entry.sys
  const entryType = contentType.sys.id
  const Component = componentMap[entryType]

  if (!Component) {
    return null
  }

  const {fields} = entry
  let childrenEntries: Entry<IEntry>[] = []

  for (const [key, value] of Object.entries(fields)) {
    if (Array.isArray(value) && key !== 'programBenefits') {
      childrenEntries = value
      break
    }
  }

  return (
    <Component entry={entry} key={entry.sys.id}>
      {childrenEntries.length &&
        childrenEntries.map(entry => (
          <ComponentRenderer key={entry.sys.id} entry={entry} />
        ))}
    </Component>
  )
}
