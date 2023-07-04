import {PrismaAdapter} from '@next-auth/prisma-adapter'
import NextAuth, {NextAuthOptions} from 'next-auth'
import Email from 'next-auth/providers/email'

import {db} from '@/lib/db'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    Email({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    session({session, user}) {
      if (session.user) {
        session.user.role = user.role
        session.user.id = user.id
      }

      return session
    },
    async signIn({user}) {
      return await doesUserExistInDb(user.email)
    },
  },
}

async function doesUserExistInDb(email: string | null | undefined) {
  if (!email) {
    return false
  }

  const user = await db.user.findUnique({
    where: {
      email: email,
    },
  })

  return !!user
}

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}
