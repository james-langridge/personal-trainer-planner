'use server'

import {Resend} from 'resend'

import {auth} from '@/auth'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function submitForm(body: Record<string, string>) {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    throw new Error('Forbidden.')
  }

  await sendForm(body)
}

const sendForm = async (body: Record<string, string>) => {
  let bodyString = ''

  for (const [key, value] of Object.entries(body)) {
    bodyString += `${key}: ${value}\n`
  }

  const emailTo = process.env.EMAIL_TO
  if (!emailTo) {
    throw new Error('EMAIL_TO environment variable is not configured')
  }

  try {
    await resend.emails.send({
      from: `${body['Full name']} <${process.env.EMAIL_FROM}>`,
      to: emailTo,
      replyTo: body.Email,
      subject: `Form submission from ${body.Email}`,
      text: bodyString,
    })
  } catch (e) {
    console.error('Could not send form submission', e)
    throw new Error('Failed to send form submission. Please try again later.')
  }
}
