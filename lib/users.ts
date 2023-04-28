import {Session, User} from '@prisma/client'
import {SerialisedSession, serialiseSessions} from '@/lib/sessions'
import {formatDate} from '@/lib/calendar'

export type UserWithSessions = Omit<User, 'password'> & {
  sessions: Session[]
}

export type SerialisedUser = {
  admin: boolean
  appointments: string
  appointmentsAttended: string
  createdAt: string
  email: string
  firstName: string | null
  id: string
  lastName: string | null
  sessions: SerialisedSession[]
  sessionsAssigned: string
  sessionsCompleted: string
  updatedAt: string
}

export function serialiseUsersWithSessions(users: UserWithSessions[]) {
  return users.map(user => serialiseUserWithSessions(user))
}

export function serialiseUserWithSessions(
  user?: UserWithSessions | null,
): SerialisedUser | undefined {
  if (!user) {
    return
  }

  const {createdAt, sessions, updatedAt, ...rest} = user
  const {
    appointments,
    appointmentsAttended,
    sessionsAssigned,
    sessionsCompleted,
  } = extractSessionData(sessions)

  return {
    ...rest,
    appointments: appointments.toString(),
    appointmentsAttended: appointmentsAttended.toString(),
    createdAt: formatDate(createdAt),
    sessions: serialiseSessions(sessions),
    sessionsAssigned: sessionsAssigned.toString(),
    sessionsCompleted: sessionsCompleted.toString(),
    updatedAt: formatDate(updatedAt),
  }
}

type SessionData = {
  appointments: number
  appointmentsAttended: number
  sessionsAssigned: number
  sessionsCompleted: number
}

function extractSessionData(sessions: Session[]): SessionData {
  const sessionsData = {
    appointments: 0,
    appointmentsAttended: 0,
    sessionsAssigned: 0,
    sessionsCompleted: 0,
  }

  return sessions.reduce((acc, cur) => {
    if (cur.sessionType === 'TRAINING') {
      acc.sessionsAssigned++
    }

    if (cur.sessionType === 'TRAINING' && cur.status === 'COMPLETED') {
      acc.sessionsCompleted++
    }

    if (cur.sessionType === 'APPOINTMENT') {
      acc.appointments++
    }

    if (cur.sessionType === 'APPOINTMENT' && cur.status === 'COMPLETED') {
      acc.appointmentsAttended++
    }

    return acc
  }, sessionsData)
}

export type SerialisedUserKey = keyof Omit<
  SerialisedUser,
  'admin' | 'id' | 'sessions'
>

export function isValidKey(key: string): key is SerialisedUserKey {
  return validKeys.includes(key as SerialisedUserKey)
}

// Changing the order of validKeys will change the display order of the cols on /clients
export const validKeys: SerialisedUserKey[] = [
  'firstName',
  'lastName',
  'email',
  'sessionsAssigned',
  'sessionsCompleted',
  'appointments',
  'appointmentsAttended',
  'createdAt',
  'updatedAt',
]

export const keyMap = {
  appointments: 'Appointments',
  appointmentsAttended: 'Appointments attended',
  createdAt: 'Created',
  email: 'Email',
  firstName: 'First name',
  lastName: 'Last name',
  sessionsAssigned: 'Sessions assigned',
  sessionsCompleted: 'Sessions completed',
  updatedAt: 'Updated',
}

export function sortUsers(key: SerialisedUserKey, users: SerialisedUser[]) {
  return users.sort((a, b) => {
    const keyA = a[key]?.toUpperCase()
    const keyB = b[key]?.toUpperCase()

    if (!keyA || !keyB) {
      return 0
    }

    if (keyA < keyB) {
      return -1
    }

    if (keyA > keyB) {
      return 1
    }

    return 0
  })
}
