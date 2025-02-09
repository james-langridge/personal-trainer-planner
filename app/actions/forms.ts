'use server'

import {auth} from '@/auth'
import nodemailer from 'nodemailer'

export async function submitForm(body: Record<string, string>) {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    throw new Error('Forbidden.')
  }

  await sendForm(body)
}

const sendForm = async (body: Record<string, string>) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  try {
    await transporter.verify()
  } catch (e) {
    console.error('Could not connect to gmail', e)

    return
  }

  let bodyString = ''

  for (const [key, value] of Object.entries(body)) {
    bodyString += `${key}: ${value}\n`
  }

  try {
    await transporter.sendMail({
      from: `${body['Full name']} ${body.Email}`,
      to: process.env.EMAIL_TO,
      subject: `Form submission from ${body.Email}`,
      text: bodyString,
    })

    return transporter
  } catch (e) {
    console.error('Could not send message', e)
  }
}
