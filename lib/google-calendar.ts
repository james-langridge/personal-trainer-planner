'use server'

import {google, calendar_v3} from 'googleapis'
import {JWT} from 'google-auth-library'
import Schema$Event = calendar_v3.Schema$Event

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
            timeZone: process.env.TIME_ZONE || 'Europe/London',
          },
      end: event.isAllDay
        ? {date: new Date(event.endDate).toISOString().split('T')[0]}
        : {
            dateTime: new Date(event.endDate).toISOString(),
            timeZone: process.env.TIME_ZONE || 'Europe/London',
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
 * Creates multiple events in Google Calendar
 * @param events Array of calendar events to create
 * @returns Array of created events or errors
 */
export async function addMultipleEventsToGoogleCalendar(
  events: CalendarEvent[],
) {
  try {
    const calendarId = process.env.GOOGLE_CALENDAR_ID
    if (!calendarId) {
      throw new Error(
        'Google Calendar ID is not defined in environment variables',
      )
    }

    type GoogleCalendarResult =
      | {success: true; event: Schema$Event; originalEvent: CalendarEvent}
      | {success: false; error: string; originalEvent: CalendarEvent}

    const promises = events.map(
      async (event): Promise<GoogleCalendarResult> => {
        try {
          const calendar = getCalendarClient()

          const googleEvent = {
            summary: event.title,
            description: event.description || '',
            location: event.location || '',
            start: event.isAllDay
              ? {date: new Date(event.startDate).toISOString().split('T')[0]}
              : {
                  dateTime: new Date(event.startDate).toISOString(),
                  timeZone: process.env.TIME_ZONE || 'Europe/London',
                },
            end: event.isAllDay
              ? {date: new Date(event.endDate).toISOString().split('T')[0]}
              : {
                  dateTime: new Date(event.endDate).toISOString(),
                  timeZone: process.env.TIME_ZONE || 'Europe/London',
                },
          }

          const response = await calendar.events.insert({
            calendarId,
            requestBody: googleEvent,
          })

          return {success: true, event: response.data, originalEvent: event}
        } catch (error) {
          console.error(
            `Error adding event "${event.title}" to Google Calendar:`,
            error,
          )
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            originalEvent: event,
          }
        }
      },
    )

    const results = await Promise.allSettled(promises)

    const processedResults = results.map((result, index) => {
      const originalEvent = events[index]

      if (result.status === 'fulfilled') {
        if (result.value.success) {
          return {
            success: true,
            event: result.value.event,
            originalEvent,
            googleCalendarEventId: result.value.event.id,
          }
        } else {
          return {
            success: false,
            error: result.value.error,
            originalEvent,
          }
        }
      } else {
        return {
          success: false,
          error:
            result.reason instanceof Error
              ? result.reason.message
              : 'Unknown error',
          originalEvent,
        }
      }
    })

    // You could also extract just the failures for logging or retries
    // const failures = processedResults.filter(result => !result.success)
    // if (failures.length > 0) {
    //   console.warn(
    //     `${failures.length} out of ${events.length} events failed to sync:`,
    //     failures.map(f => ({title: f.originalEvent.title, error: f.error})),
    //   )
    // }

    return processedResults
  } catch (error) {
    console.error('Error in batch operation:', error)
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
            timeZone: process.env.TIME_ZONE || 'Europe/London',
          },
      end: event.isAllDay
        ? {date: new Date(event.endDate).toISOString().split('T')[0]}
        : {
            dateTime: new Date(event.endDate).toISOString(),
            timeZone: process.env.TIME_ZONE || 'Europe/London',
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
