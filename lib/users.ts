import {UserSession, UserWithSessions} from '@/lib/api'

type SessionData = {
  sessionsAssigned: number
  sessionsCompleted: number
  appointments: number
  appointmentsAttended: number
}

export type SerialisedUser = {
  id: string
  createdAt: string
  updatedAt: string
  email: string
  firstName: string | null
  lastName: string | null
  sessionsAssigned: string
  sessionsCompleted: string
  appointments: string
  appointmentsAttended: string
}

type SerialisedUserKey = keyof SerialisedUser

export const validKeys: SerialisedUserKey[] = [
  'id',
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

export function isValidKey(key: string): key is SerialisedUserKey {
  return validKeys.includes(key as SerialisedUserKey)
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
      sessionsAssigned: sessionsAssigned.toString(),
      sessionsCompleted: sessionsCompleted.toString(),
      appointmentsAttended: appointmentsAttended.toString(),
      appointments: appointments.toString(),
      createdAt: createdAt.substring(0, 10),
      updatedAt: updatedAt.substring(0, 10),
    }
  })
}

function extractSessionData(sessions: UserSession[]): SessionData {
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
