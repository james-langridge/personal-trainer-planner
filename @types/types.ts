export type EventType = 'APPOINTMENT' | 'BOOTCAMP' | 'WORKOUT'

export type CalendarFormState = {
  date: string
  description: string | null
  fee: string
  id: string
  name: string
  ownerId: string
  selectedDays: Set<number>
  type?: EventType
  videoUrl: string | null
  weeksToRepeat: number
}

export type Day = {
  day: number
  month: number
  weekDay: number
  year: number
}
