import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderWithProviders, screen, userEvent, waitFor } from '@test/utils'
import Settings from '../Settings'

// Mock the audio functions
vi.mock('@utils/audioFx', () => ({
  isAudioEnabled: vi.fn().mockReturnValue(false),
  setAudioEnabled: vi.fn(),
}))

describe('Settings Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders settings page correctly', () => {
    renderWithProviders(<Settings />)

    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('Configure your AgentSystems UI')).toBeInTheDocument()
    expect(screen.getByText('Connection')).toBeInTheDocument()
    expect(screen.getByText('Appearance')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
  })

  it('displays form fields correctly', () => {
    renderWithProviders(<Settings />)

    expect(screen.getByLabelText('Gateway URL')).toBeInTheDocument()
    expect(screen.getByLabelText('Auth Token')).toBeInTheDocument()
    expect(screen.getByLabelText('Theme')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save connection settings/i })).toBeInTheDocument()
  })

  it('shows cyber-specific options when cyber theme is selected', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Settings />)

    const themeSelect = screen.getByLabelText('Theme')
    await user.selectOptions(themeSelect, 'cyber')

    await waitFor(() => {
      expect(screen.getByText('Enable matrix scanline effect')).toBeInTheDocument()
      expect(screen.getByText('Enable sound effects')).toBeInTheDocument()
    })
  })

  it('shows scanline frequency when scanline is enabled', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Settings />)

    // First select cyber theme
    const themeSelect = screen.getByLabelText('Theme')
    await user.selectOptions(themeSelect, 'cyber')

    // Then enable scanline
    await waitFor(() => {
      const scanlineCheckbox = screen.getByRole('checkbox', { name: /enable matrix scanline effect/i })
      expect(scanlineCheckbox).toBeInTheDocument()
    })

    const scanlineCheckbox = screen.getByRole('checkbox', { name: /enable matrix scanline effect/i })
    await user.click(scanlineCheckbox)

    await waitFor(() => {
      expect(screen.getByLabelText('Scanline Frequency')).toBeInTheDocument()
    })
  })

  it('validates form inputs and shows errors', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Settings />)

    // Clear the gateway URL to trigger validation error
    const gatewayInput = screen.getByLabelText('Gateway URL')
    await user.clear(gatewayInput)

    // Clear the auth token to trigger validation error
    const tokenInput = screen.getByLabelText('Auth Token')
    await user.clear(tokenInput)

    // Try to save
    const saveButton = screen.getByRole('button', { name: /save connection settings/i })
    await user.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText('Please fix the validation errors before saving')).toBeInTheDocument()
    })
  })

  it('sanitizes malicious input', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Settings />)

    const gatewayInput = screen.getByLabelText('Gateway URL')
    
    // Try to enter a malicious URL
    await user.clear(gatewayInput)
    await user.type(gatewayInput, 'javascript:alert("xss")')

    const saveButton = screen.getByRole('button', { name: /save connection settings/i })
    await user.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText(/contains invalid characters/i)).toBeInTheDocument()
    })
  })

  it('displays version information correctly', () => {
    renderWithProviders(<Settings />)

    expect(screen.getByText('Version')).toBeInTheDocument()
    expect(screen.getByText('0.1.0')).toBeInTheDocument()
    expect(screen.getByText('Gateway')).toBeInTheDocument()
  })
})