import '@testing-library/jest-dom'
import {render, screen} from '@testing-library/react'
import {SessionProvider} from 'next-auth/react'

import {UserContext} from '@/app/Providers'
import {CalendarGrid} from '@/components/CalendarGrid'
import {generateCalendarMonth, padZero} from '@/lib/calendar'
import {SerialisedUser} from '@/lib/users'

const now = new Date()
const year = now.getFullYear()
const month = now.getMonth()
const monthData = generateCalendarMonth(month, year)
const uiMonth = padZero(month + 1)

const user: SerialisedUser = {
  id: '123',
  role: null,
  email: 'email',
  name: 'Name',
  appointments: '1',
  appointmentsAttended: '1',
  createdAt: '2023-04-29',
  workouts: [
    {
      id: '1',
      ownerId: '123',
      status: 'NOT_STARTED',
      name: 'workout 1',
      description: 'do it!!!',
      videoUrl: 'https://player.vimeo.com/video/756493570?h=6189b49779',
      type: 'TRAINING',
      deleted: 'false',
      createdAt: '2023-04-29',
      updatedAt: '2023-04-29',
      date: `${year}-${uiMonth}-19`,
    },
    {
      id: '2',
      ownerId: '123',
      status: 'COMPLETED',
      name: 'workout 2',
      description: 'do it!!!',
      videoUrl: 'https://player.vimeo.com/video/756493570?h=6189b49779',
      type: 'TRAINING',
      deleted: 'false',
      createdAt: '2023-04-29',
      updatedAt: '2023-04-29',
      date: `${year}-${uiMonth}-19`,
    },
    {
      id: '3',
      ownerId: '123',
      status: 'NOT_STARTED',
      name: 'workout 3',
      description: 'do it!!!',
      videoUrl: 'https://player.vimeo.com/video/756493570?h=6189b49779',
      type: 'TRAINING',
      deleted: 'true',
      createdAt: '2023-04-29',
      updatedAt: '2023-04-29',
      date: `${year}-${uiMonth}-19`,
    },
    {
      id: '4',
      ownerId: '123',
      status: 'COMPLETED',
      name: 'appointment 1',
      description: 'mooooove it',
      videoUrl: '',
      type: 'APPOINTMENT',
      deleted: 'false',
      createdAt: '2023-04-29',
      updatedAt: '2023-04-29',
      date: `${year}-${uiMonth}-20`,
    },
  ],
  workoutsAssigned: '1',
  workoutsCompleted: '0',
  updatedAt: '2023-06-14',
}

const session = {
  user: {
    name: 'name',
    email: 'email',
    image: null,
    role: undefined,
    id: '12345',
  },
  expires: '2023-07-15T14:46:39.270Z',
}

describe('CalendarGrid', () => {
  it('should render the workouts in the calendar', () => {
    render(
      <SessionProvider session={session}>
        <UserContext.Provider value={{user: user}}>
          <CalendarGrid monthData={monthData} />
        </UserContext.Provider>
      </SessionProvider>,
    )
    const trainingDay = screen.getByTestId(`${year}-${month}-19`)

    expect(trainingDay).toHaveTextContent('workout 1')
    expect(trainingDay).toHaveTextContent('workout 2')
    expect(trainingDay).not.toHaveTextContent('workout 3')

    const appointmentDay = screen.getByTestId(`${year}-${month}-20`)

    expect(appointmentDay).toHaveTextContent('appointment 1')
  })
})
