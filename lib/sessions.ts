import {SerialisedSession} from '@/lib/users'

export type SerialisedSessionKey = keyof Omit<
  SerialisedSession,
  'id' | 'ownerId' | 'createdAt' | 'updatedAt' | 'deleted'
>

export function isValidKey(key: string): key is SerialisedSessionKey {
  return validKeys.includes(key as SerialisedSessionKey)
}

export const validKeys: SerialisedSessionKey[] = [
  'date',
  'name',
  'description',
  'sessionType',
  'status',
  'videoUrl',
]

export const keyMap = {
  date: 'Date',
  name: 'Name',
  description: 'Description',
  sessionType: 'Type',
  status: 'Status',
  videoUrl: 'Video url',
}

export function sortSessions(
  key: SerialisedSessionKey,
  sessions: SerialisedSession[],
) {
  return sessions.sort((a, b) => {
    switch (key) {
      case 'status':
      case 'name':
      case 'date':
      case 'sessionType':
        return a[key].localeCompare(b[key], undefined, {sensitivity: 'base'})
      case 'description':
      case 'videoUrl':
        if (a[key] === null) return 1
        if (b[key] === null) return -1
        return (a[key] as string).localeCompare(b[key] as string) // Change here
      default:
        return 0
    }
  })
}
