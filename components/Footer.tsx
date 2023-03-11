import {Entry} from 'contentful'
import {IFooterFields} from '@/@types/generated/contentful'
import {CtfRichtext} from '@/components/RichText'
import Link from 'next/link'

function Footer({entry}: {entry: Entry<IFooterFields>}) {
  const {leftText} = entry.fields

  return (
    <div className="absolute bottom-0 h-80 w-full">
      <div className="flex justify-center bg-[#333333] p-5 text-white">
        <div className="w-96">
          {leftText && <CtfRichtext document={leftText} />}
        </div>
      </div>
      <div className="flex justify-center bg-[#232323] p-5 font-bold text-[#666666]">
        Site made by&nbsp;
        <Link
          href="https://www.linkedin.com/in/james-langridge/"
          target="_blank"
        >
          James Langridge
        </Link>
      </div>
    </div>
  )
}

export default Footer
