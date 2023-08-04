import {USER_TYPE} from '@prisma/client'
import React from 'react'

import {Tabs, TabsList, TabsTrigger} from '@/components/tabs'

export function ClientTypeSwitch({
  toggleClientType,
}: {
  toggleClientType: (value: string) => void
}) {
  return (
    <Tabs
      onValueChange={value => toggleClientType(value)}
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
