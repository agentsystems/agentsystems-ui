import { type HostingProviderSupport } from '../../data/modelCatalogUnified'
import styles from './HostingProviderSelector.module.css'

interface HostingProviderSelectorProps {
  value: string
  onChange: (hostingProviderId: string) => void
  availableProviders: HostingProviderSupport[]
  error?: string
  disabled?: boolean
  className?: string
}

export default function HostingProviderSelector({ 
  value, 
  onChange, 
  availableProviders,
  error, 
  disabled = false,
  className = '' 
}: HostingProviderSelectorProps) {
  return (
    <div className={`${styles.formGroup} ${className}`}>
      <label htmlFor="hosting-provider">Hosting Provider</label>
      <select
        id="hosting-provider"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        disabled={disabled || availableProviders.length === 0}
        required
      >
        <option value="">Select a hosting provider...</option>
        {availableProviders.map(provider => (
          <option key={provider.id} value={provider.id}>
            {provider.displayName}
          </option>
        ))}
      </select>
      {error && (
        <span className={styles.errorText}>{error}</span>
      )}
      <span className={styles.hint}>
        {availableProviders.length === 0 ? 
          'Select a model first' : 
          'Hosting provider to use for this model'}
      </span>
    </div>
  )
}