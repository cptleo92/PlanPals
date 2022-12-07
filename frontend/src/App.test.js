import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('renders properly based on register/login path', () => {
  test('full app rendering/navigating', () => {

    render (<App /> )

    expect(screen.getByText(/front page/i)).toBeInTheDocument()

    userEvent.click(screen.getByText(/login/i))
    expect(screen.getByText(/don't have an account?/i)).toBeInTheDocument()

    userEvent.click(screen.getByText(/register/i))
    expect(screen.getByText(/already have an/i)).toBeInTheDocument()
  })
})
