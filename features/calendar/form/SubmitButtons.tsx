import Link from 'next/link'
import React from 'react'

import {CalendarFormState} from '@/@types/types'
import ButtonOld from '@/components/ButtonOld'

export function SubmitButtons({
  form,
  handleDelete,
  isCreating,
  isDeleting,
  isDisabled,
  isUpdating,
}: {
  form: CalendarFormState
  handleDelete: (e: React.SyntheticEvent) => void
  isCreating: boolean
  isDeleting: boolean
  isDisabled: boolean
  isUpdating: boolean
}) {
  return (
    <div className="mt-4 flex justify-between">
      <ButtonOld
        type="submit"
        disabled={isDisabled}
        className="w-full max-w-xs self-center"
      >
        {isUpdating
          ? 'Updating...'
          : isCreating
          ? 'Creating...'
          : form.id
          ? 'Update'
          : 'Create'}
      </ButtonOld>
      {form.id && (
        <>
          <Link
            href={`/${form.type?.toLowerCase()}s/${form.id}`}
            className="mx-2 w-full max-w-xs self-center"
          >
            <ButtonOld
              type="button"
              intent="success"
              disabled={isDisabled}
              className="w-full max-w-xs self-center"
            >
              View
            </ButtonOld>
          </Link>
          <ButtonOld
            type="button"
            intent="danger"
            onClick={handleDelete}
            disabled={isDisabled}
            className="w-full max-w-xs self-center"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </ButtonOld>
        </>
      )}
    </div>
  )
}
