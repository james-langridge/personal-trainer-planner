import Link from 'next/link'
import React from 'react'
import {getByContentTypeId} from '@/lib/contentful'
import {FACEBOOK_URL, GITHUB_URL} from '@/lib/constants'

export default async function CtfFooter() {
  const {items} = await getByContentTypeId('footer', {
    include: 3,
  })

  const {
    leftText,
    withBlogPosts,
    numberOfBlogPostLinks = 3,
    footerLinkSections,
    contactSectionHeading,
    contactEmail,
    contactPhone,
  } = items[0].fields

  let blogPostLinksToRender = null

  if (withBlogPosts) {
    const {items} = await getByContentTypeId('page', {
      'fields.isBlogPost': true,
      include: 10,
    })

    const blogLinks = items.map(post => {
      return {
        href: post.fields.slug,
        label: post.fields.pageName,
        createdAt: post.sys.createdAt,
      }
    })

    const sortedBlogLinks = blogLinks.sort(
      (a, b) => parseInt(a.createdAt) - parseInt(b.createdAt),
    )
    blogPostLinksToRender = sortedBlogLinks.slice(0, numberOfBlogPostLinks)
  }

  return (
    <footer className="absolute bottom-0 w-full bg-white dark:bg-gray-900">
      <hr className="my-6 h-px border-none bg-gray-200 dark:bg-gray-700" />
      <div className="container mx-auto p-6">
        <div className="lg:flex">
          <div className="-mx-6 w-full lg:w-2/5">
            <div className="px-6">
              {leftText && (
                <p className="prose dark:text-gray-300 sm:pr-20">{leftText}</p>
              )}

              <div className="-mx-2 mt-6 flex">
                <Link
                  href={FACEBOOK_URL}
                  className="mx-2 text-gray-600 transition-colors duration-300 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"
                  aria-label="Facebook"
                >
                  <svg
                    className="h-5 w-5 fill-current"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2.00195 12.002C2.00312 16.9214 5.58036 21.1101 10.439 21.881V14.892H7.90195V12.002H10.442V9.80204C10.3284 8.75958 10.6845 7.72064 11.4136 6.96698C12.1427 6.21332 13.1693 5.82306 14.215 5.90204C14.9655 5.91417 15.7141 5.98101 16.455 6.10205V8.56104H15.191C14.7558 8.50405 14.3183 8.64777 14.0017 8.95171C13.6851 9.25566 13.5237 9.68693 13.563 10.124V12.002H16.334L15.891 14.893H13.563V21.881C18.8174 21.0506 22.502 16.2518 21.9475 10.9611C21.3929 5.67041 16.7932 1.73997 11.4808 2.01722C6.16831 2.29447 2.0028 6.68235 2.00195 12.002Z"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-6 lg:mt-0 lg:flex-1">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {blogPostLinksToRender && (
                <div>
                  <div className="uppercase text-gray-700 dark:text-white">
                    Blog
                  </div>
                  {blogPostLinksToRender.map(link => {
                    return (
                      <div
                        key={link.label}
                        className="flex h-12 items-center sm:h-[unset]"
                      >
                        <Link
                          href={link.href}
                          className="mt-2 block text-base text-gray-600 hover:underline dark:text-gray-400 sm:text-sm"
                        >
                          {link.label}
                        </Link>
                      </div>
                    )
                  })}
                </div>
              )}

              {footerLinkSections &&
                footerLinkSections.map(section => {
                  return (
                    <div key={section.sys.id}>
                      <div className="uppercase text-gray-700 dark:text-white">
                        {section.fields.heading}
                      </div>
                      {section.fields.links.map(link => {
                        return (
                          <div
                            key={link.sys.id}
                            className="flex h-12 items-center sm:h-[unset]"
                          >
                            <Link
                              key={link.sys.id}
                              href={link.fields.href}
                              className="mt-2 block text-base text-gray-600 hover:underline dark:text-gray-400 sm:text-sm"
                            >
                              {link.fields.label}
                            </Link>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}

              <div>
                <div className="uppercase text-gray-700 dark:text-white">
                  {contactSectionHeading?.toUpperCase()}
                </div>
                <span className="mt-2 block text-sm text-gray-600 dark:text-gray-400">
                  {contactPhone}
                </span>
                <span className="mt-2 block text-sm text-gray-600 dark:text-gray-400">
                  {contactEmail}
                </span>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-6 h-px border-none bg-gray-200 dark:bg-gray-700" />

        <div>
          <p className="text-center text-gray-500 dark:text-gray-400">
            © Copyright 2023 - All rights reserved. Site made by&nbsp;
            <Link href={GITHUB_URL} target="_blank">
              James Langridge{' '}
              <svg
                className="inline h-5 w-5 fill-current"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.026 2C7.13295 1.99937 2.96183 5.54799 2.17842 10.3779C1.395 15.2079 4.23061 19.893 8.87302 21.439C9.37302 21.529 9.55202 21.222 9.55202 20.958C9.55202 20.721 9.54402 20.093 9.54102 19.258C6.76602 19.858 6.18002 17.92 6.18002 17.92C5.99733 17.317 5.60459 16.7993 5.07302 16.461C4.17302 15.842 5.14202 15.856 5.14202 15.856C5.78269 15.9438 6.34657 16.3235 6.66902 16.884C6.94195 17.3803 7.40177 17.747 7.94632 17.9026C8.49087 18.0583 9.07503 17.99 9.56902 17.713C9.61544 17.207 9.84055 16.7341 10.204 16.379C7.99002 16.128 5.66202 15.272 5.66202 11.449C5.64973 10.4602 6.01691 9.5043 6.68802 8.778C6.38437 7.91731 6.42013 6.97325 6.78802 6.138C6.78802 6.138 7.62502 5.869 9.53002 7.159C11.1639 6.71101 12.8882 6.71101 14.522 7.159C16.428 5.868 17.264 6.138 17.264 6.138C17.6336 6.97286 17.6694 7.91757 17.364 8.778C18.0376 9.50423 18.4045 10.4626 18.388 11.453C18.388 15.286 16.058 16.128 13.836 16.375C14.3153 16.8651 14.5612 17.5373 14.511 18.221C14.511 19.555 14.499 20.631 14.499 20.958C14.499 21.225 14.677 21.535 15.186 21.437C19.8265 19.8884 22.6591 15.203 21.874 10.3743C21.089 5.54565 16.9181 1.99888 12.026 2Z"></path>
              </svg>
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
