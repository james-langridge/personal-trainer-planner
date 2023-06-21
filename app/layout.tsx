import '../styles/globals.css'
import {redirect} from 'next/navigation'
import {getServerSession} from 'next-auth/next'
import React from 'react'

import {authOptions} from '@/app/api/auth/[...nextauth]/route'
import Providers from '@/app/Providers'
import {CalendarNavbar} from '@/components'

export const metadata = {
  title: 'Fit For Life Trainer',
  description: 'Fit For Life Personal Training to transform your way of life.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <Providers>
      <html lang="en">
        <body>
          <div className="relative min-h-screen pt-16 dark:bg-gray-900">
            <div className="pb-[1066px] sm:pb-[614px] md:pb-[534px] lg:pb-[438px] xl:pb-[354px] 2xl:pb-[326px]">
              <CalendarNavbar />
              <>{children}</>
            </div>
          </div>
        </body>
      </html>
    </Providers>
  )
}
