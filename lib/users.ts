import {Session, SESSION_STATUS, SESSION_TYPE} from '@prisma/client'

export type UserWithSessions = {
  id: string
  createdAt: Date
  updatedAt: Date
  email: string
  firstName: string | null
  lastName: string | null
  sessions: Session[]
}

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
  deleted: boolean
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

function serialiseSessions(sessions: Session[]) {
  return sessions.map(session => {
    const {createdAt, updatedAt, date, ...rest} = session

    return {
      ...rest,
      createdAt: createdAt.toDateString(),
      updatedAt: updatedAt.toDateString(),
      date: date.toDateString(),
    }
  })
}

function transformSessions(sessions: SerialisedSession[]) {
  return sessions.map(session => {
    const {createdAt, updatedAt, date, ...rest} = session

    return {
      ...rest,
      createdAt: createdAt.substring(0, 10),
      updatedAt: updatedAt.substring(0, 10),
      date: date.substring(0, 10),
    }
  })
}

export function transformUsers(users: SerialisedUser[]): SerialisedUser[] {
  return users.map(user => {
    const {createdAt, updatedAt, sessions, ...rest} = user
    const {
      sessionsAssigned,
      sessionsCompleted,
      appointmentsAttended,
      appointments,
    } = extractSerialisedSessionData(sessions)

    return {
      ...rest,
      sessions: transformSessions(sessions),
      sessionsAssigned: sessionsAssigned.toString(),
      sessionsCompleted: sessionsCompleted.toString(),
      appointmentsAttended: appointmentsAttended.toString(),
      appointments: appointments.toString(),
      createdAt: createdAt.substring(0, 10),
      updatedAt: updatedAt.substring(0, 10),
    }
  })
}

export function serialiseUsers(users: UserWithSessions[]): SerialisedUser[] {
  return users.map(user => {
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
  })
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

function extractSerialisedSessionData(
  sessions: SerialisedSession[],
): SessionData {
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

function formatDate(date: Date) {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  return `${year}-${month}-${day}`
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
