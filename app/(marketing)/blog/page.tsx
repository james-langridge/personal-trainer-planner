import {Entry} from 'contentful'
import Image from 'next/image'
import Link from 'next/link'
import {getByContentTypeId} from '@/lib/contentful'
import {IImageFields} from '@/@types/generated/contentful'
import {RANDOM_IMG_URL} from '@/lib/constants'

interface Props {
  image: Entry<IImageFields>
  slug: string
  pageName: string
  createdAt: string
}

function BlogCard({image, createdAt, pageName, slug}: Props) {
  const {details, url} = image.fields.image.fields.file
  const imageSrc = `https:${url || RANDOM_IMG_URL}`
  const width = details.image?.width || 300
  const height = details.image?.height || 300
  const date = new Date(createdAt).toDateString()

  return (
    <div className="lg:flex">
      <Image
        className="h-56 w-full rounded-lg object-cover lg:w-64"
        src={imageSrc}
        alt="Blog post image"
        width={width}
        height={height}
      />
      <div className="flex flex-col justify-between py-6 lg:mx-6">
        <Link
          href={slug}
          className="text-xl font-semibold text-gray-800 hover:underline dark:text-white "
        >
          {pageName}
        </Link>
        <span className="text-sm text-gray-500 dark:text-gray-300">{date}</span>
      </div>
    </div>
  )
}

export default async function Blog() {
  const {items} = await getByContentTypeId('page', {
    'fields.isBlogPost': true,
    include: 10,
  })

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold capitalize text-gray-800 dark:text-white lg:text-3xl">
          From the blog
        </h1>
        <div className="mt-8 grid grid-cols-1 gap-8 md:mt-16 md:grid-cols-2">
          {items.map(item => {
            const {sys, fields} = item
            const {pageContent, slug, pageName} = fields
            const {id, createdAt} = sys
            const image = pageContent?.find(
              item => item.sys.contentType.sys.id === 'image',
            ) as Entry<IImageFields>

            return (
              <BlogCard
                key={id}
                image={image}
                slug={slug}
                pageName={pageName}
                createdAt={createdAt}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
