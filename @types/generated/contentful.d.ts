// THIS FILE IS AUTOMATICALLY GENERATED. DO NOT MODIFY IT.

import {Entry} from 'contentful'
import {Document} from '@contentful/rich-text-types'

export interface IFormFields {
  /** Name */
  name: string

  /** Slug */
  slug: string

  /** Intro text */
  introText?: Document | undefined

  /** Inputs */
  inputs?: IFormInput[] | undefined
}

export interface IForm extends Entry<IFormFields> {
  sys: {
    id: string
    type: string
    createdAt: string
    updatedAt: string
    locale: string
    contentType: {
      sys: {
        id: 'form'
        linkType: 'ContentType'
        type: 'Link'
      }
    }
  }
}

export interface IFormInputFields {
  /** Question or Text */
  questionOrText: string

  /** Input type */
  inputType: 'Single line' | 'Text box' | 'Yes or no'

  /** Required */
  required: boolean
}

export interface IFormInput extends Entry<IFormInputFields> {
  sys: {
    id: string
    type: string
    createdAt: string
    updatedAt: string
    locale: string
    contentType: {
      sys: {
        id: 'formInput'
        linkType: 'ContentType'
        type: 'Link'
      }
    }
  }
}

export type CONTENT_TYPE = 'form' | 'formInput'

export type IEntry = IForm | IFormInput

export type LOCALE_CODE = 'de-DE' | 'en-US'

export type CONTENTFUL_DEFAULT_LOCALE_CODE = 'en-US'
