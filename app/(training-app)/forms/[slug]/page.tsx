import {getByContentTypeId} from '@/lib/contentful'
import {notFound} from 'next/navigation'
import {documentToReactComponents} from '@contentful/rich-text-react-renderer'
import Container from '@/components/Container'
import React from 'react'
import Form from '@/app/(training-app)/forms/Form'

// TODO: On dev I got this error after submitting the form and hovering on navbar links.
//  On production it seems okay.
//  Unhandled Runtime Error
//  Error: Dynamic server usage: force-dynamic
// export const dynamic = 'force-dynamic'

// TODO: Without the above dynamic var, I got this error on dev after submitting the form and hovering on navbar links.
//  On production it seems okay.
//  Unhandled Runtime Error
//  Error: Dynamic server usage: cookies

export async function generateStaticParams() {
  const {items} = await getByContentTypeId('form', {
    select: 'fields.slug',
  })

  return items.map(item => ({
    slug: item.fields.slug,
  }))
}

export default async function FormContainer({
  params,
}: {
  params: {slug: string}
}) {
  const {slug} = params
  const {items} = await getByContentTypeId('form', {
    'fields.slug': slug,
    include: 10,
  })

  if (!items.length) {
    notFound()
  }

  const {name, introText, inputs} = items[0].fields

  return (
    <Container>
      <div className="flex flex-col items-center">
        <h1 className="text-6xl font-bold leading-tight tracking-tighter">
          {name}
        </h1>
        <div className="prose mb-5">
          {introText && documentToReactComponents(introText)}
        </div>
        <Form inputs={inputs} />
      </div>
    </Container>
  )
}
