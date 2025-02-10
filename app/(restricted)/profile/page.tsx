import {auth} from '@/auth'
import Container from '@/components/Container'
import {db} from '@/lib/db'

export default async function Profile() {
  const session = await auth()
  const {user} = await getUser(session?.user?.id)

  return (
    <Container>
      <section>
        <h1 className="text-6xl font-bold leading-tight tracking-tighter md:pr-8 md:text-8xl">
          Hello
          {user && `, ${user?.name}`}.
        </h1>
      </section>
    </Container>
  )
}

async function getUser(id?: string) {
  if (!id) {
    return {user: undefined}
  }

  const user = await db.user.findUnique({
    select: {
      name: true,
    },
    where: {
      id: id,
    },
  })

  return {user}
}
