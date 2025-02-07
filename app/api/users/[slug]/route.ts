import {NextRequest, NextResponse} from 'next/server'

import {auth} from '@/auth'
import {errorHandler} from '@/lib/errors'
import {getSerialisedUser} from '@/prisma/api'

export async function GET(
  req: NextRequest,
  props: {params: Promise<{slug: string}>},
) {
  const params = await props.params
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        {message: 'You must be logged in.'},
        {status: 401},
      )
    }

    const id = params.slug
    const user = await getSerialisedUser(id)

    return NextResponse.json(user)
  } catch (e) {
    return errorHandler(e)
  }
}
