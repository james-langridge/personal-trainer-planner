import {Entry} from 'contentful'
import {ICtaFormFields} from '@/@types/generated/contentful'

interface Props {
  entry: Entry<ICtaFormFields>
}

export function CtaForm({entry}: Props) {
  const {mainText, subText, buttonText} = entry.fields

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-800 dark:text-white xl:text-3xl">
          {mainText}
        </h2>

        <div className="mt-8 lg:mt-0">
          <div className="flex flex-col space-y-3 sm:-mx-2 sm:flex-row sm:space-y-0">
            <input
              id="email"
              type="text"
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-400 sm:mx-2"
              placeholder="Email Address"
            />

            <button className="fo transform rounded-lg bg-blue-600 px-6 py-2 text-sm capitalize tracking-wide text-white transition-colors duration-300 hover:bg-blue-500 focus:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80 sm:mx-2">
              {buttonText}
            </button>
          </div>

          <p className="mt-3 text-sm text-gray-500 dark:text-gray-300">
            {subText}
          </p>
        </div>
      </div>
    </section>
  )
}
