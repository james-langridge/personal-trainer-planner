import {test, expect} from '@playwright/test'

test('test', async ({page}) => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()

  const bootcampDay7 = `${currentYear}-${currentMonth}-7`
  const workoutDay15 = `${currentYear}-${currentMonth}-15`
  const bootcampCheckbox = page.getByTestId(bootcampDay7).getByRole('checkbox')
  const workoutCheckbox = page.getByTestId(workoutDay15).getByRole('checkbox')

  await page.goto('/auth/signin')
  await page.getByRole('textbox', {name: 'Email address'}).click()
  await page
    .getByRole('textbox', {name: 'Email address'})
    .fill('test@example.com')
  await page.getByRole('textbox', {name: 'Password'}).click()
  await page.getByRole('textbox', {name: 'Password'}).fill('test123')
  await page.getByRole('button', {name: 'Sign in'}).click()

  await bootcampCheckbox.check()
  await expect(bootcampCheckbox).toBeChecked()
  await expect(bootcampCheckbox).toBeEnabled({timeout: 10_000})
  await bootcampCheckbox.uncheck()
  await expect(bootcampCheckbox).not.toBeChecked()

  await workoutCheckbox.check()
  await expect(workoutCheckbox).toBeChecked()
  await expect(workoutCheckbox).toBeEnabled({timeout: 10_000})
  await workoutCheckbox.uncheck()
  await expect(workoutCheckbox).not.toBeChecked()
})
