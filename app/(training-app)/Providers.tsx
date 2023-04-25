import React, {createContext, Dispatch, useContext, useReducer} from 'react'
import {SerialisedUser} from '@/lib/users'

export default function Providers({children}: {children: React.ReactNode}) {
  const [user, userDispatch] = useReducer(userReducer, {} as UserState)
  const [sessionId, sessionIdDispatch] = useReducer(
    sessionIdReducer,
    {} as SessionIdState,
  )
  const [isAdmin, authDispatch] = useReducer(authReducer, {} as AuthState)

  return (
    <UserContext.Provider value={user}>
      <SessionIdContext.Provider value={sessionId}>
        <AuthContext.Provider value={isAdmin}>
          <AuthDispatchContext.Provider value={authDispatch}>
            <UserDispatchContext.Provider value={userDispatch}>
              <SessionIdDispatchContext.Provider value={sessionIdDispatch}>
                {children}
              </SessionIdDispatchContext.Provider>
            </UserDispatchContext.Provider>
          </AuthDispatchContext.Provider>
        </AuthContext.Provider>
      </SessionIdContext.Provider>
    </UserContext.Provider>
  )
}

type UserAction = {type: 'setUser'; user: SerialisedUser}
type UserState = {user: SerialisedUser}

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'setUser': {
      return {
        ...state,
        user: action.user,
      }
    }
    default: {
      throw Error('Unknown action: ' + action.type)
    }
  }
}

type SessionIdAction = {type: 'setSessionId'; sessionId: string}
type SessionIdState = {sessionId: string}

function sessionIdReducer(state: SessionIdState, action: SessionIdAction) {
  switch (action.type) {
    case 'setSessionId': {
      return {
        ...state,
        sessionId: action.sessionId,
      }
    }
    default: {
      throw Error('Unknown action: ' + action.type)
    }
  }
}

type AuthAction = {
  type: 'setAuth'
  isAdmin: boolean
}
type AuthState = {isAdmin: boolean}

function authReducer(state: AuthState, action: AuthAction) {
  switch (action.type) {
    case 'setAuth': {
      return {
        ...state,
        isAdmin: action.isAdmin,
      }
    }
    default: {
      throw Error('Unknown action: ' + action.type)
    }
  }
}

const UserContext = createContext<UserState>({} as UserState)
const UserDispatchContext = createContext<Dispatch<UserAction>>(
  {} as Dispatch<UserAction>,
)
const SessionIdContext = createContext<SessionIdState>({} as SessionIdState)
const SessionIdDispatchContext = createContext<Dispatch<SessionIdAction>>(
  {} as Dispatch<SessionIdAction>,
)
const AuthContext = createContext<AuthState>({} as AuthState)
const AuthDispatchContext = createContext<Dispatch<AuthAction>>(
  {} as Dispatch<AuthAction>,
)

export function useUser() {
  return useContext(UserContext)
}

export function useUserDispatch() {
  return useContext(UserDispatchContext)
}

export function useSessionId() {
  return useContext(SessionIdContext)
}

export function useSessionIdDispatch() {
  return useContext(SessionIdDispatchContext)
}

export function useAuth() {
  return useContext(AuthContext)
}

export function useAuthDispatch() {
  return useContext(AuthDispatchContext)
}
