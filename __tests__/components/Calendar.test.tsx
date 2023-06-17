import {render, screen} from '@testing-library/react'
import {SessionProvider} from 'next-auth/react'

import {UserContext, UserDispatchContext} from '@/app/Providers'
import {Calendar} from '@/components/Calendar'
import {user, year, month, session} from '@/mocks/user'

describe('Calendar', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        // 'matches: false' tests desktop view
        // 'matches: true' tests mobile view
        // hooks/useMediaQuery.ts
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render the workouts in the calendar', () => {
    const mockUserDispatch = jest.fn()

    render(
      <SessionProvider session={session}>
        <UserContext.Provider value={{user: user}}>
          <UserDispatchContext.Provider value={mockUserDispatch}>
            <Calendar user={user} />
          </UserDispatchContext.Provider>
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
