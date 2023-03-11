import '../styles/globals.css'
import Navbar from '@/components/Navbar'
import {getFooter, getNavbar} from '@/lib/contentful'
import React from 'react'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Fit For Life Trainer',
  description: 'Fit For Life Personal Training to transform your way of life.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const navbar = await getNavbar()
  const footer = await getFooter()

  return (
    <html lang="en">
      <body>
        <div className="relative min-h-screen pt-28">
          <div className="pb-80">
            <Navbar entry={navbar} />
            <div>{children}</div>
          </div>
          <Footer entry={footer} />
        </div>
      </body>
    </html>
  )
}
