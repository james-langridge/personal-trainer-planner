import {createClient, EntryCollection} from 'contentful'
import {CONTENT_TYPE, IEntry} from '@/@types/generated/contentful'

// The types below allow TS to know the correct type returned by getByContentTypeId()
// so it does not complain that it does not know the fields of the entries
// https://roy-y-cheng.medium.com/contentful-model-typescript-code-generation-fe04cc276d26
type ContentType = IEntry
type ContentEntry<ID extends CONTENT_TYPE> = Pick<ContentType, 'fields'> & {
  sys: {contentType: {sys: {id: ID}}}
}
type ContentTypeID<CT extends ContentType = ContentType> =
  CT['sys']['contentType']['sys']['id']
type ContentEntryByID<ID extends CONTENT_TYPE> = Extract<
  ContentType,
  ContentEntry<ID>
>

export const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
})

export const getByContentTypeId = async <
  CTID extends ContentTypeID,
  CE extends ContentEntryByID<CTID>,
>(
  contentTypeID: CTID,
  options: Record<string, any>,
): Promise<EntryCollection<CE['fields']>> => {
  return client.getEntries({content_type: contentTypeID, ...options})
}
