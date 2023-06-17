import {rest} from 'msw'

import {user} from '@/mocks/user'

export const handlers = [
  rest.get(`/api/user/${user.id}`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: user,
      }),
    )
  }),
]
