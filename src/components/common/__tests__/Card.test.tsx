import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, screen, userEvent } from '@test/utils'
import Card from '../Card'

describe('Card Component', () => {
  it('renders children content', () => {
    renderWithProviders(
      <Card>
        <h2>Test Card Content</h2>
        <p>This is a test card</p>
      </Card>
    )

    expect(screen.getByRole('region')).toBeInTheDocument()
    expect(screen.getByText('Test Card Content')).toBeInTheDocument()
    expect(screen.getByText('This is a test card')).toBeInTheDocument()
  })

  it('applies correct variant classes', () => {
    const { rerender } = renderWithProviders(
      <Card variant="default">Content</Card>
    )

    let card = screen.getByRole('region')
    expect(card).toHaveClass('card', 'default')

    rerender(<Card variant="elevated">Content</Card>)
    card = screen.getByRole('region')
    expect(card).toHaveClass('card', 'elevated')
  })

  it('becomes interactive when onClick is provided', () => {
    const handleClick = vi.fn()
    
    renderWithProviders(
      <Card onClick={handleClick} ariaLabel="Clickable test card">
        Test Content
      </Card>
    )

    const card = screen.getByRole('button')
    expect(card).toHaveAttribute('tabIndex', '0')
    expect(card).toHaveAttribute('aria-label', 'Clickable test card')
  })

  it('handles click events', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    
    renderWithProviders(
      <Card onClick={handleClick}>Clickable Card</Card>
    )

    const card = screen.getByRole('button')
    await user.click(card)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('handles keyboard events (Enter and Space)', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    
    renderWithProviders(
      <Card onClick={handleClick}>Keyboard Card</Card>
    )

    const card = screen.getByRole('button')
    
    // Test Enter key
    card.focus()
    await user.keyboard('{Enter}')
    expect(handleClick).toHaveBeenCalledTimes(1)
    
    // Test Space key
    await user.keyboard(' ')
    expect(handleClick).toHaveBeenCalledTimes(2)
  })

  it('applies custom className', () => {
    renderWithProviders(
      <Card className="custom-class">Content</Card>
    )

    const card = screen.getByRole('region')
    expect(card).toHaveClass('custom-class')
  })

  it('sets accessibility attributes correctly', () => {
    renderWithProviders(
      <Card 
        onClick={() => {}}
        ariaLabel="Test card"
        ariaDescription="This is a test card description"
        isSelected={true}
      >
        Content
      </Card>
    )

    const card = screen.getByRole('button')
    expect(card).toHaveAttribute('aria-label', 'Test card')
    expect(card).toHaveAttribute('aria-description', 'This is a test card description')
    expect(card).toHaveAttribute('aria-pressed', 'true')
  })
})