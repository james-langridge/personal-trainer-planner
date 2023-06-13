import '@testing-library/jest-dom'
import {WORKOUT_STATUS, WORKOUT_TYPE} from '@prisma/client'
import {render, fireEvent, screen} from '@testing-library/react'
import {Session} from 'next-auth'
import {useSession} from 'next-auth/react'

import {useWorkoutIdDispatch} from '@/app/Providers'
import {WorkoutItem} from '@/components/WorkoutItem'
import {useWorkoutStatus} from '@/hooks'
import {SerialisedWorkout} from '@/lib/workouts'

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}))

jest.mock('@/hooks', () => ({
  useWorkoutStatus: jest.fn(),
}))

jest.mock('@/app/Providers', () => ({
  useWorkoutIdDispatch: jest.fn(),
}))

describe('WorkoutItem', () => {
  const toggleStatus = jest.fn()
  const dispatch = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSession as jest.Mock).mockReturnValue({
      data: {user: {role: 'user'}} as Session,
    })
    ;(useWorkoutStatus as jest.Mock).mockReturnValue({
      status: WORKOUT_STATUS.COMPLETED,
      toggleStatus,
    })
    ;(useWorkoutIdDispatch as jest.Mock).mockReturnValue(dispatch)
  })

  it('renders correctly', () => {
    const workout: SerialisedWorkout = {
      id: '1',
      name: 'Workout 1',
      type: WORKOUT_TYPE.TRAINING,
      status: WORKOUT_STATUS.COMPLETED,
      createdAt: '',
      updatedAt: '',
      ownerId: '',
      date: '',
      description: null,
      videoUrl: null,
      deleted: '',
    }
    const {getByText} = render(<WorkoutItem workout={workout} />)
    expect(getByText('Workout 1')).toBeInTheDocument()
  })

  it('renders checkbox for TRAINING type workouts', () => {
    const workout: SerialisedWorkout = {
      id: '1',
      name: 'Workout 1',
      type: WORKOUT_TYPE.TRAINING,
      status: WORKOUT_STATUS.COMPLETED,
      createdAt: '',
      updatedAt: '',
      ownerId: '',
      date: '',
      description: null,
      videoUrl: null,
      deleted: '',
    }

    render(<WorkoutItem workout={workout} />)
    const checkbox = screen.getByRole('checkbox')

    expect(checkbox).toBeInTheDocument()
  })

  it('renders checkbox for APPOINTMENT type workouts for admin users', () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: {user: {role: 'admin'}} as Session,
    })

    const workout: SerialisedWorkout = {
      id: '1',
      name: 'Workout 1',
      type: WORKOUT_TYPE.APPOINTMENT,
      status: WORKOUT_STATUS.COMPLETED,
      createdAt: '',
      updatedAt: '',
      ownerId: '',
      date: '',
      description: null,
      videoUrl: null,
      deleted: '',
    }

    render(<WorkoutItem workout={workout} />)
    const checkbox = screen.getByRole('checkbox')

    expect(checkbox).toBeInTheDocument()
  })

  it('calls toggleStatus when checkbox is clicked', () => {
    const workout: SerialisedWorkout = {
      id: '1',
      name: 'Workout 1',
      type: WORKOUT_TYPE.TRAINING,
      status: WORKOUT_STATUS.COMPLETED,
      createdAt: '',
      updatedAt: '',
      ownerId: '',
      date: '',
      description: null,
      videoUrl: null,
      deleted: '',
    }

    render(<WorkoutItem workout={workout} />)
    const checkbox = screen.getByRole('checkbox')

    fireEvent.click(checkbox)
    expect(toggleStatus).toHaveBeenCalled()
  })

  it('dispatches setWorkoutId action for admin users when div is clicked', () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: {user: {role: 'admin'}} as Session,
    })

    const workout: SerialisedWorkout = {
      id: '1',
      name: 'Workout 1',
      type: WORKOUT_TYPE.TRAINING,
      status: WORKOUT_STATUS.COMPLETED,
      createdAt: '',
      updatedAt: '',
      ownerId: '',
      date: '',
      description: null,
      videoUrl: null,
      deleted: '',
    }
    render(<WorkoutItem workout={workout} />)
    const div = screen.getByRole('button')

    fireEvent.click(div)
    expect(dispatch).toHaveBeenCalledWith({
      type: 'setWorkoutId',
      workoutId: '1',
    })
  })

  it('does not dispatch setWorkoutId action for non-admin users when div is clicked', () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: {user: {role: 'user'}} as Session,
    })

    const workout: SerialisedWorkout = {
      id: '1',
      name: 'Workout 1',
      type: WORKOUT_TYPE.TRAINING,
      status: WORKOUT_STATUS.COMPLETED,
      createdAt: '',
      updatedAt: '',
      ownerId: '',
      date: '',
      description: null,
      videoUrl: null,
      deleted: '',
    }
    render(<WorkoutItem workout={workout} />)
    const link = screen.getByText('Workout 1')

    fireEvent.click(link)
    expect(dispatch).not.toHaveBeenCalled()
  })

  it('renders workout name with correct color based on workout type', () => {
    const workout: SerialisedWorkout = {
      id: '1',
      name: 'Workout 1',
      type: WORKOUT_TYPE.TRAINING,
      status: WORKOUT_STATUS.COMPLETED,
      createdAt: '',
      updatedAt: '',
      ownerId: '',
      date: '',
      description: null,
      videoUrl: null,
      deleted: '',
    }
    render(<WorkoutItem workout={workout} />)
    const link = screen.getByText('Workout 1')

    expect(link).toHaveClass('bg-emerald-400')

    const workout2: SerialisedWorkout = {
      id: '2',
      name: 'Workout 2',
      type: WORKOUT_TYPE.APPOINTMENT,
      status: WORKOUT_STATUS.COMPLETED,
      createdAt: '',
      updatedAt: '',
      ownerId: '',
      date: '',
      description: null,
      videoUrl: null,
      deleted: '',
    }
    render(<WorkoutItem workout={workout2} />)
    const link2 = screen.getByText('Workout 2')

    expect(link2).toHaveClass('bg-blue-400')
  })
})
