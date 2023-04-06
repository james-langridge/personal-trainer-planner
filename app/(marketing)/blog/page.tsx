import {Entry} from 'contentful'
import Image from 'next/image'
import Link from 'next/link'
import {getBlogPosts} from '@/lib/contentful'
import {IEntry, IImageFields} from '@/@types/generated/contentful'
import {RANDOM_IMG_URL} from '@/lib/constants'

interface Props {
  blogPost: Entry<IEntry>[]
  slug: string
  pageName: string
  createdAt: string
}

function BlogCard({blogPost, createdAt, pageName, slug}: Props) {
  const image = blogPost.find(
    item => item.sys.contentType.sys.id === 'image',
  ) as unknown as Entry<IImageFields>
  const imageSrc = `https:${image.fields.image.fields.file.url}`
  const date = new Date(createdAt)

  return (
    <div className="lg:flex">
      <Image
        className="h-56 w-full rounded-lg object-cover lg:w-64"
        src={imageSrc || RANDOM_IMG_URL}
        alt=""
        width={image.fields.image.fields.file.details.image?.width || 300}
        height={image.fields.image.fields.file.details.image?.height || 300}
      />
      <div className="flex flex-col justify-between py-6 lg:mx-6">
        <Link
          href={slug}
          className="text-xl font-semibold text-gray-800 hover:underline dark:text-white "
        >
          {pageName}
        </Link>
        <span className="text-sm text-gray-500 dark:text-gray-300">
          {date.toDateString()}
        </span>
      </div>
    </div>
  )
}

export default async function Blog() {
  const {items} = await getBlogPosts()

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold capitalize text-gray-800 dark:text-white lg:text-3xl">
          From the blog
        </h1>
        <div className="mt-8 grid grid-cols-1 gap-8 md:mt-16 md:grid-cols-2">
          {items.map(item => (
            <BlogCard
              key={item.sys.id}
              blogPost={item.fields.pageContent}
              slug={item.fields.slug}
              pageName={item.fields.pageName}
              createdAt={item.sys.createdAt}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
