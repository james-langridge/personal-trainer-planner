const fetcher = async ({
  url,
  method,
  body,
  json = true,
}: {
  url: string
  method: string
  body: {[key: string]: string}
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

  if (!res.ok) {
    throw new Error('API error')
  }

  if (json) {
    const data = await res.json()
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
