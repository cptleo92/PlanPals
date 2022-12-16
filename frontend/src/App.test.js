import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('renders properly based on register/login path', () => {
  test('full app rendering/navigating', () => {

    render (<App /> )

    userEvent.click(screen.getByText(/log in/i))
    expect(screen.getByText(/don't have an account?/i)).toBeInTheDocument()

    userEvent.click(screen.getByText(/sign up/i))
    expect(screen.getByText(/already have an/i)).toBeInTheDocument()
  })
})
