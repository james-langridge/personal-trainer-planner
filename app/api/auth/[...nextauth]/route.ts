import {PrismaAdapter} from '@next-auth/prisma-adapter'
import {compare} from 'bcryptjs'
import NextAuth, {NextAuthOptions} from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import {Role} from '@/@types/next-auth'
import {db} from '@/lib/db'

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('Please provide process.env.NEXTAUTH_SECRET')
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {label: 'Email', type: 'email'},
        password: {label: 'Password', type: 'password'},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error('Please enter your email and password')
        }

        const user = await db.user.findUnique({
          where: {email: credentials.email},
        })

        if (!user || !user.password) {
          throw new Error('No user found with this email')
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password,
        )

        if (!isPasswordValid) {
          throw new Error('Invalid password')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as Role,
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    session({session, token}) {
      if (session.user) {
        session.user.role = token.role as Role
        session.user.id = token.sub as string
      }
      return session
    },
    jwt({token, user}) {
      if (user) {
        token.role = user.role as Role
      }
      return token
    },
  },
}

const handler = NextAuth(authOptions)
export {handler as GET, handler as POST}
