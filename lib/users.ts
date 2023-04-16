import {Session, User} from '@prisma/client'

type UserData = Omit<User, 'password' | 'admin'> & {sessions: Session[]}

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

export function sortUsers(key: SerialisedUserKey, users: SerialisedUser[]) {
  return users.sort((a, b) => {
    const keyA = a[key]
    const keyB = b[key]

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

export function serialiseUsers(users: UserData[]): SerialisedUser[] {
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
      createdAt: formatDate(createdAt),
      updatedAt: formatDate(updatedAt),
    }
  })
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

function formatDate(date: Date) {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function trimUsers(users: (User & {sessions: Session[]})[]) {
  return users.map(user => {
    // Cannot include sessions in user query as well as omit these fields
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {admin, password, ...rest} = user

    return rest
  })
}
