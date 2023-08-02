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
    <fieldset className="mt-4">
      <legend>Event Type:</legend>
      <div>
        <input
          type="radio"
          id="WORKOUT"
          name="type"
          value="WORKOUT"
          checked={form.type === 'WORKOUT'}
          className="mr-2"
          onChange={e =>
            setForm(form => ({
              ...form,
              type: e.target.value as EventType,
            }))
          }
        />
        <label htmlFor="WORKOUT">Training</label>
      </div>

      <div>
        <input
          type="radio"
          id="APPOINTMENT"
          name="type"
          checked={form.type === 'APPOINTMENT'}
          value="APPOINTMENT"
          className="mr-2"
          onChange={e =>
            setForm(form => ({
              ...form,
              type: e.target.value as EventType,
            }))
          }
        />
        <label htmlFor="APPOINTMENT">Appointment</label>
      </div>
      <div>
        <input
          type="radio"
          id="BOOTCAMP"
          name="type"
          checked={form.type === 'BOOTCAMP'}
          value="BOOTCAMP"
          className="mr-2"
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
