import {Entry} from 'contentful'
import {IRichTextFields} from '@/@types/generated/contentful'
import {documentToReactComponents} from '@contentful/rich-text-react-renderer'

interface Props {
  entry: Entry<IRichTextFields>
}

export function CtfRichText({entry}: Props) {
  const {richText, backgroundColour} = entry.fields

  return (
    <div
      className={
        'flex justify-center' +
        (backgroundColour ? ` bg-[${backgroundColour?.value}]` : '')
      }
    >
      <div
        className={
          'prose p-6 dark:prose-invert' +
          (backgroundColour
            ? ` text-white prose-headings:text-white prose-blockquote:text-white`
            : '')
        }
      >
        {documentToReactComponents(richText)}
      </div>
    </div>
  )
}
