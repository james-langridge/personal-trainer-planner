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
  const {fields} = await getNavbar()
  const {items} = await getFooter()

  const footerProps = items[0].fields
  const logoFields = fields.logo.fields

  const navbarLogo = {
    src: `https:${logoFields.file.url}`,
    alt: logoFields.title,
    width: logoFields.file.details.image?.width,
    height: logoFields.file.details.image?.height,
  }

  const navigation = fields.navbarItems?.map(item => {
    return {name: item.fields.label, href: item.fields.link, current: false}
  })

  // https://github.com/vercel/next.js/issues/42292#issuecomment-1464048350
  const footer: JSX.Element = await Footer({
    props: footerProps,
  })

  return (
    <html lang="en">
      <body>
        <div className="relative min-h-screen pt-16">
          {/*https://tailwindcss.com/docs/responsive-design#using-custom-breakpoints*/}
          <div className="pb-[1010px] sm:pb-[614px] md:pb-[534px] lg:pb-[438px] xl:pb-[354px] 2xl:pb-[326px]">
            <Navbar navigation={navigation} logo={navbarLogo} />
            <div>{children}</div>
          </div>
          {footer}
        </div>
      </body>
    </html>
  )
}
