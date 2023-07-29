import {NextRequest, NextResponse} from 'next/server'
import {getServerSession} from 'next-auth/next'
import nodemailer from 'nodemailer'

import {authOptions} from '@/app/api/auth/[...nextauth]/route'

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

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({message: 'You must be logged in.'}, {status: 401})
  }

  const body = await req.json()

  await sendForm(body)

  return NextResponse.json(body)
}
