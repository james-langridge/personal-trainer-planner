import {Entry} from 'contentful'
import {ICtaSimpleFields} from '@/@types/generated/contentful'
import Link from 'next/link'
import {documentToReactComponents} from '@contentful/rich-text-react-renderer'

interface Props {
  entry: Entry<ICtaSimpleFields>
}

export function CtfCtaSimple({entry}: Props) {
  const {mainText, subText, buttonText, buttonLink} = entry.fields

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="container mx-auto flex flex-col items-center px-4 py-12 text-center">
        <h2 className="mx-auto max-w-2xl text-2xl font-semibold tracking-tight text-gray-800 dark:text-white xl:text-3xl">
          {mainText}
        </h2>

        {subText && (
          <div className="prose mt-6 max-w-4xl text-center text-gray-500 dark:text-gray-300">
            {documentToReactComponents(subText)}
          </div>
        )}

        <div className="mt-6 inline-flex w-full sm:w-auto">
          <Link
            href={buttonLink}
            className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-2 text-white duration-300 hover:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-80"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  )
}
