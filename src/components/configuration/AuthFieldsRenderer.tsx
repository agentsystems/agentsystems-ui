import { type AuthFieldConfig, type AuthMethodConfig } from '../../data/modelCatalogUnified'
import { useConfigStore } from '@stores/configStore'
import styles from './AuthFieldsRenderer.module.css'

interface AuthFieldsRendererProps {
  authFields: AuthFieldConfig[]
  authConfig: AuthMethodConfig | null
  formData: Record<string, any>
  errors: Record<string, string>
  onFieldChange: (fieldName: string, value: string) => void
}

export default function AuthFieldsRenderer({ 
  authFields, 
  authConfig, 
  formData, 
  errors, 
  onFieldChange 
}: AuthFieldsRendererProps) {
  const { getEnvVars } = useConfigStore()
  const envVars = getEnvVars()
  const availableEnvVars = envVars.map(env => env.key)

  const renderAuthField = (field: AuthFieldConfig) => {
    const value = formData[field.name] || ''
    const error = errors[field.name]
    
    switch (field.type) {
      case 'env_select':
        return (
          <div key={field.name} className={styles.formGroup}>
            <label htmlFor={field.name}>{field.label}</label>
            <select
              id={field.name}
              value={value}
              onChange={(e) => onFieldChange(field.name, e.target.value)}
              className={`${styles.input} ${error ? styles.inputError : ''}`}
              required={field.required}
            >
              <option value="">{field.placeholder || 'Select...'}</option>
              {availableEnvVars.map(key => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
            {error && <span className={styles.errorText}>{error}</span>}
            {field.helpText && <span className={styles.hint}>{field.helpText}</span>}
          </div>
        )
        
      case 'select':
        return (
          <div key={field.name} className={styles.formGroup}>
            <label htmlFor={field.name}>{field.label}</label>
            <select
              id={field.name}
              value={value}
              onChange={(e) => onFieldChange(field.name, e.target.value)}
              className={`${styles.input} ${error ? styles.inputError : ''}`}
              required={field.required}
            >
              <option value="">Select...</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && <span className={styles.errorText}>{error}</span>}
            {field.helpText && <span className={styles.hint}>{field.helpText}</span>}
          </div>
        )
        
      case 'url':
      case 'text':
        return (
          <div key={field.name} className={styles.formGroup}>
            <label htmlFor={field.name}>{field.label}</label>
            <input
              id={field.name}
              type={field.type === 'url' ? 'url' : 'text'}
              value={value}
              onChange={(e) => onFieldChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className={`${styles.input} ${error ? styles.inputError : ''}`}
              required={field.required}
            />
            {error && <span className={styles.errorText}>{error}</span>}
            {field.helpText && <span className={styles.hint}>{field.helpText}</span>}
          </div>
        )
        
      default:
        return null
    }
  }

  if (authFields.length === 0) {
    if (authConfig?.helpText) {
      return (
        <div className={styles.hint}>
          {authConfig.helpText}
        </div>
      )
    }
    return null
  }

  // Group fields into rows for better layout
  const rows: AuthFieldConfig[][] = []
  
  // Special handling for AWS credentials - put access and secret key side by side
  if (authConfig?.type === 'aws_credentials') {
    rows.push(authFields.slice(0, 2)) // Access key and secret key
    authFields.slice(2).forEach(field => rows.push([field])) // Region on its own
  } 
  // Special handling for GCP OAuth - service account key on its own, project ID and region side by side
  else if (authConfig?.type === 'gcp_oauth') {
    const serviceAccountField = authFields.find(f => f.name === 'gcpServiceAccountKeyEnv')
    const projectIdField = authFields.find(f => f.name === 'gcpProjectId')
    const regionField = authFields.find(f => f.name === 'gcpRegion')
    
    if (serviceAccountField) rows.push([serviceAccountField])
    if (projectIdField && regionField) rows.push([projectIdField, regionField])
  }
  // Default: each field on its own row
  else {
    authFields.forEach(field => rows.push([field]))
  }

  return (
    <div className={styles.authFields}>
      {authConfig?.helpText && (
        <div className={styles.hint}>{authConfig.helpText}</div>
      )}
      {rows.map((row, idx) => (
        row.length > 1 ? (
          <div key={idx} className={styles.formRow}>
            {row.map(field => renderAuthField(field))}
          </div>
        ) : (
          <div key={idx}>
            {row.map(field => renderAuthField(field))}
          </div>
        )
      ))}
    </div>
  )
}