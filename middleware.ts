import {NextRequest, NextResponse} from 'next/server'
import {jwtVerify} from 'jose'
import {RequestCookies} from 'next/dist/compiled/@edge-runtime/cookies'

const verifyJWT = async (jwt: string | Uint8Array) => {
  const {payload} = await jwtVerify(
    jwt,
    new TextEncoder().encode(process.env.JWT_SECRET),
  )

  return payload.payload as any
}

export const getAdminRightsFromCookie = async (cookies: RequestCookies) => {
  const jwt = cookies.get(process.env.COOKIE_NAME || '')

  if (!jwt) {
    return false
  }

  const {admin} = await verifyJWT(jwt.value)

  return admin
}

export default async function middleware(req: NextRequest) {
  const {pathname} = req.nextUrl

  if (pathname.startsWith('/register')) {
    const jwt = req.cookies.get(process.env.COOKIE_NAME || '')

    if (!jwt) {
      req.nextUrl.pathname = '/login'

      return NextResponse.redirect(req.nextUrl)
    }

    const isAdmin = await getAdminRightsFromCookie(req.cookies)

    if (isAdmin) {
      return NextResponse.next()
    } else {
      req.nextUrl.pathname = '/login'

      return NextResponse.redirect(req.nextUrl)
    }
  }

  if (pathname.startsWith('/training-studio')) {
    const jwt = req.cookies.get(process.env.COOKIE_NAME || '')

    if (!jwt) {
      req.nextUrl.pathname = '/login'

      return NextResponse.redirect(req.nextUrl)
    }

    const isAdmin = await getAdminRightsFromCookie(req.cookies)

    if (isAdmin) {
      req.nextUrl.pathname = '/training-planner'

      return NextResponse.redirect(req.nextUrl)
    }

    try {
      await verifyJWT(jwt.value)

      return NextResponse.next()
    } catch (e) {
      console.error(e)
      req.nextUrl.pathname = '/login'

      return NextResponse.redirect(req.nextUrl)
    }
  }

  if (pathname.startsWith('/login')) {
    const jwt = req.cookies.get(process.env.COOKIE_NAME || '')

    if (!jwt) {
      return NextResponse.next()
    } else {
      req.nextUrl.pathname = '/training-studio'

      return NextResponse.redirect(req.nextUrl)
    }
  }
}
