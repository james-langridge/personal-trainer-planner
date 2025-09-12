import {WORKOUT_STATUS} from '@prisma/client'

export function Checkbox({
  onChange,
  status,
  workoutStatus,
}: {
  onChange: () => void
  status: 'error' | 'idle' | 'pending' | 'success'
  workoutStatus: WORKOUT_STATUS
}) {
  return (
    <div onClick={e => e.stopPropagation()} className="inline-block">
      <input
        disabled={status === 'pending'}
        type="checkbox"
        checked={workoutStatus === WORKOUT_STATUS.COMPLETED}
        className="h-7 w-7 rounded"
        onChange={onChange}
      />
    </div>
  )
}
