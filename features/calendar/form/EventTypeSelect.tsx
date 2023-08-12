import React from 'react'

import {CalendarFormState, EventType} from '@/@types/types'

export function EventTypeSelect({
  form,
  setForm,
}: {
  form: CalendarFormState
  setForm: React.Dispatch<React.SetStateAction<CalendarFormState>>
}) {
  return (
    <fieldset>
      <legend>Event Type:</legend>
      <div className="space-x-2">
        <input
          type="radio"
          id="WORKOUT"
          name="type"
          value="WORKOUT"
          checked={form.type === 'WORKOUT'}
          onChange={e =>
            setForm(form => ({
              ...form,
              type: e.target.value as EventType,
            }))
          }
        />
        <label htmlFor="WORKOUT">Workout</label>
      </div>

      <div className="space-x-2">
        <input
          type="radio"
          id="APPOINTMENT"
          name="type"
          checked={form.type === 'APPOINTMENT'}
          value="APPOINTMENT"
          onChange={e =>
            setForm(form => ({
              ...form,
              type: e.target.value as EventType,
            }))
          }
        />
        <label htmlFor="APPOINTMENT">Appointment</label>
      </div>
      <div className="space-x-2">
        <input
          type="radio"
          id="BOOTCAMP"
          name="type"
          checked={form.type === 'BOOTCAMP'}
          value="BOOTCAMP"
          onChange={e =>
            setForm(form => ({
              ...form,
              type: e.target.value as EventType,
            }))
          }
        />
        <label htmlFor="BOOTCAMP">Bootcamp</label>
      </div>
    </fieldset>
  )
}
