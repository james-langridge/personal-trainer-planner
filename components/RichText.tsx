import {BLOCKS, Document} from '@contentful/rich-text-types'
import {
  documentToReactComponents,
  Options,
} from '@contentful/rich-text-react-renderer'
import React, {ReactNode} from 'react'

interface RichtextPropsInterface {
  document: Document
}

interface ParagraphProps {
  // The children prop now needs to be listed explicitly when defining props
  // https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#updates-to-typescript-definitions
  children: React.ReactNode
}

const Paragraph = ({children}: ParagraphProps) => (
  <p className="pb-4">{children}</p>
)

export const CtfRichtext = ({document}: RichtextPropsInterface) => {
  const options: Options = {
    renderNode: {
      [BLOCKS.LIST_ITEM]: (node, children) => {
        // This removes paragraphs inserted by Contentful into lists
        // https://github.com/contentful/rich-text/issues/126#issuecomment-636926522
        const UnTaggedChildren = documentToReactComponents(node as Document, {
          renderNode: {
            [BLOCKS.PARAGRAPH]: (node, children) => children,
            [BLOCKS.LIST_ITEM]: (node, children) => children,
          },
        })

        return (
          <li>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 inline-flex text-[#00a4e3]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {UnTaggedChildren}
          </li>
        )
      },
      [BLOCKS.PARAGRAPH]: (node, children) => <Paragraph>{children}</Paragraph>,
    },
  }

  return <>{documentToReactComponents(document, options)}</>
}
