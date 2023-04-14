import {NextRequest, NextResponse} from 'next/server'
import nodemailer from 'nodemailer'

const sendEmail = async ({
  name,
  email,
  message,
}: {
  name: string
  email: string
  message: string
}) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USERNAME_FROM,
      pass: process.env.GMAIL_PASSWORD,
    },
  })

  try {
    await transporter.verify()
  } catch (e) {
    console.error('Could not connect to gmail', e)

    return
  }

  try {
    await transporter.sendMail({
      from: `${name} ${email}`,
      to: process.env.GMAIL_USERNAME_TO,
      subject: `Contact form message from ${email}`,
      text: message,
    })

    return transporter
  } catch (e) {
    console.error('Could not send message', e)
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  await sendEmail(body)

  return NextResponse.json(body)
}
