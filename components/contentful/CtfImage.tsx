import {Entry} from 'contentful'
import {IImageFields} from '@/@types/generated/contentful'
import Image from 'next/image'

interface Props {
  entry: Entry<IImageFields>
}

export function CtfImage({entry}: Props) {
  const {
    image: {fields},
  } = entry.fields

  return (
    <Image
      src={`https:${fields.file.url}`}
      alt={fields.title}
      width={fields.file.details.image?.width}
      height={fields.file.details.image?.height}
      className="m-auto my-5 rounded"
    />
  )
}
