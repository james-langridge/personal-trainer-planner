import {jwtVerify} from 'jose'
import {db} from './db'
import {RequestCookies} from 'next/dist/compiled/@edge-runtime/cookies'
import {ReadonlyRequestCookies} from 'next/dist/server/web/spec-extension/adapters/request-cookies'

export const validateJWT = async (jwt: string | Uint8Array) => {
  const {payload} = await jwtVerify(
    jwt,
    new TextEncoder().encode(process.env.JWT_SECRET),
  )

  return payload.payload as any
}

export const getUserFromCookie = async (
  cookies: RequestCookies | ReadonlyRequestCookies,
) => {
  const jwt = cookies.get(process.env.COOKIE_NAME || '')

  if (jwt) {
    const {id} = await validateJWT(jwt.value)

    return db.user.findUnique({
      where: {
        id: id as string,
      },
      select: {
        admin: true,
        createdAt: true,
        email: true,
        name: true,
        id: true,
        workouts: {
          where: {
            deleted: false,
          },
        },
        updatedAt: true,
      },
    })
  }
}
