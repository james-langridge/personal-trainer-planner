import {Session, User} from '@prisma/client'
import {SerialisedSession, serialiseSessions} from '@/lib/sessions'
import {formatDate} from '@/lib/calendar'

export type UserWithSessions = Omit<User, 'password'> & {
  sessions: Session[]
}

export type SerialisedUser = {
  id: string
  createdAt: string
  updatedAt: string
  email: string
  firstName: string | null
  lastName: string | null
  sessions: SerialisedSession[]
  sessionsAssigned: string
  sessionsCompleted: string
  appointments: string
  appointmentsAttended: string
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

  const {createdAt, updatedAt, sessions, ...rest} = user
  const {
    sessionsAssigned,
    sessionsCompleted,
    appointmentsAttended,
    appointments,
  } = extractSessionData(sessions)

  return {
    ...rest,
    sessions: serialiseSessions(sessions),
    sessionsAssigned: sessionsAssigned.toString(),
    sessionsCompleted: sessionsCompleted.toString(),
    appointmentsAttended: appointmentsAttended.toString(),
    appointments: appointments.toString(),
    createdAt: formatDate(createdAt),
    updatedAt: formatDate(updatedAt),
  }
}

type SessionData = {
  sessionsAssigned: number
  sessionsCompleted: number
  appointments: number
  appointmentsAttended: number
}

function extractSessionData(sessions: Session[]): SessionData {
  const sessionsData = {
    sessionsAssigned: 0,
    sessionsCompleted: 0,
    appointments: 0,
    appointmentsAttended: 0,
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

export type SerialisedUserKey = keyof Omit<SerialisedUser, 'id' | 'sessions'>

export function isValidKey(key: string): key is SerialisedUserKey {
  return validKeys.includes(key as SerialisedUserKey)
}

export const validKeys: SerialisedUserKey[] = [
  'createdAt',
  'updatedAt',
  'email',
  'firstName',
  'lastName',
  'sessionsAssigned',
  'sessionsCompleted',
  'appointments',
  'appointmentsAttended',
]

export const keyMap = {
  firstName: 'First name',
  lastName: 'Last name',
  email: 'Email',
  createdAt: 'Created',
  updatedAt: 'Updated',
  sessionsAssigned: 'Sessions assigned',
  sessionsCompleted: 'Sessions completed',
  appointments: 'Appointments',
  appointmentsAttended: 'Appointments attended',
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
