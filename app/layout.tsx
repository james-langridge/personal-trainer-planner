import '../styles/globals.css'
import React from 'react'

import Providers from '@/app/Providers'
import {CalendarNavbar} from '@/components/CalendarNavbar'

export const metadata = {
  title: 'Fit For Life Trainer',
  description: 'Fit For Life Personal Training to transform your way of life.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="relative min-h-screen pt-16 dark:bg-gray-900">
          <div className="pb-[1066px] sm:pb-[614px] md:pb-[534px] lg:pb-[438px] xl:pb-[354px] 2xl:pb-[326px]">
            <Providers>
              <CalendarNavbar />
              {children}
            </Providers>
          </div>
        </div>
        <div id="modal"></div>
      </body>
    </html>
  )
}
