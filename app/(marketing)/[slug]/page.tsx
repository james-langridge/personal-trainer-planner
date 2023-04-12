import {CtfComponentRenderer} from '@/components/contentful/CtfComponentRenderer'
import {getByContentTypeId} from '@/lib/contentful'
import {notFound} from 'next/navigation'

// Using the Contentful SDK instead of the Fetch API, for dynamic segments,
// the output of the request will not be cached and will be re-fetched on
// every request when the segment is rendered.
// https://beta.nextjs.org/docs/data-fetching/fetching#default-caching-behavior
// 'force-static' forces static rendering and static data fetching of a layout or page
// by forcing cookies(), headers() and useSearchParams() to return empty values.
// https://beta.nextjs.org/docs/api-reference/segment-config#dynamic
export const dynamic = 'force-static'

export async function generateStaticParams() {
  const {items} = await getByContentTypeId('page', {
    select: 'fields.slug',
  })

  return items.map(item => ({
    slug: item.fields.slug,
  }))
}

export default async function Page({params}: {params: {slug: string}}) {
  const {slug} = params
  const {items} = await getByContentTypeId('page', {
    'fields.slug': slug,
    include: 10,
  })

  if (!items.length) {
    notFound()
  }

  const pageContent = items[0].fields.pageContent

  return (
    <main>
      {pageContent &&
        pageContent?.map(entry => {
          return <CtfComponentRenderer key={entry.sys.id} entry={entry} />
        })}
    </main>
  )
}
