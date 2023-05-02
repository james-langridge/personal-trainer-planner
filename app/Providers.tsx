'use client'

import {SessionProvider} from 'next-auth/react'
import React, {createContext, Dispatch, useContext, useReducer} from 'react'

import {SerialisedUser} from '@/lib/users'

export default function Providers({children}: {children: React.ReactNode}) {
  const [user, userDispatch] = useReducer(userReducer, {} as UserState)
  const [workoutId, workoutIdDispatch] = useReducer(
    workoutIdReducer,
    {} as WorkoutIdState,
  )

  return (
    <SessionProvider>
      <UserContext.Provider value={user}>
        <WorkoutIdContext.Provider value={workoutId}>
          <UserDispatchContext.Provider value={userDispatch}>
            <WorkoutIdDispatchContext.Provider value={workoutIdDispatch}>
              {children}
            </WorkoutIdDispatchContext.Provider>
          </UserDispatchContext.Provider>
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

const UserContext = createContext<UserState>({} as UserState)
const UserDispatchContext = createContext<Dispatch<UserAction>>(
  {} as Dispatch<UserAction>,
)
const WorkoutIdContext = createContext<WorkoutIdState>({} as WorkoutIdState)
const WorkoutIdDispatchContext = createContext<Dispatch<WorkoutIdAction>>(
  {} as Dispatch<WorkoutIdAction>,
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
