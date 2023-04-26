import {NextRequest, NextResponse} from 'next/server'
import {jwtVerify} from 'jose'
import {RequestCookies} from 'next/dist/compiled/@edge-runtime/cookies'

// Unauthenticated users are redirected to /login from all (training-app) routes in app/(training-app)/layout.tsx
// Middleware logic intercepts requests before the above redirect

const adminRoutes = ['/clients', '/register', '/training-planner']
const clientRoutes = ['/training-studio']

export default async function middleware(req: NextRequest) {
  const {pathname} = req.nextUrl

  if (adminRoutes.some(route => pathname.startsWith(route))) {
    const JWTPayload = await getJWTPayload(req.cookies)

    // This avoids redirecting unauthenticated users first to /training-studio
    // then to /login by app/(training-app)/layout.tsx
    if (!JWTPayload) {
      req.nextUrl.pathname = '/login'

      return NextResponse.redirect(req.nextUrl)
    }

    if (!JWTPayload.admin) {
      req.nextUrl.pathname = '/training-studio'

      return NextResponse.redirect(req.nextUrl)
    }
  }

  if (clientRoutes.some(route => pathname.startsWith(route))) {
    const JWTPayload = await getJWTPayload(req.cookies)

    // This avoids redirecting unauthenticated users first to /training-planner
    // then to /login by app/(training-app)/layout.tsx
    if (!JWTPayload) {
      req.nextUrl.pathname = '/login'

      return NextResponse.redirect(req.nextUrl)
    }

    if (JWTPayload.admin) {
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
