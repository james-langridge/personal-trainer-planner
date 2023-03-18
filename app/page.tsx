import {getPageData} from '@/lib/contentful'
import {ComponentRenderer} from '@/components/ComponentRenderer'

export default async function Home() {
  const {items} = await getPageData('home')
  const pageContent = items[0].fields.pageContent

  return (
    <main className="relative">
      {pageContent &&
        pageContent?.map(entry => (
          <ComponentRenderer key={entry.sys.id} entry={entry} />
        ))}
    </main>
  )
}
