import {Entry} from 'contentful'
import {IRichTextFields} from '@/@types/generated/contentful'
import {documentToReactComponents} from '@contentful/rich-text-react-renderer'

interface Props {
  entry: Entry<IRichTextFields>
}

function RichText({entry}: Props) {
  const {richText, backgroundColour} = entry.fields

  return (
    <div
      className={
        'prose m-auto w-full p-6' +
        (backgroundColour ? ` bg-[${backgroundColour?.value}]` : '')
      }
    >
      {documentToReactComponents(richText)}
    </div>
  )
}

export default RichText
