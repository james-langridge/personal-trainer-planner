import {IEntry} from '@/@types/generated/contentful'
import {componentMap} from '@/components/mappings'
import React from 'react'
import {Entry} from 'contentful'

export interface IIndexable {
  [key: string]: any
}

export function ComponentResolver(
  entry: Entry<IEntry>,
): React.ReactElement | null {
  const entryType = entry.sys.contentType.sys.id
  const component = componentMap[entryType as keyof typeof componentMap]
  const {fields} = entry

  if (typeof component !== 'undefined') {
    let childrenEntries: Entry<IEntry>[] = []
    for (const field in fields) {
      if (Array.isArray((fields as IIndexable)[field])) {
        childrenEntries = (fields as IIndexable)[field]
      }
    }

    return React.createElement(
      // FIXME
      // https://stackoverflow.com/questions/61667608/how-do-you-correctly-use-react-lazy-in-typescript-to-import-a-react-component
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      component,
      {entry, key: entry.sys.id},
      childrenEntries.length &&
        childrenEntries.map(entry => ComponentResolver(entry)),
    )
  }

  return null
}
