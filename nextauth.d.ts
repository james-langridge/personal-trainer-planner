// nextauth.d.ts
import {DefaultSession, DefaultUser} from 'next-auth'

// Define a role enum
export enum Role {
  user = 'user',
  admin = 'admin',
}

interface IUser extends DefaultUser {
  role?: Role
}

declare module 'next-auth' {
  interface User extends IUser {}
  interface Session extends DefaultSession {
    user?: User
  }
}
