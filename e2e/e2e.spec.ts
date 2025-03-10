import {test, expect} from '@playwright/test'

test('bootcamps can be checked off if have credits', async ({page}) => {
  await page.goto('/auth/signin')
  await page.getByRole('textbox', {name: 'Email address'}).click()
  await page
    .getByRole('textbox', {name: 'Email address'})
    .fill('test@example.com')
  await page.getByRole('textbox', {name: 'Password'}).click()
  await page.getByRole('textbox', {name: 'Password'}).fill('test123')
  await page.getByRole('button', {name: 'Sign in'}).click()

  const bootcampCheckboxToday = page.getByTestId('bootcamp-checkbox').nth(1)
  const bootcampCheckboxTomorrow = page.getByTestId('bootcamp-checkbox').nth(2)

  // User has 1 credit so can check bootcamp today
  await bootcampCheckboxToday.check()
  await expect(bootcampCheckboxTomorrow).toBeEnabled({timeout: 10_000})
  await expect(bootcampCheckboxToday).toBeChecked()

  // User has 0 credits so cannot check bootcamp tomorrow
  await bootcampCheckboxTomorrow.check()
  await expect(bootcampCheckboxTomorrow).toBeEnabled({timeout: 10_000})
  await expect(bootcampCheckboxTomorrow).not.toBeChecked()

  // Uncheck the bootcamp today to get 1 credit back
  await bootcampCheckboxToday.uncheck()
  await expect(bootcampCheckboxToday).toBeEnabled({timeout: 10_000})
  await expect(bootcampCheckboxToday).not.toBeChecked()

  // Now user can attend bootcamp tomorrow
  await bootcampCheckboxTomorrow.check()
  await expect(bootcampCheckboxTomorrow).toBeEnabled({timeout: 10_000})
  await expect(bootcampCheckboxTomorrow).toBeChecked()

  // Get credit back
  await bootcampCheckboxTomorrow.uncheck()
  await expect(bootcampCheckboxTomorrow).toBeEnabled({timeout: 10_000})
  await expect(bootcampCheckboxTomorrow).not.toBeChecked()
})
