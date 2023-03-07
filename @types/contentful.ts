import {IEntry, IPageTestFields} from '@/@types/generated/contentful'
import {Entry} from 'contentful'

export type CtfPage = Omit<IPageTestFields, 'content'> & {
  content: Entry<IEntry>[]
}
