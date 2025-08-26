import { getModelsGroupedByVendor } from '../../data/modelCatalogUnified'
import styles from './ModelSelector.module.css'

interface ModelSelectorProps {
  value: string
  onChange: (modelId: string) => void
  error?: string
  disabled?: boolean
  className?: string
}

export default function ModelSelector({ 
  value, 
  onChange, 
  error, 
  disabled = false,
  className = '' 
}: ModelSelectorProps) {
  const modelsByVendor = getModelsGroupedByVendor()

  return (
    <div className={`${styles.formGroup} ${className}`}>
      <label htmlFor="model">Model</label>
      <select
        id="model"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        disabled={disabled}
        required
      >
        <option value="">Select a model...</option>
        {Object.entries(modelsByVendor).map(([vendor, models]) => (
          <optgroup key={vendor} label={vendor.charAt(0).toUpperCase() + vendor.slice(1)}>
            {models.map(model => (
              <option key={model.id} value={model.id}>
                {model.displayName} ({model.id})
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      {error && (
        <span className={styles.errorText}>{error}</span>
      )}
      <span className={styles.hint}>
        Choose the model to configure
      </span>
    </div>
  )
}