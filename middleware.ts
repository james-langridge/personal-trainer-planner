import {NextRequest, NextResponse} from 'next/server'
import {jwtVerify} from 'jose'
import {RequestCookies} from 'next/dist/compiled/@edge-runtime/cookies'

// Unauthenticated users are redirected to /login from all (training-app) group routes in app/(training-app)/layout.tsx

const adminRoutes = ['/clients', '/register']

export default async function middleware(req: NextRequest) {
  const {pathname} = req.nextUrl

  if (adminRoutes.some(route => pathname.startsWith(route))) {
    const JWTPayload = await getJWTPayload(req.cookies)

    // This avoids redirecting unauthenticated users first to /training-planner
    // then to /login via app/(training-app)/layout.tsx
    if (!JWTPayload) {
      req.nextUrl.pathname = '/login'

      return NextResponse.redirect(req.nextUrl)
    }

    if (!JWTPayload.admin) {
      req.nextUrl.pathname = '/training-planner'

      return NextResponse.redirect(req.nextUrl)
    }
  }
}

async function getJWTPayload(cookies: RequestCookies) {
  const jwt = cookies.get(process.env.COOKIE_NAME || '')

  if (!jwt) {
    return undefined
  }

  return await verifyJWT(jwt.value)
}

const verifyJWT = async (jwt: string | Uint8Array) => {
  const {payload} = await jwtVerify(
    jwt,
    new TextEncoder().encode(process.env.JWT_SECRET),
  )

  return payload.payload as any
}
