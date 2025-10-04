import {randomBytes} from 'crypto'

import {NextRequest, NextResponse} from 'next/server'
import {Resend} from 'resend'

import {db} from '@/lib/db'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const {email} = await req.json()

    const resetToken = randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

    await db.user.update({
      where: {email: email.toLowerCase()},
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`

    await resend.emails.send({
      from: `${process.env.PT_BRAND_NAME} <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: `Set Your Password for ${process.env.PT_BRAND_NAME}`,
      html: `
        <p>Please click the link below to set your password:</p>
        <p><a href="${resetUrl}">Set Password</a></p>
        <p>This link will expire in 1 hour for security.</p>
      `,
    })

    return NextResponse.json({
      message: 'If an account exists, a reset email has been sent',
    })
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      {message: 'Error sending reset email'},
      {status: 500},
    )
  }
}
