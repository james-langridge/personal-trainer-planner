import {getPageData} from '@/lib/contentful'
import {ComponentResolver} from '@/components/ComponentResolver'
import Heading from '@/components/Heading'

export default async function Home() {
  const {items} = await getPageData('home')
  const heading = items[0].fields.pageHeading
  const pageContent = items[0].fields.pageContent

  return (
    <main className="relative">
      {heading && <Heading heading={heading} />}
      {pageContent && pageContent?.map(entry => ComponentResolver(entry))}
    </main>
  )
}
