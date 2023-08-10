import {NextRequest, NextResponse} from 'next/server'
import {getServerSession} from 'next-auth/next'
import nodemailer from 'nodemailer'

import {InvoiceData} from '@/@types/apiRequestTypes'
import {authOptions} from '@/app/api/auth/[...nextauth]/route'

const sendInvoice = async (body: InvoiceData) => {
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

  const bodyString = `
      Hi ${body.user.split(' ')[0]},
      
      We have done ${body.appointments} sessions this month - total ${
    body.total
  }.

      Many thanks,
      --
      ${process.env.PT_FIRST_NAME}
      `

  try {
    await transporter.sendMail({
      from: `${process.env.PT_FIRST_NAME} ${process.env.PT_SURNAME} ${process.env.EMAIL_FROM}`,
      // to: `${body.email}`,
      to: process.env.EMAIL_TO,
      subject: `This month's invoice from ${process.env.PT_BRAND_NAME}`,
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

  if (session.user?.role !== 'admin') {
    return NextResponse.json({message: 'Forbidden.'}, {status: 403})
  }

  const body: InvoiceData = await req.json()

  await sendInvoice(body)

  return NextResponse.json(body)
}
