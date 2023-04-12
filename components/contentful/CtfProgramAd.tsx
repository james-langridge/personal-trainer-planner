import Image from 'next/image'
import {Entry} from 'contentful'
import {IProgramAdFields} from '@/@types/generated/contentful'
import {documentToReactComponents} from '@contentful/rich-text-react-renderer'

interface Props {
  entry: Entry<IProgramAdFields>
}

export function CtfProgramAd({entry}: Props) {
  const {name, image, content, ctaText} = entry.fields

  return (
    <div className="mb-4 mr-[3%] flex flex-col items-center bg-[#2c4243] p-2.5 font-sans md:w-1/3">
      <div className="mb-5 text-center text-xl font-bold text-white">
        {name}
      </div>
      <Image
        src={`https:${image.fields.file.url}`}
        alt={image.fields.title}
        width={image.fields.file.details.image?.width}
        height={image.fields.file.details.image?.height}
        className="mb-5 h-auto max-w-full"
      />
      <div className="prose mb-5 max-w-full text-left text-white">
        {documentToReactComponents(content)}
      </div>
      <button className="mb-5 rounded border-2 border-solid border-white bg-[#00a4e3] py-1.5 px-5 font-sans text-xl font-medium text-white">
        {ctaText}
      </button>
    </div>
  )
}
