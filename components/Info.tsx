const contactContent = {
  pending: 'Sending message...',
  error: 'Error sending message:',
  resolved: "Thank you for your message. I'll get back to you in a jiffy!",
}

const loginContent = {
  pending: 'Logging in...',
  error: 'Error logging in:',
  resolved: 'Welcome Back',
}

export default function Info({
  status,
  error,
  mode,
}: {
  status: string
  error: Error | null
  mode: 'login' | 'contact'
}) {
  if (status === 'idle') {
    return null
  }

  const content = mode === 'login' ? loginContent : contactContent

  if (status === 'pending') {
    return (
      <div
        role="alert"
        className="mt-4 rounded bg-yellow-600 p-2.5 text-center text-white"
      >
        {content.pending}
      </div>
    )
  }

  if (status === 'rejected') {
    return (
      <div
        role="alert"
        className="mt-4 rounded bg-red-700 p-2.5 text-center text-white"
      >
        {content.error}{' '}
        <pre style={{whiteSpace: 'normal'}}>{error?.message}</pre>
      </div>
    )
  }

  if (status === 'resolved') {
    return (
      <div
        role="alert"
        className="mt-4 rounded bg-green-700 p-2.5 text-center text-white"
      >
        {content.resolved}
      </div>
    )
  }

  return null
}
