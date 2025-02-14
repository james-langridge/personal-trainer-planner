'use server'
// todo consider if revalidation needed
import {db} from '@/lib/db'
import {InvoiceData} from '@/@types/apiRequestTypes'
import nodemailer from 'nodemailer'
import {monthNames} from '@/lib/constants'
import {auth} from '@/auth'

export async function createInvoice(body: InvoiceData) {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    throw new Error('Forbidden.')
  }

  await db.invoice.create({
    data: {
      appointments: body.appointments,
      date: getLastDayOfMonth(body.date),
      ownerId: body.id,
      total: body.total,
    },
  })

  await sendInvoice(body)
}

function getLastDayOfMonth(dateString: string) {
  const date = new Date(dateString)
  date.setMonth(date.getMonth() + 1)
  date.setDate(date.getDate() - 1)

  return date
}

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

  const month = monthNames[new Date(body.date).getMonth()]
  const total = new Intl.NumberFormat('en-UK', {
    style: 'currency',
    currency: 'GBP',
  }).format(body.total / 100)

  const bodyString = `
      Hi ${body.name.split(' ')[0]},
      
      We have done ${body.appointments} sessions in ${month} - total ${total}.

      Many thanks,
      --
      ${process.env.NEXT_PUBLIC_PT_FIRST_NAME}
      `

  try {
    await transporter.sendMail({
      from: `${process.env.NEXT_PUBLIC_PT_FIRST_NAME} ${process.env.PT_SURNAME} ${process.env.EMAIL_FROM}`,
      to: `${body.email}`,
      subject: `${month}'s invoice from ${process.env.PT_BRAND_NAME}`,
      text: bodyString,
    })

    return transporter
  } catch (e) {
    console.error('Could not send message', e)
  }
}
