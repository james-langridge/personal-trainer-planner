import React from 'react'
import CtfNavbar from '@/components/contentful/CtfNavbar'
import CtfFooter from '@/components/contentful/CtfFooter'

export const metadata = {
  title: 'Fit For Life Trainer',
  description: 'Fit For Life Personal Training to transform your way of life.',
}

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen pt-16 dark:bg-gray-900">
      <div className="pb-[1066px] sm:pb-[614px] md:pb-[534px] lg:pb-[438px] xl:pb-[354px] 2xl:pb-[326px]">
        {await CtfNavbar()}
        <div>{children}</div>
      </div>
      {await CtfFooter()}
    </div>
  )
}
