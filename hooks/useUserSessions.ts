import {getSessionsByUserId} from '@/lib/api'
import {useQuery} from '@tanstack/react-query'

export function useUserSessions(userId: string | undefined) {
  const {data: sessionsData} = useQuery({
    queryKey: ['sessions', userId],
    queryFn: getSessionsByUserId,
    enabled: !!userId,
  })

  return {sessionsData}
}
