import bcrypt from 'bcrypt'
import {jwtVerify, SignJWT} from 'jose'
import {db} from './db'
import {User} from '@prisma/client'
import {RequestCookies} from 'next/dist/compiled/@edge-runtime/cookies'
import {ReadonlyRequestCookies} from 'next/dist/server/web/spec-extension/adapters/request-cookies'

export const hashPassword = (password: string) => bcrypt.hash(password, 10)

export const comparePasswords = (
  plainTextPassword: string,
  hashedPassword: string,
) => bcrypt.compare(plainTextPassword, hashedPassword)

export const createJWT = (user: User) => {
  // return jwt.sign({ id: user.id }, 'cookies')
  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + 60 * 60 * 24 * 7

  return new SignJWT({
    payload: {id: user.id, email: user.email, admin: user.admin},
  })
    .setProtectedHeader({alg: 'HS256', typ: 'JWT'})
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new TextEncoder().encode(process.env.JWT_SECRET))
}

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
        id: true,
        createdAt: true,
        updatedAt: true,
        email: true,
        admin: true,
        firstName: true,
        lastName: true,
        sessions: {
          where: {
            deleted: false,
          },
        },
      },
    })
  }
}
