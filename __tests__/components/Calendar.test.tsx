// TODO: Update this test with redux
//
// import {fireEvent, render, screen, within} from '@testing-library/react'
// import {SessionProvider} from 'next-auth/react'
//
// import {Calendar} from '@/features/calendar/Calendar'
// import {monthNames} from '@/lib/constants'
// import {user, year, month, session} from '@/mocks/user'
//
// describe('Calendar', () => {
//   beforeEach(() => {
//     Object.defineProperty(window, 'matchMedia', {
//       writable: true,
//       value: jest.fn().mockImplementation(query => ({
//         // 'matches: false' tests desktop view
//         // 'matches: true' tests mobile view
//         // hooks/useMediaQuery.ts
//         matches: false,
//         media: query,
//         onchange: null,
//         addListener: jest.fn(), // Deprecated
//         removeListener: jest.fn(), // Deprecated
//         addEventListener: jest.fn(),
//         removeEventListener: jest.fn(),
//         dispatchEvent: jest.fn(),
//       })),
//     })
//
//     render(
//       <SessionProvider session={session}>
//         <Calendar initialUser={user} />
//       </SessionProvider>,
//     )
//   })
//
//   afterEach(() => {
//     jest.resetAllMocks()
//   })
//
//   it('should render the non-deleted workouts in the calendar with checkboxes and links', () => {
//     const trainingDay = screen.getByTestId(`${year}-${month}-1`)
//     expect(trainingDay).toHaveTextContent('workout 1')
//     expect(trainingDay).toHaveTextContent('workout 2')
//     expect(trainingDay).not.toHaveTextContent('workout 3')
//
//     const checkboxes = within(trainingDay).queryAllByRole('checkbox')
//     expect(checkboxes).toHaveLength(2)
//     const linkElement1 = screen.getByTestId(`${user.workouts[0].id}`)
//     const linkElement2 = screen.getByTestId(`${user.workouts[1].id}`)
//
//     expect(linkElement1).toHaveAttribute(
//       'href',
//       `/workouts/${user.workouts[0].id}`,
//     )
//     expect(linkElement2).toHaveAttribute(
//       'href',
//       `/workouts/${user.workouts[1].id}`,
//     )
//   })
//
//   it('should render the appointments in the calendar with links and without checkboxes', () => {
//     const appointmentDay = screen.getByTestId(`${year}-${month}-2`)
//     expect(appointmentDay).toHaveTextContent('appointment 1')
//
//     const checkbox = within(appointmentDay).queryByRole('checkbox')
//     expect(checkbox).not.toBeInTheDocument()
//
//     const linkElement3 = screen.getByTestId(`${user.workouts[3].id}`)
//     expect(linkElement3).toHaveAttribute(
//       'href',
//       `/workouts/${user.workouts[3].id}`,
//     )
//   })
//
//   it('should render the correct date header and update the calendar when changed', () => {
//     const heading = screen.getByTestId('heading')
//     let monthName = monthNames[month]
//     expect(heading).toHaveTextContent(`${monthName} ${year}`)
//
//     const prevMonthBtn = screen.getByTestId('prevMonthBtn')
//     fireEvent.click(prevMonthBtn)
//     monthName = monthNames[month - 1]
//     expect(heading).toHaveTextContent(`${monthName} ${year}`)
//     expect(screen.queryByText('workout 1')).not.toBeInTheDocument()
//
//     const nextMonthBtn = screen.getByTestId('nextMonthBtn')
//     fireEvent.click(nextMonthBtn)
//     monthName = monthNames[month]
//     expect(heading).toHaveTextContent(`${monthName} ${year}`)
//     expect(screen.queryByText('workout 1')).toBeInTheDocument()
//   })
// })
