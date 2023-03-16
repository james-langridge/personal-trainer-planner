import {getPageData} from '@/lib/contentful'
import {ComponentRenderer} from '@/components/ComponentRenderer'
import Heading from '@/components/Heading'

export default async function Home() {
  const {items} = await getPageData('home')
  const heading = items[0].fields.pageHeading
  const pageContent = items[0].fields.pageContent

  return (
    <main className="relative">
      {heading && <Heading heading={heading} />}
      {pageContent &&
        pageContent?.map(entry => (
          <ComponentRenderer key={entry.sys.id} entry={entry} />
        ))}
    </main>
  )
}
