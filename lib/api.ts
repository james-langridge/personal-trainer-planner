import {Session, SESSION_STATUS, SESSION_TYPE} from '@prisma/client'
import axios from 'axios'
import {serialiseUsers} from '@/lib/users'

const fetcher = async ({
  url,
  method,
  body,
  json = true,
}: {
  url: string
  method: string
  body?: {[key: string]: string}
  json?: boolean
}) => {
  const res = await fetch(url, {
    method,
    body: body && JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
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

export type UserSession = {
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

export type UserWithSessions = {
  id: string
  createdAt: string
  updatedAt: string
  email: string
  firstName: string | null
  lastName: string | null
  sessions: UserSession[]
}

export const getUsers = async () => {
  const {
    data: {users},
  } = await axios.get('/api/users')

  return serialiseUsers(users)
}

export const fetchUser = async (id: string) => {
  return fetcher({
    url: `/api/user/${id}`,
    method: 'get',
  })
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

export const fetchSessions = async (id: string): Promise<Session[]> => {
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
