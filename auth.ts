// https://authjs.dev/getting-started/authentication/credentials
import {PrismaAdapter} from '@auth/prisma-adapter'
import {compare} from 'bcryptjs'
import NextAuth, {NextAuthConfig} from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

import {Role} from '@/@types/next-auth'
import {db} from '@/lib/db'

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: {label: 'Email', type: 'email'},
        password: {label: 'Password', type: 'password'},
      },
      authorize: async credentials => {
        if (!credentials?.email || !credentials.password) {
          throw new Error('Please enter your email and password')
        }

        const user = await db.user.findUnique({
          where: {email: credentials.email as string},
        })

        if (!user || !user.password) {
          throw new Error('No user found with this email')
        }

        const isPasswordValid = compare(
          credentials.password as string,
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

export const {auth, handlers, signIn, signOut} = NextAuth(authOptions)
