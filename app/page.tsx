import {getPageData} from '@/lib/contentful'
import {ComponentResolver} from '@/components/ComponentResolver'

export default async function Home() {
  const pageData = await getPageData('home')

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
