'use server'

import {Appointment} from '@prisma/client'

import {auth} from '@/auth'
import {
  getRepeatingDates,
  combineDateAndTime,
  extractTimeString,
} from '@/lib/calendar'
import {db} from '@/lib/db'
import {
  addEventToGoogleCalendar,
  addMultipleEventsToGoogleCalendar,
  updateGoogleCalendarEvent,
  deleteGoogleCalendarEvent,
  type CalendarEvent,
} from '@/lib/google-calendar'

type CreateAppointmentBody = Pick<
  Appointment,
  'description' | 'fee' | 'name' | 'ownerId' | 'videoUrl'
> & {
  date: string
  startTime: Date | null
  endTime: Date | null
  selectedDays: number[]
  weeksToRepeat: number
}

export type CreateAppointmentResult = {
  appointments: Appointment[]
  syncStatus: {
    success: boolean
    message?: string
    failedCount?: number
    totalCount?: number
    successCount?: number
  }
}

export async function createAppointment(
  body: CreateAppointmentBody,
): Promise<CreateAppointmentResult> {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    throw new Error('Forbidden.')
  }

  const {
    date,
    description,
    fee,
    name,
    ownerId,
    selectedDays,
    startTime,
    endTime,
    videoUrl,
    weeksToRepeat,
  } = body

  const dates = getRepeatingDates(date, selectedDays, weeksToRepeat)

  // Create appointments in database
  const appointments = await db.$transaction(
    dates.map(date =>
      db.appointment.create({
        data: {
          date,
          description,
          fee,
          name,
          ownerId,
          startTime,
          endTime,
          videoUrl,
        },
      }),
    ),
  )

  // Try to sync with Google Calendar
  let syncStatus: CreateAppointmentResult['syncStatus'] = {
    success: true,
  }

  // Only sync if we have Google Calendar configured
  if (process.env.GOOGLE_CALENDAR_ID) {
    try {
      // No timeout needed on Railway - let it complete
      const results = await addMultipleEventsToGoogleCalendar(
        appointments.map(appt => {
          // Combine date from appointment with time from form times
          // Extract time component from the form's startTime/endTime and apply to this appointment's date
          const dateStr = appt.date.toISOString().split('T')[0]
          const appointmentStartDate = appt.startTime
            ? combineDateAndTime(dateStr, extractTimeString(appt.startTime))
            : appt.date
          const appointmentEndDate = appt.endTime
            ? combineDateAndTime(dateStr, extractTimeString(appt.endTime))
            : appt.date

          return {
            title: appt.name,
            description: appt.description || '',
            startDate: appointmentStartDate || appt.date,
            endDate: appointmentEndDate || appt.date,
            isAllDay: !appt.startTime || !appt.endTime,
          }
        }),
      )

      // Update appointments with Google Calendar IDs
      const updatePromises = []
      let successCount = 0
      let failedCount = 0

      for (let i = 0; i < results.length; i++) {
        const result = results[i]
        if (result.success && result.googleCalendarEventId) {
          successCount++
          updatePromises.push(
            db.appointment.update({
              where: {id: appointments[i].id},
              data: {googleCalendarEventId: result.googleCalendarEventId},
            }),
          )
          // Update the local appointment object
          appointments[i].googleCalendarEventId = result.googleCalendarEventId
        } else {
          failedCount++
        }
      }

      if (updatePromises.length > 0) {
        await db.$transaction(updatePromises)
      }

      if (failedCount > 0) {
        syncStatus = {
          success: false,
          message: `${failedCount} out of ${appointments.length} appointments failed to sync with Google Calendar`,
          failedCount,
          successCount,
          totalCount: appointments.length,
        }
      } else {
        syncStatus = {
          success: true,
          message: `Successfully synced all ${appointments.length} appointments to Google Calendar`,
          successCount,
          totalCount: appointments.length,
        }
      }
    } catch (error) {
      console.error('Error syncing with Google Calendar:', error)
      syncStatus = {
        success: false,
        message:
          'Failed to sync with Google Calendar. Appointments were saved.',
        failedCount: appointments.length,
      }
    }
  }

  return {
    appointments,
    syncStatus,
  }
}

type UpdateAppointmentBody = Partial<
  Pick<
    Appointment,
    | 'deleted'
    | 'description'
    | 'fee'
    | 'id'
    | 'name'
    | 'ownerId'
    | 'startTime'
    | 'endTime'
    | 'status'
    | 'videoUrl'
  >
> & {date: Date}

export type UpdateAppointmentResult = {
  appointment: Appointment
  syncStatus: {
    success: boolean
    message?: string
  }
}

export async function updateAppointment(
  body: UpdateAppointmentBody,
): Promise<UpdateAppointmentResult> {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    throw new Error('Forbidden.')
  }

  // Update appointment in database
  const appointment = await db.appointment.update({
    where: {
      id: body.id,
    },
    data: {
      ...(body.date !== undefined && {date: new Date(body.date)}),
      ...(body.fee && {fee: body.fee}),
      ...(body.deleted === true && {deleted: true}),
      ...(body.description !== undefined && {description: body.description}),
      ...(body.name !== undefined && {name: body.name}),
      ...(body.startTime !== undefined && {startTime: body.startTime}),
      ...(body.endTime !== undefined && {endTime: body.endTime}),
      ...(body.status !== undefined && {status: body.status}),
      ...(body.videoUrl !== undefined && {videoUrl: body.videoUrl}),
    },
  })

  // Try to sync with Google Calendar
  let syncStatus: UpdateAppointmentResult['syncStatus'] = {
    success: true,
  }

  try {
    const calendarEvent: CalendarEvent = {
      title: appointment.name,
      description: appointment.description || '',
      startDate: appointment.startTime || appointment.date,
      endDate: appointment.endTime || appointment.date,
      isAllDay: !appointment.startTime || !appointment.endTime,
    }

    if (appointment.googleCalendarEventId) {
      // Update existing Google Calendar event
      await updateGoogleCalendarEvent(
        appointment.googleCalendarEventId,
        calendarEvent,
      )
    } else {
      // Create new Google Calendar event if none exists
      const googleEvent = await addEventToGoogleCalendar(calendarEvent)
      if (googleEvent.id) {
        await db.appointment.update({
          where: {id: appointment.id},
          data: {googleCalendarEventId: googleEvent.id},
        })
        appointment.googleCalendarEventId = googleEvent.id
      }
    }
  } catch (error) {
    console.error('Error syncing with Google Calendar:', error)
    syncStatus = {
      success: false,
      message: 'Failed to sync with Google Calendar. Changes were saved.',
    }
  }

  return {
    appointment,
    syncStatus,
  }
}

type DeleteAppointmentBody = Pick<
  Appointment,
  'deleted' | 'id' | 'ownerId' | 'date'
>

export type DeleteAppointmentResult = {
  success: boolean
  syncStatus: {
    success: boolean
    message?: string
  }
}

export async function deleteAppointment(
  body: DeleteAppointmentBody,
): Promise<DeleteAppointmentResult> {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    throw new Error('Forbidden.')
  }

  // Get the appointment to check for Google Calendar ID
  const appointment = await db.appointment.findUnique({
    where: {id: body.id},
    select: {googleCalendarEventId: true},
  })

  // Soft delete in database
  await db.appointment.update({
    where: {
      id: body.id,
    },
    data: {
      deleted: true,
    },
  })

  // Try to delete from Google Calendar
  let syncStatus: DeleteAppointmentResult['syncStatus'] = {
    success: true,
  }

  if (appointment?.googleCalendarEventId) {
    try {
      await deleteGoogleCalendarEvent(appointment.googleCalendarEventId)
    } catch (error) {
      console.error('Error deleting from Google Calendar:', error)
      syncStatus = {
        success: false,
        message:
          'Failed to delete from Google Calendar. Appointment was removed from the system.',
      }
    }
  }

  return {
    success: true,
    syncStatus,
  }
}

export async function getAppointment(id: string) {
  const session = await auth()
  if (!session) {
    throw new Error('Must be logged in.')
  }
  const appointment = await db.appointment.findUnique({
    where: {id},
  })

  if (!appointment) {
    throw new Error('Appointment not found')
  }

  return appointment
}

/**
 * Sync a single appointment to Google Calendar (for retry functionality)
 */
export async function syncAppointmentToGoogleCalendar(
  appointmentId: string,
): Promise<{success: boolean; message?: string}> {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    throw new Error('Forbidden.')
  }

  try {
    const appointment = await db.appointment.findUnique({
      where: {id: appointmentId},
    })

    if (!appointment) {
      throw new Error('Appointment not found')
    }

    const calendarEvent: CalendarEvent = {
      title: appointment.name,
      description: appointment.description || '',
      startDate: appointment.startTime || appointment.date,
      endDate: appointment.endTime || appointment.date,
      isAllDay: !appointment.startTime || !appointment.endTime,
    }

    if (appointment.googleCalendarEventId) {
      // Update existing event
      await updateGoogleCalendarEvent(
        appointment.googleCalendarEventId,
        calendarEvent,
      )
      return {success: true, message: 'Google Calendar event updated'}
    } else {
      // Create new event
      const googleEvent = await addEventToGoogleCalendar(calendarEvent)
      if (googleEvent.id) {
        await db.appointment.update({
          where: {id: appointmentId},
          data: {googleCalendarEventId: googleEvent.id},
        })
        return {success: true, message: 'Synced to Google Calendar'}
      }
      throw new Error('Failed to create Google Calendar event')
    }
  } catch (error) {
    console.error('Error syncing appointment to Google Calendar:', error)
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to sync with Google Calendar',
    }
  }
}
