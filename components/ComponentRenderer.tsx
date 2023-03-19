import {IEntry} from '@/@types/generated/contentful'
import React from 'react'
import {Entry} from 'contentful'
import Image from '@/components/Image'
import ProgramAd from '@/components/ProgramAd'
import ProgramAdBanner from '@/components/ProgramAdBanner'
import RichText from '@/components/RichText'
import Testimonial from '@/components/Testimonial'
import VideoHero from '@/components/VideoHero'
import Heading from '@/components/Heading'
import Contact from '@/components/Contact'
import HeroSideImage from '@/components/HeroSideImage'

const componentMap: {[key: string]: React.ComponentType<any>} = {
  contact: Contact,
  heroImageHeading: Heading,
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
