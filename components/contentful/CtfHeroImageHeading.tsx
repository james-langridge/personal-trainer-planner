import Image from 'next/image'
import {IHeroImageHeadingFields} from '@/@types/generated/contentful'
import {Entry} from 'contentful'

interface Props {
  entry: Entry<IHeroImageHeadingFields>
}

export function CtfHeroImageHeading({entry}: Props) {
  const {heading, subHeading, programBenefits, image} = entry.fields

  return (
    <header className="bg-white dark:bg-gray-900">
      <div className="container mx-auto flex flex-col space-y-6 px-6 py-10 lg:h-[32rem] lg:flex-row lg:items-center lg:py-16">
        <div className="w-full lg:w-1/2">
          <div className="lg:max-w-lg">
            <h1 className="text-3xl font-semibold tracking-wide text-gray-800 dark:text-white lg:text-4xl">
              {heading}
            </h1>
            {subHeading && (
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                {subHeading}
              </p>
            )}
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {programBenefits?.map(benefit => {
                return (
                  <div
                    key={benefit}
                    className="-px-3 flex items-center text-gray-800 dark:text-gray-200"
                  >
                    <svg
                      className="mx-3 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>

                    <span className="mx-3">{benefit}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex h-96 w-full items-center justify-center lg:w-1/2">
          <Image
            className="h-max w-full max-w-2xl rounded-md object-scale-down"
            src={`https:${image.fields.file.url}`}
            alt={image.fields.title}
            width={image.fields.file.details.image?.width}
            height={image.fields.file.details.image?.height}
          />
        </div>
      </div>
    </header>
  )
}
