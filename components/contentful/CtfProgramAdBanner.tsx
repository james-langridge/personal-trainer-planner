import {Entry} from 'contentful'
import {IProgramAdBannerFields} from '@/@types/generated/contentful'
import React from 'react'

interface Props {
  children: React.ReactNode
  entry: Entry<IProgramAdBannerFields>
}

export function CtfProgramAdBanner({children, entry}: Props) {
  return (
    <div className="my-10 bg-[#90d6da] py-14">
      <h1 className="text-center font-sans text-4xl font-bold text-white">
        {entry.fields.heading}
      </h1>
      <div className="m-auto w-[94%] py-7 md:flex md:justify-evenly">
        {children}
      </div>
    </div>
  )
}
