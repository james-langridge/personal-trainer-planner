import {http, HttpResponse} from 'msw'

import {user} from '@/mocks/user'

export const handlers = [
  http.get(`/api/users/${user.id}`, () => {
    return HttpResponse.json(
      {
        data: user,
      },
      {status: 200},
    )
  }),
]
