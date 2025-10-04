'use server'

import {Resend} from 'resend'

import {InvoiceData} from '@/@types/apiRequestTypes'
import {auth} from '@/auth'
import {monthNames} from '@/lib/constants'
import {db} from '@/lib/db'

const resend = new Resend(process.env.RESEND_API_KEY || '')

export async function createInvoice(body: InvoiceData) {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    throw new Error('Forbidden.')
  }

  // Send email first - if this fails, we don't create the invoice
  await sendInvoice(body)

  // Only create invoice if email was sent successfully
  await db.invoice.create({
    data: {
      appointments: body.appointments,
      date: getLastDayOfMonth(body.date),
      ownerId: body.id,
      total: body.total,
    },
  })
}

function getLastDayOfMonth(dateString: string) {
  const date = new Date(dateString)
  date.setMonth(date.getMonth() + 1)
  date.setDate(date.getDate() - 1)

  return date
}

const sendInvoice = async (body: InvoiceData) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY environment variable is not configured')
  }

  const month = monthNames[new Date(body.date).getMonth()]
  const total = new Intl.NumberFormat('en-UK', {
    style: 'currency',
    currency: 'GBP',
  }).format(body.total / 100)

  const bodyString = `Hi ${body.name.split(' ')[0]},

We have done ${body.appointments} sessions in ${month} - total ${total}.

Many thanks,
--
${process.env.NEXT_PUBLIC_PT_FIRST_NAME}`

  try {
    await resend.emails.send({
      from: `${process.env.NEXT_PUBLIC_PT_FIRST_NAME} ${process.env.PT_SURNAME} <${process.env.EMAIL_FROM}>`,
      replyTo: process.env.EMAIL_TO,
      to: body.email,
      subject: `${month}'s invoice from ${process.env.PT_BRAND_NAME}`,
      text: bodyString,
    })
  } catch (e) {
    console.error('Could not send invoice email', e)
    throw new Error('Failed to send invoice email. Please try again later.')
  }
}
