import {getServerSession} from 'next-auth/next'

import {UserWithWorkouts} from '@/@types/types'
import {authOptions} from '@/app/api/auth/[...nextauth]/route'
import Container from '@/components/Container'
import {db} from '@/lib/db'
import {serialiseUserWithWorkouts} from '@/lib/users'

const getUserWithWorkouts = async (
  id?: string,
): Promise<{
  user: UserWithWorkouts | null | undefined
}> => {
  if (!id) {
    return {user: undefined}
  }

  const user: UserWithWorkouts | null = await db.user.findUnique({
    select: {
      id: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      email: true,
      name: true,
      workouts: {
        where: {
          deleted: false,
        },
      },
    },
    where: {
      id: id,
    },
  })

  return {user: user}
}

export default async function Profile() {
  const session = await getServerSession(authOptions)
  const {user} = await getUserWithWorkouts(session?.user?.id)
  const serialisedUserWithWorkouts = serialiseUserWithWorkouts(user)

  return (
    <Container>
      <section>
        <h1 className="text-6xl font-bold leading-tight tracking-tighter md:pr-8 md:text-8xl">
          Hello
          {serialisedUserWithWorkouts &&
            `, ${serialisedUserWithWorkouts?.name}`}
          .
        </h1>
      </section>
    </Container>
  )
}
