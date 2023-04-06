import {getUserFromCookie} from '@/lib/auth'
import {cookies} from 'next/headers'
import Container from '@/components/Container'
import ChangePasswordForm from '@/components/ChangePasswordForm'

export default async function Profile() {
  const user = await getUserFromCookie(cookies())

  return (
    <Container>
      <section>
        <h1 className="text-6xl font-bold leading-tight tracking-tighter md:pr-8 md:text-8xl">
          Hello{user && `, ${user.firstName}`}.
        </h1>
      </section>
      {user && (
        <section>
          <ChangePasswordForm userId={user.id} />
        </section>
      )}
    </Container>
  )
}
