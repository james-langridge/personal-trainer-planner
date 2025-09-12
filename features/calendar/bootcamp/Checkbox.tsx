export function Checkbox({
  disabled,
  onChange,
  status,
}: {
  disabled: boolean
  onChange: () => void
  status: boolean
}) {
  return (
    <input
      disabled={disabled}
      type="checkbox"
      checked={status}
      className="h-7 w-7 rounded"
      onChange={onChange}
      data-testid="bootcamp-checkbox"
    />
  )
}
