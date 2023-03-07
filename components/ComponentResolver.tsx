import {Entry} from 'contentful'
import {IEntry} from '@/@types/generated/contentful'
import {componentMap} from '@/components/mappings'
import React from 'react'

export function ComponentResolver(
  entry: any,
): React.FunctionComponentElement<any> | undefined {
  const entryType = entry.sys.contentType.sys.id
  const component = componentMap[entryType as keyof typeof componentMap]

  if (typeof component !== 'undefined') {
    let childrenEntries: Entry<IEntry>[] = []
    for (const field in entry.fields) {
      if (Array.isArray(entry.fields[field])) {
        childrenEntries = entry.fields[field]
      }
    }

    return React.createElement(
      component,
      {entry, key: entry.sys.id},
      childrenEntries.length &&
        childrenEntries.map(entry => ComponentResolver(entry)),
    )
  }

  return
}
