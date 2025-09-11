'use client'

import {Event} from '@/@types/apiResponseTypes'
import BackButton from '@/components/BackButton'
import {getLongDate} from '@/lib/calendar'
import {useEffect} from 'react'

export function EventPage({event}: {event: Event}) {
  const date = getLongDate(event.date)
  // TODO: Temp fix for page opening scrolled to bottom on mobile view
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="flex justify-center p-10">
      <div className="prose w-screen text-center">
        <h1>{date}</h1>
        <h2 className="capitalize">{event.name}</h2>
        <p>{event.description}</p>
        {event.videoUrl && (
          <iframe
            title="Fit For Life Trainer Intro"
            className="mt-12 h-64 min-w-full overflow-hidden rounded-xl border-none md:h-[450px]"
            src={event.videoUrl}
            allow="autoplay; fullscreen"
            allowFullScreen={false}
          ></iframe>
        )}
        <BackButton />
      </div>
    </div>
  )
}
