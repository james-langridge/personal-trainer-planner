import {USER_TYPE} from '@prisma/client'
import React from 'react'

import {Switch} from '@/components/Switch'

export function ClientTypeSwitch({
  clientType,
  toggleClientType,
}: {
  clientType: USER_TYPE
  toggleClientType: () => void
}) {
  return (
    <div className="mx-1 flex">
      <div>Individuals</div>
      <Switch
        className="mx-2"
        onCheckedChange={() => toggleClientType()}
        checked={clientType === 'BOOTCAMP'}
      />
      <div>Bootcampers</div>
    </div>
  )
}
