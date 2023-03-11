import {ComponentResolver} from '@/components/ComponentResolver'
import {getPageData} from '@/lib/contentful'
import {notFound} from 'next/navigation'
import Heading from '@/components/Heading'

export default async function Page({params}: {params: {slug: string}}) {
  const {slug} = params
  const pageData = await getPageData(slug)

  if (!pageData.items.length) {
    notFound()
  }

  const heading = pageData.items[0].fields.pageHeading
  const pageContent = pageData.items[0].fields.pageContent

  return (
    <main>
      {heading && <Heading heading={heading} />}
      {pageContent && pageContent?.map(entry => ComponentResolver(entry))}
    </main>
  )
}
