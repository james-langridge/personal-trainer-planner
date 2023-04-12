import {Entry} from 'contentful'
import {IHeroBackgroundImageFields} from '@/@types/generated/contentful'
import Link from 'next/link'

interface Props {
  entry: Entry<IHeroBackgroundImageFields>
}

export function CtfHeroBackgroundImage({entry}: Props) {
  const {heading, image, buttonText, buttonLink} = entry.fields

  return (
    <header>
      <div
        className="h-[38rem] w-full bg-cover bg-center"
        style={{
          backgroundImage: `url(https:${image.fields.file.url})`,
        }}
      >
        <div className="flex h-full w-full items-center justify-center bg-gray-900/40">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-white lg:text-4xl">
              {heading}
            </h1>
            <Link href={buttonLink}>
              <button className="mt-4 w-full transform rounded-md bg-blue-600 px-5 py-2 text-sm font-medium capitalize text-white transition-colors duration-300 hover:bg-blue-500 focus:bg-blue-500 focus:outline-none lg:w-auto">
                {buttonText}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
