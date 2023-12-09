// https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript

import {Prisma} from '.prisma/client'
import {NextResponse} from 'next/server'

type ErrorWithMessage = {
  message: string
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  )
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError

  try {
    return new Error(JSON.stringify(maybeError))
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError))
  }
}

export function getErrorMessage(error: unknown) {
  return toErrorWithMessage(error).message
}

export function errorHandler(e: unknown) {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    return NextResponse.json(
      {message: `${e.code}: ${e.message}`},
      {
        status: 500,
      },
    )
  }

  if (e instanceof Prisma.PrismaClientUnknownRequestError) {
    return NextResponse.json(
      {message: e.message},
      {
        status: 500,
      },
    )
  }

  return NextResponse.json(
    {message: getErrorMessage(e)},
    {
      status: 500,
    },
  )
}
