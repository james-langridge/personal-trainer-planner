import AuthForm from '@/components/AuthForm'
import {getUserFromCookie} from '@/lib/auth'
import {cookies} from 'next/headers'
import {redirect} from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function Login() {
  const user = await getUserFromCookie(cookies())

  if (user) {
    redirect('/training-planner')
  }

  return <AuthForm mode="login" />
}
