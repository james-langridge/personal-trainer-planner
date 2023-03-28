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

export const fetchUsers = async () => {
  return fetcher({
    url: '/api/users',
    method: 'get',
  })
}

export const fetchUser = async (id: string) => {
  return fetcher({
    url: `/api/user/${id}`,
    method: 'get',
  })
}
