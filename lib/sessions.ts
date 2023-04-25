import {Session, SESSION_STATUS, SESSION_TYPE} from '@prisma/client'
import {formatDate} from '@/lib/calendar'

export type SerialisedSession = {
  id: string
  createdAt: string
  updatedAt: string
  ownerId: string
  status: SESSION_STATUS
  name: string
  date: string
  description: string | null
  videoUrl: string | null
  sessionType: SESSION_TYPE
  deleted: string
}

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

export function serialiseSessions(sessions: Session[]) {
  return sessions.map(session => {
    const {createdAt, updatedAt, date, deleted, ...rest} = session

    return {
      ...rest,
      deleted: deleted.toString(),
      createdAt: formatDate(createdAt),
      updatedAt: formatDate(updatedAt),
      date: formatDate(date),
    }
  })
}
