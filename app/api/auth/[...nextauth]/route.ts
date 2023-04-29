import NextAuth, {NextAuthOptions} from 'next-auth'
import Email from 'next-auth/providers/email'
import {PrismaAdapter} from '@next-auth/prisma-adapter'
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
  },
}

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}
