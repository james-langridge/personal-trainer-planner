import {useState} from 'react'

export type Mode =
  | 'login'
  | 'contact'
  | 'register'
  | 'createSession'
  | 'updateSession'
  | 'deleteSession'
  | 'changePassword'
  | 'generalForm'

export type Status = 'idle' | 'pending' | 'resolved' | 'rejected'

const contactContent = {
  pending: 'Sending message...',
  error: 'Error sending message:',
  resolved: "Thank you for your message. I'll get back to you in a jiffy!",
}

const generalFormContent = {
  pending: 'Sending form...',
  error: 'Error sending form:',
  resolved: 'Form submitted successfully.',
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
  reset,
  error,
  mode,
}: {
  status: Status
  reset: () => void
  error: undefined | Error
  mode?: Mode
}) {
  const [visible, setVisible] = useState(true)
  const toggleVisible = () => {
    setVisible(visible => !visible)
  }

  const resetInfo = () => {
    if (status === 'pending') {
      return
    }

    toggleVisible()
    reset()
  }

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
    case 'generalForm':
      content = generalFormContent
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
          {content?.pending}
        </div>
      )
      break
    case 'rejected':
      element = (
        <div
          role="alert"
          className="mt-4 rounded bg-red-700 p-2.5 text-center text-white"
        >
          {content?.error}{' '}
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
          {content?.resolved}
        </div>
      )
      break
  }

  return visible ? (
    <div
      role="button"
      onKeyDown={resetInfo}
      tabIndex={0}
      onClick={resetInfo}
      className="relative"
    >
      {status !== 'pending' && (
        <div className="absolute top-1 right-1.5 text-white">X</div>
      )}
      {element}
    </div>
  ) : null
}
