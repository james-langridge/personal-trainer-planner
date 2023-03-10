import {ComponentResolver} from '@/components/ComponentResolver'
import {getPageData} from '@/lib/contentful'

export default async function Page({params}: {params: {slug: string}}) {
  const {slug} = params
  const pageData = await getPageData(slug)
  const pageContent = pageData.items[0].fields.pageContent

  return (
    <main className="relative">
      {pageContent && pageContent?.map(entry => ComponentResolver(entry))}
    </main>
  )
}
