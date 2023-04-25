import {Session, SESSION_STATUS, SESSION_TYPE} from '@prisma/client'
import {SerialisedUser, transformUsers} from '@/lib/users'

const fetcher = async ({
  url,
  method,
  body,
  json = true,
  cache,
}: {
  url: string
  method: string
  body?: {[key: string]: string}
  json?: boolean
  cache?: 'force-cache' | 'no-store'
}) => {
  const res = await fetch(url, {
    method,
    body: body && JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    cache: cache && cache,
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error)
  }

  if (json) {
    return data.data
  }
}

export const submitContactForm = (body: {
  name: string
  email: string
  message: string
}) => {
  return fetcher({
    url: '/api/contact',
    method: 'post',
    body,
  })
}

export const login = async (body: {email: string; password: string}) => {
  return fetcher({
    url: '/api/login',
    method: 'post',
    body,
    json: false,
  })
}

export const logout = async (body: {key: string}) => {
  return fetcher({
    url: '/api/logout',
    method: 'post',
    body,
    json: false,
  })
}

export const register = async (body: {
  firstName: string
  lastName: string
  email: string
  password: string
}) => {
  return fetcher({
    url: '/api/register',
    method: 'post',
    body,
    json: false,
  })
}

export const getUsersWithSessions = async (): Promise<SerialisedUser[]> => {
  const users = await fetcher({
    url: '/api/users',
    method: 'get',
  })

  return transformUsers(users)
}

export const fetchUser = async (id: string): Promise<SerialisedUser> => {
  const user = await fetcher({
    url: `/api/user/${id}`,
    method: 'get',
  })

  const [transformedUser] = transformUsers([user])

  return transformedUser
}

export const updatePassword = async (body: {
  id: string
  oldPassword: string
  newPassword: string
  confirmNewPassword: string
}) => {
  return fetcher({
    url: '/api/password',
    method: 'put',
    body,
    json: false,
  })
}

export const fetchSession = async (id: string): Promise<Session> => {
  return fetcher({
    url: `/api/session/${id}`,
    method: 'get',
  })
}

export const getSessionsByUserId = async (id: string): Promise<Session[]> => {
  return fetcher({
    url: `/api/sessions/${id}`,
    method: 'get',
  })
}

export const createSession = async (body: {
  ownerId: string
  date: string
  name: string
  description?: string
  sessionType: SESSION_TYPE
  videoUrl?: string
}) => {
  return fetcher({
    url: '/api/session',
    method: 'post',
    body,
    json: false,
  })
}

export const updateSession = async (body: {
  sessionId: string
  sessionType?: SESSION_TYPE
  date?: string
  deleted?: string
  description?: string
  name?: string
  status?: SESSION_STATUS
  videoUrl?: string
}) => {
  return fetcher({
    url: '/api/session',
    method: 'put',
    body,
    json: false,
  })
}
