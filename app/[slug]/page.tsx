import {ComponentResolver} from '@/components/ComponentResolver'
import {getPageData} from '@/lib/contentful'
import {notFound} from 'next/navigation'

export default async function Page({params}: {params: {slug: string}}) {
  const {slug} = params
  const pageData = await getPageData(slug)

  if (!pageData.items.length) {
    notFound()
  }

  const heading = pageData.items[0].fields.pageHeading
  const pageContent = pageData.items[0].fields.pageContent

  return (
    <main className="relative">
      {heading && (
        <h1 className="weight my-10 text-center text-5xl font-bold">
          {heading}
        </h1>
      )}
      {pageContent && pageContent?.map(entry => ComponentResolver(entry))}
    </main>
  )
}
