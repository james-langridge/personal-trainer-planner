import {client} from '@/lib/client'
import {CtfPage} from '@/@types/contentful'

export const getContentfulData = async (slug: string) => {
  return await client.getEntries<CtfPage>({
    content_type: 'page',
    'fields.slug': slug,
    include: 10,
  })
}
