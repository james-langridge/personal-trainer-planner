import {IEntry} from '@/@types/generated/contentful'
import {componentMap} from '@/components/mappings'
import React from 'react'
import {Entry} from 'contentful'

export const ComponentRenderer: React.FC<{entry: Entry<IEntry>}> = ({
  entry,
}) => {
  const {contentType} = entry.sys
  const entryType = contentType.sys.id
  const Component = componentMap[entryType] as React.ComponentType<any>
  const {fields} = entry
  let childrenEntries: Entry<IEntry>[] = []

  for (const [_, value] of Object.entries(fields)) {
    if (Array.isArray(value)) {
      childrenEntries = value
      break
    }
  }

  if (!Component) {
    return null
  }

  return (
    <Component entry={entry} key={entry.sys.id}>
      {childrenEntries.length &&
        childrenEntries.map(entry => (
          <ComponentRenderer key={entry.sys.id} entry={entry} />
        ))}
    </Component>
  )
}
