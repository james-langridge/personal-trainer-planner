import {auth} from '@/auth'
import Container from '@/components/Container'
import {getSerialisedUser} from '@/prisma/api'

export default async function Profile() {
  const session = await auth()
  const {user} = await getSerialisedUser(session?.user?.id)

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
