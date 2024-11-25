'use server'

import {revalidatePath} from 'next/cache'

export default async function revalidate() {
  console.log('revalidating...')
  revalidatePath('/', 'layout')
}
