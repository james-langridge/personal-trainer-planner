import {Entry} from 'contentful'
import {INavbarFields} from '@/@types/generated/contentful'
import Image from 'next/image'
import Link from 'next/link'

function Navbar({entry}: {entry: Entry<INavbarFields>}) {
  const {navbarItems, logo} = entry.fields

  return (
    <div className="fixed top-0 z-50 flex w-full flex-wrap justify-end gap-5 bg-slate-100 p-5">
      <div className="grow">
        <Link href="/">
          <Image
            src={`https:${logo.fields.file.url}`}
            alt={logo.fields.title}
            width={logo.fields.file.details.image?.width}
            height={logo.fields.file.details.image?.height}
            className="max-h-10 w-auto"
          />
        </Link>
      </div>
      {navbarItems?.map(item => (
        <Link key={item.sys.id} href={item.fields.link}>
          {item.fields.label}
        </Link>
      ))}
    </div>
  )
}

export default Navbar
