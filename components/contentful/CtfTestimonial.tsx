import Image from 'next/image'
import {Entry} from 'contentful'
import {ITestimonialFields} from '@/@types/generated/contentful'
import {documentToReactComponents} from '@contentful/rich-text-react-renderer'

interface Props {
  entry: Entry<ITestimonialFields>
}

export function CtfTestimonial({entry}: Props) {
  const {clientDescription, name, photo, testimonialText} = entry.fields

  return (
    <section className="relative isolate overflow-hidden bg-white py-24 px-6 sm:py-32 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-20" />
      <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
      <div className="mx-auto max-w-2xl lg:max-w-4xl">
        <figure className="mt-10">
          <blockquote className="prose text-center text-xl text-gray-900 sm:text-2xl">
            {documentToReactComponents(testimonialText)}
          </blockquote>
          <figcaption className="mt-10">
            {photo && (
              <Image
                className="mx-auto h-10 w-10 rounded-full"
                width={photo.fields.file.details.image?.width}
                height={photo.fields.file.details.image?.height}
                src={`https:${photo.fields.file.url}`}
                alt={name}
              />
            )}
            <div className="mt-4 flex items-center justify-center space-x-3 text-base">
              <div className="font-semibold text-gray-900">{name}</div>
              {clientDescription && (
                <>
                  <svg
                    viewBox="0 0 2 2"
                    width={3}
                    height={3}
                    aria-hidden="true"
                    className="fill-gray-900"
                  >
                    <circle cx={1} cy={1} r={1} />
                  </svg>
                  <div className="text-gray-600">clientDescription</div>
                </>
              )}
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
