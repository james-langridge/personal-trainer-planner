'use client'

import BackButton from '@/components/BackButton'
import {useFetchSession} from '@/hooks'

export default function Session({params}: {params: {slug: string}}) {
  const {slug} = params
  const sessionData = useFetchSession(slug)

  if (!sessionData) {
    return null
  }

  const date = new Date(sessionData.date).toLocaleString('default', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="flex justify-center p-10">
      <div className="prose w-screen text-center">
        <h1>{date}</h1>
        <h2>{sessionData.name}</h2>
        <p>{sessionData.description}</p>
        {sessionData.videoUrl && (
          <iframe
            title="Fit For Life Trainer Intro"
            className="mt-12 h-64 min-w-full overflow-hidden rounded-xl border-none md:h-[450px]"
            src={sessionData.videoUrl}
            allow="autoplay; fullscreen"
            allowFullScreen={false}
          ></iframe>
        )}
        <BackButton />
      </div>
    </div>
  )
}
