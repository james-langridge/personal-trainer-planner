import {IEntry, IPageFields} from '@/@types/generated/contentful'
import {Entry} from 'contentful'

export type CtfPage = Omit<IPageFields, 'pageContent'> & {
  pageContent: Entry<IEntry>[]
}
