import {dehydrate, HydrationBoundary, QueryClient} from '@tanstack/react-query'
import ProfileView from '@/app/(users)/profile/ProfileView'
import {auth} from '@/auth'
import {getUser} from '@/app/actions/users'

export default async function Page() {
  const queryClient = new QueryClient()
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) return null

  await queryClient.prefetchQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileView userId={userId} />
    </HydrationBoundary>
  )
}
