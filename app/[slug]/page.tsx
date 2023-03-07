import {ComponentResolver} from '@/components/ComponentResolver'
import {getContentfulData} from '@/lib/getContentfulData'

export default async function Page({params}: {params: {slug: string}}) {
  const {slug} = params
  const contentfulData = await getContentfulData(slug)
  const heading = contentfulData.items[0].fields.pageTitle
  const pageContent = contentfulData.items[0].fields.content

  return (
    <main>
      <>
        <h1>{heading}</h1>
        {pageContent && pageContent?.map(entry => ComponentResolver(entry))}
      </>
    </main>
  )
}
