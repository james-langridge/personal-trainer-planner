import {auth} from '@/auth'

export default auth(req => {
  const isPathProtected = !req.nextUrl.pathname.startsWith('/auth')
  const isAuthorised = req.auth
  if (isPathProtected && !isAuthorised) {
    const newUrl = new URL('/auth/signin', req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
})

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
