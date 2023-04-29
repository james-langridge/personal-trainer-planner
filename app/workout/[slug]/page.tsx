'use client'

import BackButton from '@/components/BackButton'
import {useFetchWorkout} from '@/hooks'

export default function Workout({params}: {params: {slug: string}}) {
  const {slug} = params
  const workoutData = useFetchWorkout(slug)

  if (!workoutData) {
    return null
  }

  const date = new Date(workoutData.date).toLocaleString('default', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="flex justify-center p-10">
      <div className="prose w-screen text-center">
        <h1>{date}</h1>
        <h2>{workoutData.name}</h2>
        <p>{workoutData.description}</p>
        {workoutData.videoUrl && (
          <iframe
            title="Fit For Life Trainer Intro"
            className="mt-12 h-64 min-w-full overflow-hidden rounded-xl border-none md:h-[450px]"
            src={workoutData.videoUrl}
            allow="autoplay; fullscreen"
            allowFullScreen={false}
          ></iframe>
        )}
        <BackButton />
      </div>
    </div>
  )
}
