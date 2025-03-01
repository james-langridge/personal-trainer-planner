'use client'

import React, {useEffect, useState} from 'react'

import {IFormInput} from '@/@types/generated/contentful'
import {submitForm} from '@/app/actions/forms'

type Form = Record<string, string>

export default function Form({inputs}: {inputs?: IFormInput[]}) {
  const [initialForm, setInitialForm] = useState<Form>()
  const [form, setForm] = useState<Form>()
  const [error, setError] = useState<Error>()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const initialForm: Form = {}
    inputs?.forEach(input => (initialForm[input.fields.questionOrText] = ''))

    setForm(initialForm)
    setInitialForm(initialForm)
  }, [])

  function onChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm(form => ({
      ...form,
      [e.target.id]: e.target.value,
    }))
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()

    if (form) {
      setIsLoading(true)
      try {
        await submitForm(form)
        setForm(initialForm)
      } catch {
        setError(error as Error)
      }
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-prose">
      {inputs?.map(input => {
        switch (input.fields.inputType) {
          case 'Single line':
            return (
              <TextInput
                key={input.sys.id}
                input={input}
                onChange={onChange}
                form={form}
              />
            )
          case 'Text box':
            return (
              <TextArea
                key={input.sys.id}
                input={input}
                onChange={onChange}
                form={form}
              />
            )
          case 'Yes or no':
            return (
              <Radio
                key={input.sys.id}
                input={input}
                onChange={onChange}
                form={form}
              />
            )
        }
      })}
      <button
        type="submit"
        className="mt-4 w-full transform rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium capitalize tracking-wide text-white transition-colors duration-300 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 enabled:hover:bg-blue-400 disabled:cursor-wait"
        disabled={isLoading}
      >
        {isLoading ? 'Submitting...' : 'Submit'}
      </button>
      <pre style={{whiteSpace: 'normal'}}>{error?.message}</pre>
    </form>
  )
}

function TextInput({
  input,
  onChange,
  form,
}: {
  input: IFormInput
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  form?: Form
}) {
  const {questionOrText, required} = input.fields

  return (
    <label className="my-4 block text-sm text-gray-600 dark:text-gray-200">
      {questionOrText}
      <input
        id={questionOrText}
        onChange={onChange}
        required={required}
        value={form?.[questionOrText] || ''}
        type="text"
        className="mt-2 block w-full rounded-md border border-gray-200 bg-white px-5 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-400 focus:ring-opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:placeholder-gray-600 dark:focus:border-blue-400"
      />
    </label>
  )
}

function TextArea({
  input,
  onChange,
  form,
}: {
  input: IFormInput
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  form?: Form
}) {
  const {questionOrText, required} = input.fields

  return (
    <label className="my-4 block text-sm text-gray-600 dark:text-gray-200">
      {questionOrText}
      <textarea
        id={questionOrText}
        required={required}
        value={form?.[questionOrText] || ''}
        onChange={onChange}
        className="mt-2 block h-32 w-full rounded-md border border-gray-200 bg-white px-5 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-400 focus:ring-opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:placeholder-gray-600 dark:focus:border-blue-400 md:h-56"
      ></textarea>
    </label>
  )
}

function Radio({
  input,
  onChange,
  form,
}: {
  input: IFormInput
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  form?: Form
}) {
  const {questionOrText, required} = input.fields

  return (
    <fieldset className="mt-4">
      <legend>{questionOrText}</legend>
      <div>
        <label>
          <input
            id={questionOrText}
            required={required}
            name={questionOrText}
            type="radio"
            value="YES"
            checked={form?.[questionOrText] === 'YES'}
            className="mr-2"
            onChange={onChange}
          />
          YES
        </label>
      </div>

      <div>
        <label>
          <input
            id={questionOrText}
            required={required}
            name={questionOrText}
            type="radio"
            checked={form?.[questionOrText] === 'NO'}
            value="NO"
            className="mr-2"
            onChange={onChange}
          />
          NO
        </label>
      </div>
    </fieldset>
  )
}
