import Image from 'next/image'
import Link from 'next/link'
import {Entry} from 'contentful'
import {IContactFields} from '@/@types/generated/contentful'
import ContactForm from '@/components/ContactForm'

interface Props {
  entry: Entry<IContactFields>
}

export function CtfContactPage({entry}: Props) {
  const {headline, subheading, email, address, phone, facebook, image} =
    entry.fields

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6 py-10">
        <div className="lg:-mx-10 lg:flex lg:items-center">
          <div className="lg:mx-10 lg:w-1/2">
            <h1 className="text-2xl font-semibold capitalize text-gray-800 dark:text-white lg:text-3xl">
              {headline}
            </h1>
            {subheading && (
              <p className="mt-4 text-gray-500 dark:text-gray-400">
                Ask me everything and I would love to hear from you
              </p>
            )}
            <ContactForm />
          </div>

          <div className="mt-12 lg:mx-10 lg:mt-0 lg:flex lg:w-1/2 lg:flex-col lg:items-center">
            {image && (
              <Image
                className="mx-auto hidden h-96 w-96 shrink-0 rounded-full object-cover lg:block"
                src={`https:${image.fields.file.url}`}
                alt={image.fields.title}
                width={image.fields.file.details.image?.width}
                height={image.fields.file.details.image?.height}
              />
            )}

            <div className="mt-6 space-y-8 md:mt-8">
              {address && (
                <p className="-mx-2 flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mx-2 h-6 w-6 text-blue-500 dark:text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>

                  <span className="mx-2 w-72 truncate text-gray-700 dark:text-gray-400">
                    {address}
                  </span>
                </p>
              )}

              <p className="-mx-2 flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-2 h-6 w-6 text-blue-500 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>

                <span className="mx-2 w-72 truncate text-gray-700 dark:text-gray-400">
                  {phone}
                </span>
              </p>

              <p className="-mx-2 flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-2 h-6 w-6 text-blue-500 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>

                <span className="mx-2 w-72 truncate text-gray-700 dark:text-gray-400">
                  {email}
                </span>
              </p>
            </div>

            <div className="mt-6 w-80 md:mt-8">
              <h3 className="text-gray-600 dark:text-gray-300 ">Follow me</h3>

              <div className="-mx-1.5 mt-4 flex ">
                <Link
                  className="mx-1.5 transform text-gray-400 transition-colors duration-300 hover:text-blue-500 dark:hover:text-blue-400"
                  href={facebook || '#'}
                >
                  <svg
                    className="h-8 w-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 10.2222V13.7778H9.66667V20H13.2222V13.7778H15.8889L16.7778 10.2222H13.2222V8.44444C13.2222 8.2087 13.3159 7.9826 13.4826 7.81591C13.6493 7.64921 13.8754 7.55556 14.1111 7.55556H16.7778V4H14.1111C12.9324 4 11.8019 4.46825 10.9684 5.30175C10.1349 6.13524 9.66667 7.2657 9.66667 8.44444V10.2222H7Z"
                      fill="currentColor"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
