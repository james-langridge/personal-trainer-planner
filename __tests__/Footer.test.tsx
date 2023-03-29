import React from 'react'
import {render} from '@testing-library/react'
import Footer from '../components/contentful/Footer'
import '@testing-library/jest-dom'
describe('Footer', () => {
  const leftText = {
    nodeType: 'document',
    data: {},
    content: [
      {
        nodeType: 'paragraph',
        data: {},
        content: [
          {
            nodeType: 'text',
            value: 'Lorem ipsum dolor sit amet',
            marks: [],
            data: {},
          },
        ],
      },
    ],
  }

  it('renders with the correct text', () => {
    const {getByText} = render(<Footer leftText={leftText} />)
    expect(getByText('Lorem ipsum dolor sit amet')).toBeInTheDocument()
  })

  it('renders a Facebook link', () => {
    const {getByLabelText} = render(<Footer leftText={leftText} />)
    const link = getByLabelText('Facebook')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute(
      'href',
      'https://www.facebook.com/fitforlifetrainer.co.uk',
    )
  })

  it('renders all links in the Legal section', () => {
    const {getByText} = render(<Footer leftText={leftText} />)
    expect(getByText('Privacy policy')).toBeInTheDocument()
    expect(getByText('Terms & Conditions')).toBeInTheDocument()
    expect(getByText('Cookie Policy')).toBeInTheDocument()
  })
})
