import {USER_TYPE} from '@prisma/client'
import React, {Dispatch, SetStateAction} from 'react'

import {Tabs, TabsList, TabsTrigger} from '@/components/tabs'

export function ClientTypeSwitch({
  toggleClientType,
}: {
  toggleClientType: Dispatch<SetStateAction<USER_TYPE>>
}) {
  return (
    <Tabs
      onValueChange={value => toggleClientType(value as USER_TYPE)}
      defaultValue={USER_TYPE.INDIVIDUAL}
      className="w-[400px]"
    >
      <TabsList>
        <TabsTrigger value={USER_TYPE.INDIVIDUAL}>Individuals</TabsTrigger>
        <TabsTrigger value={USER_TYPE.BOOTCAMP}>Bootcampers</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
