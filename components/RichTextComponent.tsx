import {Entry} from 'contentful'
import {IRichTextFields} from '@/@types/generated/contentful'
import CtfRichtext from '@/components/RichText'

interface Props {
  entry: Entry<IRichTextFields>
}

function RichTextComponent({entry}: Props) {
  const {richText, backgroundColour} = entry.fields

  return (
    <div
      className={
        'w-full ' + backgroundColour ? `bg-[${backgroundColour?.value}]` : ''
      }
    >
      <div className="m-auto my-5 max-w-prose py-10">
        <CtfRichtext document={richText} />
      </div>
    </div>
  )
}

export default RichTextComponent
