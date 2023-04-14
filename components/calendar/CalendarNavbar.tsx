import {CalendarNavbarClient} from '@/components/calendar/CalendarNavbarClient'
import {getByContentTypeId} from '@/lib/contentful'

export async function CalendarNavbar({isAdmin}: {isAdmin: boolean}) {
  const {items} = await getByContentTypeId('navbar', {
    include: 3,
  })

  const {logo} = items[0].fields
  const logoFields = logo.fields
  const navbarLogo = {
    src: `https:${logoFields.file.url}`,
    alt: logoFields.title,
    width: logoFields.file.details.image?.width,
    height: logoFields.file.details.image?.height,
  }

  return <CalendarNavbarClient logo={navbarLogo} isAdmin={isAdmin} />
}
