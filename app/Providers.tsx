'use client'

import React, {createContext, Dispatch, useContext, useReducer} from 'react'
import {SerialisedUser} from '@/lib/users'
import {SessionProvider} from 'next-auth/react'

export default function Providers({children}: {children: React.ReactNode}) {
  const [user, userDispatch] = useReducer(userReducer, {} as UserState)
  const [workoutId, workoutIdDispatch] = useReducer(
    workoutIdReducer,
    {} as WorkoutIdState,
  )
  const [isAdmin, authDispatch] = useReducer(authReducer, {} as AuthState)

  return (
    <SessionProvider>
      <UserContext.Provider value={user}>
        <WorkoutIdContext.Provider value={workoutId}>
          <AuthContext.Provider value={isAdmin}>
            <AuthDispatchContext.Provider value={authDispatch}>
              <UserDispatchContext.Provider value={userDispatch}>
                <WorkoutIdDispatchContext.Provider value={workoutIdDispatch}>
                  {children}
                </WorkoutIdDispatchContext.Provider>
              </UserDispatchContext.Provider>
            </AuthDispatchContext.Provider>
          </AuthContext.Provider>
        </WorkoutIdContext.Provider>
      </UserContext.Provider>
    </SessionProvider>
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

type WorkoutIdAction = {type: 'setWorkoutId'; workoutId: string}
type WorkoutIdState = {workoutId: string}

function workoutIdReducer(state: WorkoutIdState, action: WorkoutIdAction) {
  switch (action.type) {
    case 'setWorkoutId': {
      return {
        ...state,
        workoutId: action.workoutId,
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
const WorkoutIdContext = createContext<WorkoutIdState>({} as WorkoutIdState)
const WorkoutIdDispatchContext = createContext<Dispatch<WorkoutIdAction>>(
  {} as Dispatch<WorkoutIdAction>,
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

export function useWorkoutId() {
  return useContext(WorkoutIdContext)
}

export function useWorkoutIdDispatch() {
  return useContext(WorkoutIdDispatchContext)
}

export function useAuth() {
  return useContext(AuthContext)
}

export function useAuthDispatch() {
  return useContext(AuthDispatchContext)
}
