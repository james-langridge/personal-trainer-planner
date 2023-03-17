import {IEntry} from '@/@types/generated/contentful'
import React from 'react'
import {Entry} from 'contentful'
import Image from '@/components/Image'
import ProgramAd from '@/components/ProgramAd'
import ProgramAdBanner from '@/components/ProgramAdBanner'
import RichTextComponent from '@/components/RichTextComponent'
import Testimonial from '@/components/Testimonial'
import VideoHero from '@/components/VideoHero'

const componentMap: {[key: string]: React.ComponentType<any>} = {
  image: Image,
  programAd: ProgramAd,
  programAdBanner: ProgramAdBanner,
  richText: RichTextComponent,
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

  for (const field of Object.values(fields)) {
    if (Array.isArray(field)) {
      childrenEntries = field
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
