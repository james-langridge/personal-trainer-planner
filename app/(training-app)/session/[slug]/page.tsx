import {db} from '@/lib/db'
import BackButton from '@/components/BackButton'

export const dynamic = 'force-dynamic'

const getSession = async (id: string) => {
  const session = await db.session.findUnique({
    where: {
      id: id,
    },
  })

  return {session}
}

export default async function Session({params}: {params: {slug: string}}) {
  const {slug} = params
  const {session} = await getSession(slug)

  if (!session) {
    return null
  }

  const date = new Date(session.date).toLocaleString('default', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="flex justify-center p-10">
      <div className="prose w-screen text-center">
        <h1>{date}</h1>
        <h2>{session.name}</h2>
        <p>{session.description}</p>
        {session.videoUrl && (
          <iframe
            title="Fit For Life Trainer Intro"
            className="mt-12 h-64 min-w-full overflow-hidden rounded-xl border-none md:h-[450px]"
            src={session.videoUrl}
            allow="autoplay; fullscreen"
            allowFullScreen={false}
          ></iframe>
        )}
        <BackButton />
      </div>
    </div>
  )
}
