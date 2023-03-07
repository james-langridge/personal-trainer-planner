import Image from 'next/image'
import {documentToReactComponents} from '@contentful/rich-text-react-renderer'

function ProgramAd({entry}: any) {
  const {name, image, content, ctaText} = entry.fields

  return (
    <div>
      <h1>{name}</h1>
      <Image
        src={`https:${image.fields.file.url}`}
        alt={image.fields.title}
        width={image.fields.file.details.image.width}
        height={image.fields.file.details.image.height}
      />
      <div>{documentToReactComponents(content)}</div>
      <button>{ctaText}</button>
    </div>
  )
}

export default ProgramAd
