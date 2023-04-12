import CtfNavbarClient from '@/components/contentful/CtfNavbarClient'
import {getByContentTypeId} from '@/lib/contentful'

export default async function CtfNavbar() {
  const {items} = await getByContentTypeId('navbar', {
    include: 3,
  })

  const {logo, navbarItems} = items[0].fields
  const logoFields = logo.fields
  const navbarLogo = {
    src: `https:${logoFields.file.url}`,
    alt: logoFields.title,
    width: logoFields.file.details.image?.width,
    height: logoFields.file.details.image?.height,
  }
  const navigation = navbarItems?.map(item => {
    return {name: item.fields.label, href: item.fields.link, current: false}
  })

  return <CtfNavbarClient navigation={navigation} logo={navbarLogo} />
}
