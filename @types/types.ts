export type EventType = 'APPOINTMENT' | 'BOOTCAMP' | 'WORKOUT'

export type CalendarFormState = {
  date: string
  description: string | null
  fee: string
  id: string
  name: string
  ownerId: string
  selectedDays: Set<number>
  startTime: string
  endTime: string
  type?: EventType
  videoUrl: string | null
  weeksToRepeat: number
}

export type Day = {
  day: number // Date, not day of week
  month: number // January is 0
  weekDay: number // Monday is 1
  year: number
}
