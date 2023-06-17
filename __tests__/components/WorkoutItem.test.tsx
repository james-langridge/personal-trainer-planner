import {WORKOUT_STATUS, WORKOUT_TYPE} from '@prisma/client'
import {render, fireEvent, screen} from '@testing-library/react'
import {Session} from 'next-auth'
import {useSession} from 'next-auth/react'

import {useWorkoutIdDispatch} from '@/app/Providers'
import {WorkoutItem} from '@/components/WorkoutItem'
import {useWorkoutStatus} from '@/hooks'
import {SerialisedWorkout} from '@/lib/workouts'

// TODO: move these tests into main Calender integration test

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}))

jest.mock('@/hooks', () => ({
  useWorkoutStatus: jest.fn(),
}))

jest.mock('@/app/Providers', () => ({
  useWorkoutIdDispatch: jest.fn(),
}))

const createWorkout = (overrides = {}): SerialisedWorkout => {
  return {
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
    ...overrides,
  }
}

let workout: SerialisedWorkout

describe('WorkoutItem', () => {
  const toggleStatus = jest.fn()
  const dispatch = jest.fn()

  beforeEach(() => {
    workout = createWorkout()

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

  it('should display the name of the workout when rendered', () => {
    const {getByText} = render(<WorkoutItem workout={workout} />)
    expect(getByText('Workout 1')).toBeInTheDocument()
  })

  it('should render a checkbox for TRAINING type workouts', () => {
    render(<WorkoutItem workout={workout} />)
    const checkbox = screen.getByRole('checkbox')

    expect(checkbox).toBeInTheDocument()
  })

  it('should render a checkbox for APPOINTMENT type workouts for admin users', () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: {user: {role: 'admin'}} as Session,
    })

    workout = createWorkout({type: WORKOUT_TYPE.APPOINTMENT})

    render(<WorkoutItem workout={workout} />)
    const checkbox = screen.getByRole('checkbox')

    expect(checkbox).toBeInTheDocument()
  })

  it('should not render a checkbox for APPOINTMENT type workouts for non-admin users', () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: {user: {role: 'user'}} as Session,
    })

    workout = createWorkout({type: WORKOUT_TYPE.APPOINTMENT})

    render(<WorkoutItem workout={workout} />)
    const checkbox = screen.queryByRole('checkbox')

    expect(checkbox).not.toBeInTheDocument()
  })

  it('should call toggleStatus when checkbox is clicked', () => {
    render(<WorkoutItem workout={workout} />)
    const checkbox = screen.getByRole('checkbox')

    fireEvent.click(checkbox)
    expect(toggleStatus).toHaveBeenCalled()
  })

  it('should dispatch setWorkoutId action for admin users when div is clicked', () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: {user: {role: 'admin'}} as Session,
    })

    render(<WorkoutItem workout={workout} />)
    const div = screen.getByRole('button')

    fireEvent.click(div)
    expect(dispatch).toHaveBeenCalledWith({
      type: 'setWorkoutId',
      workoutId: '1',
    })
  })

  it('should not dispatch setWorkoutId action for non-admin users when div is clicked', () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: {user: {role: 'user'}} as Session,
    })

    render(<WorkoutItem workout={workout} />)
    const link = screen.getByText('Workout 1')

    fireEvent.click(link)
    expect(dispatch).not.toHaveBeenCalled()
  })

  it('should render workout name with correct color based on workout type', () => {
    render(<WorkoutItem workout={workout} />)
    const link = screen.getByText('Workout 1')

    expect(link).toHaveClass('bg-emerald-400')

    const workout2 = createWorkout({
      id: '2',
      name: 'Workout 2',
      type: WORKOUT_TYPE.APPOINTMENT,
    })
    render(<WorkoutItem workout={workout2} />)
    const link2 = screen.getByText('Workout 2')

    expect(link2).toHaveClass('bg-blue-400')
  })
})
