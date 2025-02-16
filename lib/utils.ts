import {type ClassValue, clsx} from 'clsx'
import {twMerge} from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isMobileViewport(userAgent: string): boolean {
  return /Mobile|Android|iPhone/i.test(userAgent)
}
