import {test} from '@playwright/test'

test('test', async ({page}) => {
  // Get current year and month for dynamic test IDs
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()

  // Generate test IDs for specific days in the current month
  const bootcampDay7 = `${currentYear}-${currentMonth}-7`
  const bootcampDay14 = `${currentYear}-${currentMonth}-14`
  const bootcampDay21 = `${currentYear}-${currentMonth}-21`
  const workoutDay15 = `${currentYear}-${currentMonth}-15`

  // Login with test user
  await page.goto('/auth/signin')
  await page.getByRole('textbox', {name: 'Email address'}).click()
  await page
    .getByRole('textbox', {name: 'Email address'})
    .fill('test@example.com')
  await page.getByRole('textbox', {name: 'Password'}).click()
  await page.getByRole('textbox', {name: 'Password'}).fill('test123')
  await page.getByRole('button', {name: 'Sign in'}).click()

  // Use dynamic test IDs for the checkboxes
  await page.getByTestId(bootcampDay7).getByRole('checkbox').check()
  await page.getByTestId(bootcampDay14).getByRole('checkbox').check()
  await page.getByTestId(bootcampDay7).getByRole('checkbox').uncheck()
  await page.getByTestId(bootcampDay21).getByRole('checkbox').check()
  await page.getByTestId(workoutDay15).getByRole('checkbox').check()
  await page.getByTestId(workoutDay15).getByRole('checkbox').uncheck()
})
