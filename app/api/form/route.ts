import {NextRequest, NextResponse} from 'next/server'
import nodemailer from 'nodemailer'

const sendForm = async (body: Record<string, string>) => {
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

  let bodyString = ''

  for (const [key, value] of Object.entries(body)) {
    bodyString += `${key}: ${value}\n`
  }

  try {
    await transporter.sendMail({
      from: `${body['Full name']} ${body.Email}`,
      to: process.env.GMAIL_USERNAME_TO,
      subject: `Form submission from ${body.Email}`,
      text: bodyString,
    })

    return transporter
  } catch (e) {
    console.error('Could not send message', e)
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  await sendForm(body)

  return NextResponse.json(body)
}
