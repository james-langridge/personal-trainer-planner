import Link from 'next/link'
import {Entry} from 'contentful'
import {
  IVideoHeroFeatureFields,
  IVideoHeroProgramCard,
} from '@/@types/generated/contentful'
import {documentToReactComponents} from '@contentful/rich-text-react-renderer'

interface VideoCardProps {
  program: IVideoHeroProgramCard
}

function VideoCard({program}: VideoCardProps) {
  return (
    <div className="space-y-3 rounded-xl border-2 border-blue-400 p-8 dark:border-blue-300">
      <h1 className="text-xl font-semibold capitalize text-gray-700 dark:text-white">
        {program.fields.name}
      </h1>

      <div className="prose text-gray-500 dark:text-gray-300">
        {documentToReactComponents(program.fields.programSummary)}
      </div>

      <Link
        href={program.fields.slug}
        aria-label={program.fields.name}
        className="inline-flex transform rounded-full bg-blue-100 p-2 capitalize text-blue-500 transition-colors duration-300 hover:text-blue-600 hover:underline rtl:-scale-x-100 dark:bg-blue-500 dark:text-white dark:hover:text-blue-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </Link>
    </div>
  )
}

interface Props {
  entry: Entry<IVideoHeroFeatureFields>
}

export function CtfVideoHero({entry}: Props) {
  const {tagline1stLine, tagline2ndLine, videoUrl, programCards} = entry.fields

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold capitalize text-blue-500 dark:text-white lg:text-3xl">
          {tagline1stLine}
          {tagline2ndLine && <br />}
          {tagline2ndLine && tagline2ndLine}
        </h1>

        <iframe
          title="Fit For Life Trainer Intro"
          className="mt-12 h-64 min-w-full overflow-hidden rounded-xl border-none md:h-[450px]"
          src={videoUrl}
          allow="autoplay; fullscreen"
          allowFullScreen={false}
        ></iframe>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 xl:mt-12 xl:grid-cols-3 xl:gap-12">
          {programCards?.map(program => (
            <VideoCard key={program.sys.id} program={program} />
          ))}
        </div>
      </div>
    </section>
  )
}
