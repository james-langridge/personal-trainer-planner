import '../styles/globals.css'

import Providers from '@/app/Providers'
import {auth} from '@/auth'
import {Navbar} from '@/components/Navbar'
import {Toaster} from '@/components/toaster'
import {AutoRefresh} from '@/app/AutoRefresh'
import {redirect} from 'next/navigation'

export const metadata = {
  title: 'Fit For Life Trainer',
  description: 'Fit For Life Personal Training to transform your way of life.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <html lang="en">
      <body>
        <div className="relative min-h-screen pt-16 dark:bg-gray-900">
          <div className="pb-[1066px] sm:pb-[614px] md:pb-[534px] lg:pb-[438px] xl:pb-[354px] 2xl:pb-[326px]">
            <AutoRefresh />
            <Providers>
              <Navbar isAdmin={session?.user?.role === 'admin'} />
              {children}
            </Providers>
          </div>
        </div>
        <div id="modal"></div>
        <Toaster />
      </body>
    </html>
  )
}
