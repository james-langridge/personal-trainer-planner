'use client'

import BackButton from '@/components/BackButton'
import {useScrollToTop} from '@/hooks'
import {useGetAppointmentQuery} from '@/redux/apiSlice'

export default function Appointment({params}: {params: {slug: string}}) {
  const {slug} = params
  const {data: appointment} = useGetAppointmentQuery(slug)
  // TODO: Temp fix for page opening scrolled to bottom on mobile view
  useScrollToTop()

  if (!appointment) {
    return null
  }

  const date = new Date(appointment.date).toLocaleString('default', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="flex justify-center p-10">
      <div className="prose w-screen text-center">
        <h1>{date}</h1>
        <h2 className="capitalize">{appointment.name}</h2>
        <p>{appointment.description}</p>
        {appointment.videoUrl && (
          <iframe
            title="Fit For Life Trainer Intro"
            className="mt-12 h-64 min-w-full overflow-hidden rounded-xl border-none md:h-[450px]"
            src={appointment.videoUrl}
            allow="autoplay; fullscreen"
            allowFullScreen={false}
          ></iframe>
        )}
        <BackButton />
      </div>
    </div>
  )
}
