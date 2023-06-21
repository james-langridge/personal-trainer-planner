'use client'

import {useRouter} from 'next/navigation'

export function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="transform rounded-lg bg-blue-600 px-6 py-2 font-medium tracking-wide text-white transition-colors duration-300 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
    >
      Back
    </button>
  )
}
