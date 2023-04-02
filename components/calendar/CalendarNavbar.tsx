import CalendarNavbarClient from '@/components/calendar/CalendarNavbarClient'
import {getNavbar} from '@/lib/contentful'

export default async function CalendarNavbar({isAdmin}: {isAdmin: boolean}) {
  const {fields} = await getNavbar()
  const logoFields = fields.logo.fields
  const navbarLogo = {
    src: `https:${logoFields.file.url}`,
    alt: logoFields.title,
    width: logoFields.file.details.image?.width,
    height: logoFields.file.details.image?.height,
  }

  return <CalendarNavbarClient logo={navbarLogo} isAdmin={isAdmin} />
}
