import {google} from 'googleapis'
import {JWT} from 'google-auth-library'

const getCalendarClient = () => {
  const jwtClient = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    // The private key needs to have \n replaced with actual newlines
    key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/calendar'],
  })

  return google.calendar({version: 'v3', auth: jwtClient})
}

export interface CalendarEvent {
  id?: string
  title: string
  description?: string
  startDate: Date | string
  endDate: Date | string
  location?: string
  isAllDay?: boolean
}

/**
 * Add an event to Google Calendar using service account
 * @param event The event to add
 * @returns The created event from Google Calendar API
 */
export async function addEventToGoogleCalendar(event: CalendarEvent) {
  try {
    const calendar = getCalendarClient()
    const calendarId = process.env.GOOGLE_CALENDAR_ID

    if (!calendarId) {
      throw new Error(
        'Google Calendar ID is not defined in environment variables',
      )
    }

    const googleEvent = {
      summary: event.title,
      description: event.description || '',
      location: event.location || '',
      start: event.isAllDay
        ? {date: new Date(event.startDate).toISOString().split('T')[0]}
        : {
            dateTime: new Date(event.startDate).toISOString(),
            timeZone: process.env.TIME_ZONE,
          },
      end: event.isAllDay
        ? {date: new Date(event.endDate).toISOString().split('T')[0]}
        : {
            dateTime: new Date(event.endDate).toISOString(),
            timeZone: process.env.TIME_ZONE,
          },
    }

    const response = await calendar.events.insert({
      calendarId,
      requestBody: googleEvent,
    })

    return response.data
  } catch (error) {
    console.error('Error adding event to Google Calendar:', error)
    throw error
  }
}

/**
 * Update an existing event in Google Calendar
 * @param eventId The Google Calendar event ID
 * @param event The updated event data
 * @returns The updated event from Google Calendar API
 */
export async function updateGoogleCalendarEvent(
  eventId: string,
  event: CalendarEvent,
) {
  try {
    const calendar = getCalendarClient()
    const calendarId = process.env.GOOGLE_CALENDAR_ID

    if (!calendarId) {
      throw new Error(
        'Google Calendar ID is not defined in environment variables',
      )
    }

    const googleEvent = {
      summary: event.title,
      description: event.description || '',
      location: event.location || '',
      start: event.isAllDay
        ? {date: new Date(event.startDate).toISOString().split('T')[0]}
        : {
            dateTime: new Date(event.startDate).toISOString(),
            timeZone: process.env.TIME_ZONE,
          },
      end: event.isAllDay
        ? {date: new Date(event.endDate).toISOString().split('T')[0]}
        : {
            dateTime: new Date(event.endDate).toISOString(),
            timeZone: process.env.TIME_ZONE,
          },
    }

    const response = await calendar.events.update({
      calendarId,
      eventId,
      requestBody: googleEvent,
    })

    return response.data
  } catch (error) {
    console.error('Error updating event in Google Calendar:', error)
    throw error
  }
}

/**
 * Delete an event from Google Calendar
 * @param eventId The Google Calendar event ID
 */
export async function deleteGoogleCalendarEvent(eventId: string) {
  try {
    const calendar = getCalendarClient()
    const calendarId = process.env.GOOGLE_CALENDAR_ID

    if (!calendarId) {
      throw new Error(
        'Google Calendar ID is not defined in environment variables',
      )
    }

    await calendar.events.delete({
      calendarId,
      eventId,
    })

    return true
  } catch (error) {
    console.error('Error deleting event from Google Calendar:', error)
    throw error
  }
}
