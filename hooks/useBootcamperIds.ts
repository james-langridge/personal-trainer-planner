import {useGetUsersQuery} from '@/redux/apiSlice'

export function useBootcamperIds(skip = true): string[] {
  const {data: users} = useGetUsersQuery()

  if (!users || skip) {
    return []
  }

  const bootcamperIds = users
    .filter(user => user.type === 'BOOTCAMP')
    .map(user => user.id)

  return [...bootcamperIds, String(process.env.NEXT_PUBLIC_BOOTCAMP_ID)]
}
