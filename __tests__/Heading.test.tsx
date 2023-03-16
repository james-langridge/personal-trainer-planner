import {render} from '@testing-library/react'
import Heading from '../components/Heading'
import '@testing-library/jest-dom'

describe('Heading', () => {
  it('renders the heading text', () => {
    const heading = 'Hello, world!'
    const {getByText} = render(<Heading heading={heading} />)
    expect(getByText(heading.toUpperCase())).toBeInTheDocument()
  })
})
