import {APPOINTMENT_STATUS} from '@prisma/client'

export function Checkbox({
  onChange,
  status,
}: {
  onChange: () => void
  status: APPOINTMENT_STATUS
}) {
  return (
    <input
      type="checkbox"
      checked={status === APPOINTMENT_STATUS.ATTENDED}
      className="h-7 w-7 rounded"
      onChange={onChange}
    />
  )
}
