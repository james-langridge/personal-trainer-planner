'use client'

import Container from '@/components/Container'
import {useGetUser} from '@/app/hooks/users'

export default function ProfileView({userId}: {userId: string}) {
  const {data: user} = useGetUser(userId)

  return (
    <Container>
      <section>
        <h1 className="text-6xl font-bold leading-tight tracking-tighter md:pr-8 md:text-8xl">
          Hello
          {user && `, ${user.name}`}.
        </h1>
      </section>
    </Container>
  )
}
