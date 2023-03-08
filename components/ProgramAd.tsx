import Image from 'next/image'
import {documentToReactComponents} from '@contentful/rich-text-react-renderer'
import {CtfRichtext} from '@/components/RichText'

function ProgramAd({entry}: any) {
  const {name, image, content, ctaText} = entry.fields

  return (
    <div className="mb-4 bg-[#2c4243] p-2.5 mr-[3%] flex flex-col items-center font-sans md:w-1/3 ">
      <div className="text-center text-white text-xl font-bold mb-5">
        {name}
      </div>
      <Image
        src={`https:${image.fields.file.url}`}
        alt={image.fields.title}
        width={image.fields.file.details.image.width}
        height={image.fields.file.details.image.height}
        className="max-w-full h-auto mb-5"
      />
      <div className="max-w-full text-white text-left mb-5">
        <CtfRichtext document={content} />
      </div>
      <button className="rounded text-white border-solid border-2 border-white font-sans bg-[#00a4e3] text-xl font-medium py-1.5 px-5 mb-5">
        {ctaText}
      </button>
    </div>
  )
}

export default ProgramAd
