import {Entry} from 'contentful'
import {IRichTextFields} from '@/@types/generated/contentful'
import CtfRichtext from '@/components/RichText'

interface Props {
  entry: Entry<IRichTextFields>
}

function RichTextComponent({entry}: Props) {
  const {richText} = entry.fields

  return (
    <div className="m-auto max-w-prose">
      <CtfRichtext document={richText} />
    </div>
  )
}

export default RichTextComponent
