import {CtfPage} from '@/@types/contentful'
import * as contentful from 'contentful'
import {
  IFooterFields,
  INavbarFields,
  IPageFields,
} from '@/@types/generated/contentful'

export const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
})

export const getPageData = async (slug: string) => {
  return await client.getEntries<CtfPage>({
    content_type: 'page',
    'fields.slug': slug,
    include: 10,
  })
}

export const getAllPageSlugs = async () => {
  return await client.getEntries<IPageFields>({
    content_type: 'page',
    select: 'fields.slug',
  })
}

export const getBlogPosts = async () => {
  return await client.getEntries<CtfPage>({
    content_type: 'page',
    'fields.isBlogPost': true,
    include: 10,
  })
}

export const getNavbar = async () => {
  return await client.getEntry<INavbarFields>(
    process.env.CONTENTFUL_NAVBAR_ENTRY_ID || '',
  )
}

export const getFooter = async () => {
  return await client.getEntry<IFooterFields>(
    process.env.CONTENTFUL_FOOTER_ENTRY_ID || '',
  )
}
