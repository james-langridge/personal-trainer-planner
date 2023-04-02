import React from 'react'
import Navbar from '@/components/contentful/Navbar'
import Footer from '@/components/contentful/Footer'

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
        {await Navbar()}
        <div>{children}</div>
      </div>
      {await Footer()}
    </div>
  )
}
