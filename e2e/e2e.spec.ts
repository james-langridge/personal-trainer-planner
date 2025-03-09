import {test} from '@playwright/test'

test('test', async ({page}) => {
  await page.goto('/auth/signin')
  await page.getByRole('textbox', {name: 'Email address'}).click()
  await page
    .getByRole('textbox', {name: 'Email address'})
    .fill('james.d.langridge@gmail.com')
  await page.getByRole('textbox', {name: 'Password'}).click()
  await page
    .getByRole('textbox', {name: 'Password'})
    .fill('BOWLDER1wood.eternal')
  await page.getByRole('button', {name: 'Sign in'}).click()

  await page.getByTestId('prevMonthBtn').click()
  await page.getByTestId('2025-1-7').getByRole('checkbox').check()
  await page.getByTestId('2025-1-14').getByRole('checkbox').uncheck()
  await page.getByTestId('2025-1-21').getByRole('checkbox').check()
  await page.getByTestId('2025-1-21').getByRole('checkbox').uncheck()
  await page.getByTestId('2025-1-6').getByRole('checkbox').check()
})
