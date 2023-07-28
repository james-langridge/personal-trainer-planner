'use client'

import {useRouter} from 'next/navigation'

import ButtonOld from './ButtonOld'

export default function BackButton() {
  const router = useRouter()

  return <ButtonOld onClick={() => router.back()}>Back</ButtonOld>
}
