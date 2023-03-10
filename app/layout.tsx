import '../styles/globals.css'
import Navbar from '@/components/Navbar'
import {getNavbar} from '@/lib/contentful'

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

  return (
    <html lang="en">
      <body className="pt-20">
        <Navbar entry={navbar} />
        <div className="">{children}</div>
      </body>
    </html>
  )
}
