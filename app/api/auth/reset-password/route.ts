import {hash} from 'bcryptjs'
import {NextRequest, NextResponse} from 'next/server'

import {db} from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const {token, password} = await req.json()

    const user = await db.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(), // Token must not be expired
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        {message: 'Invalid or expired reset token'},
        {status: 400},
      )
    }

    const hashedPassword = await hash(password, 12)
    await db.user.update({
      where: {id: user.id},
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })

    return NextResponse.json({message: 'Password set successfully'})
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({message: 'Error setting password'}, {status: 500})
  }
}
