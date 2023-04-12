import {Entry} from 'contentful'
import {IHeroSideImageFields} from '@/@types/generated/contentful'
import Link from 'next/link'

interface Props {
  entry: Entry<IHeroSideImageFields>
}

export function CtfHeroSideImage({entry}: Props) {
  const {
    headline,
    subheading,
    leftButtonLink = 'getting-started',
    leftButtonCta = 'Get Started',
    rightButtonLink = 'about',
    rightButtonCta = 'Learn More',
    image,
  } = entry.fields

  return (
    <header className="bg-white dark:bg-gray-900">
      <div className="lg:flex">
        <div className="flex w-full items-center justify-center px-6 py-8 lg:h-[32rem] lg:w-1/2">
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-white lg:text-4xl">
              {headline}
            </h2>

            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 lg:text-base">
              {subheading}
            </p>

            <div className="mt-6 flex flex-col space-y-3 lg:flex-row lg:space-y-0">
              <Link
                href={leftButtonLink}
                className="block transform rounded-md bg-gray-900 px-5 py-2 text-center text-sm font-medium tracking-wider text-white transition-colors duration-300 hover:bg-gray-700"
              >
                {leftButtonCta}
              </Link>
              <Link
                // TODO: move prefetch and target options to contentful
                target="_blank"
                prefetch={false}
                href={rightButtonLink}
                className="block transform rounded-md bg-gray-200 px-5 py-2 text-center text-sm font-medium tracking-wider text-gray-700 transition-colors duration-300 hover:bg-gray-300 lg:mx-4"
              >
                {rightButtonCta}
              </Link>
            </div>
          </div>
        </div>

        <div className="h-64 w-full lg:h-auto lg:w-1/2">
          <div
            className="h-full w-full bg-cover"
            style={{
              backgroundImage: `url(https:${image.fields.file.url})`,
            }}
          >
            <div className="h-full w-full bg-black opacity-25"></div>
          </div>
        </div>
      </div>
    </header>
  )
}
