import {getUser} from '@/app/actions/users'
import {dehydrate, HydrationBoundary, QueryClient} from '@tanstack/react-query'
import UserView from '@/app/admin/user/[id]/UserView'

export default async function UserDetails(props: {
  params: Promise<{id: string}>
}) {
  const params = await props.params
  const {id} = params
  const queryClient = new QueryClient()

  if (!id) return null

  await queryClient.prefetchQuery({
    queryKey: ['user', id],
    queryFn: () => getUser(id),
  })

  if (!id) {
    return null
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserView userId={id} />
    </HydrationBoundary>
  )
}
