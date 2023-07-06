'use client'

import BackButton from '@/components/BackButton'
import {useScrollToTop} from '@/hooks'
import {useGetWorkoutQuery} from '@/redux/apiSlice'

export default function Workout({params}: {params: {slug: string}}) {
  const {slug} = params
  const {data: workout} = useGetWorkoutQuery(slug)
  // TODO: Temp fix for page opening scrolled to bottom on mobile view
  useScrollToTop()

  if (!workout) {
    return null
  }

  const date = new Date(workout.date).toLocaleString('default', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="flex justify-center p-10">
      <div className="prose w-screen text-center">
        <h1>{date}</h1>
        <h2>{workout.name}</h2>
        <p>{workout.description}</p>
        {workout.videoUrl && (
          <iframe
            title="Fit For Life Trainer Intro"
            className="mt-12 h-64 min-w-full overflow-hidden rounded-xl border-none md:h-[450px]"
            src={workout.videoUrl}
            allow="autoplay; fullscreen"
            allowFullScreen={false}
          ></iframe>
        )}
        <BackButton />
      </div>
    </div>
  )
}
