import {useState} from 'react'

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

const registerContent = {
  pending: 'Creating new user...',
  error: 'Error creating user:',
  resolved: 'User created successfully',
}

const createSessionContent = {
  pending: 'Creating new session...',
  error: 'Error creating session:',
  resolved: 'Session created successfully',
}

const updateSessionContent = {
  pending: 'Updating session...',
  error: 'Error updating session:',
  resolved: 'Session updated successfully',
}

const deleteSessionContent = {
  pending: 'Deleting session...',
  error: 'Error deleting session:',
  resolved: 'Session deleted successfully',
}

const changePasswordContent = {
  pending: 'Changing password...',
  error: 'Error changing password:',
  resolved: 'Password changed successfully',
}

export default function Info({
  status,
  error,
  mode,
}: {
  status: string
  error: null | Error
  mode:
    | 'login'
    | 'contact'
    | 'register'
    | 'createSession'
    | 'updateSession'
    | 'deleteSession'
    | 'changePassword'
}) {
  const [visible, setVisible] = useState(true)
  const toggleVisible = () => setVisible(visible => !visible)

  let content

  switch (mode) {
    case 'contact':
      content = contactContent
      break
    case 'login':
      content = loginContent
      break
    case 'register':
      content = registerContent
      break
    case 'createSession':
      content = createSessionContent
      break
    case 'updateSession':
      content = updateSessionContent
      break
    case 'deleteSession':
      content = deleteSessionContent
      break
    case 'changePassword':
      content = changePasswordContent
      break
  }

  let element = null

  switch (status) {
    case 'pending':
      if (!visible) toggleVisible()

      element = (
        <div
          role="alert"
          className="mt-4 rounded bg-yellow-600 p-2.5 text-center text-white"
        >
          {content.pending}
        </div>
      )
      break
    case 'rejected':
      element = (
        <div
          role="alert"
          className="mt-4 rounded bg-red-700 p-2.5 text-center text-white"
        >
          {content.error}{' '}
          <pre style={{whiteSpace: 'normal'}}>{error?.message}</pre>
        </div>
      )
      break
    case 'resolved':
      element = (
        <div
          role="alert"
          className="mt-4 rounded bg-green-700 p-2.5 text-center text-white"
        >
          {content.resolved}
        </div>
      )
      break
  }

  return visible ? (
    <div
      role="button"
      onKeyDown={toggleVisible}
      tabIndex={0}
      onClick={toggleVisible}
    >
      {element}
    </div>
  ) : null
}
