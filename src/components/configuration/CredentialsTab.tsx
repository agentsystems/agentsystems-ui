import { useState } from 'react'
import { useConfigStore } from '@stores/configStore'
import { useAudio } from '@hooks/useAudio'
import { useToast } from '@hooks/useToast'
import Card from '@components/common/Card'
import {
  PlusIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  KeyIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import styles from './CredentialsTab.module.css'

interface CredentialFormData {
  key: string
  value: string
  isSecret: boolean
}

const initialFormData: CredentialFormData = {
  key: '',
  value: '',
  isSecret: false
}

export default function CredentialsTab() {
  const [formData, setFormData] = useState<CredentialFormData>(initialFormData)
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [showValues, setShowValues] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const { playClickSound } = useAudio()
  const { showSuccess, showError } = useToast()
  
  const {
    getEnvVars,
    setEnvVar,
    deleteEnvVar,
    getReferencedEnvVars
  } = useConfigStore()

  const envVars = getEnvVars()
  const referencedVars = getReferencedEnvVars()

  const validateForm = (data: CredentialFormData, isEdit = false): boolean => {
    const newErrors: Record<string, string> = {}

    // Validate key format
    if (!data.key) {
      newErrors.key = 'Environment variable name is required'
    } else if (!/^[A-Z][A-Z0-9_]*$/.test(data.key)) {
      newErrors.key = 'Must be uppercase letters, numbers, and underscores only'
    } else if (!isEdit && envVars.some(v => v.key === data.key)) {
      newErrors.key = 'Environment variable already exists'
    }

    // Validate value
    if (!data.value) {
      newErrors.value = 'Value is required'
    } else if (data.value.includes('\n') || data.value.includes('\r')) {
      newErrors.value = 'Value cannot contain newline characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    playClickSound()

    if (!validateForm(formData, !!editingKey)) {
      showError('Please fix the validation errors')
      return
    }

    try {
      setEnvVar(formData.key, formData.value)
      
      if (editingKey) {
        showSuccess(`Updated ${formData.key}`)
        setEditingKey(null)
      } else {
        showSuccess(`Added ${formData.key}`)
      }
      
      setFormData(initialFormData)
      setErrors({})
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to save environment variable')
    }
  }

  const handleEdit = (envVar: { key: string; value: string; isSecret: boolean }) => {
    playClickSound()
    setFormData(envVar)
    setEditingKey(envVar.key)
    setErrors({})
  }

  const handleDelete = (key: string) => {
    playClickSound()
    
    if (referencedVars.has(key)) {
      showError(`Cannot delete ${key} - it is referenced by registry connections`)
      return
    }

    if (confirm(`Are you sure you want to delete ${key}?`)) {
      try {
        deleteEnvVar(key)
        showSuccess(`Deleted ${key}`)
      } catch (error) {
        showError(error instanceof Error ? error.message : 'Failed to delete environment variable')
      }
    }
  }

  const handleCancel = () => {
    playClickSound()
    setFormData(initialFormData)
    setEditingKey(null)
    setErrors({})
  }

  const toggleShowValue = (key: string) => {
    playClickSound()
    setShowValues(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const detectIsSecret = (key: string): boolean => {
    const lowerKey = key.toLowerCase()
    return lowerKey.includes('token') || 
           lowerKey.includes('password') || 
           lowerKey.includes('key') ||
           lowerKey.includes('secret')
  }

  return (
    <div className={styles.credentialsTab}>
      <div className={styles.header}>
        <div>
          <h2>Environment Variables</h2>
          <p>Manage credentials and environment variables for registry connections</p>
        </div>
      </div>

      {/* Add/Edit Form */}
      <Card className={styles.formCard}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h3>
            <KeyIcon />
            {editingKey ? `Edit ${editingKey}` : 'Add New Credential'}
          </h3>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="env-key">Name</label>
              <input
                id="env-key"
                type="text"
                value={formData.key}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase()
                  setFormData(prev => ({ 
                    ...prev, 
                    key: value,
                    isSecret: detectIsSecret(value)
                  }))
                  if (errors.key) setErrors(prev => ({ ...prev, key: '' }))
                }}
                className={`${styles.input} ${errors.key ? styles.inputError : ''}`}
                placeholder="REGISTRY_TOKEN"
                disabled={!!editingKey}
                required
              />
              {errors.key && (
                <span className={styles.errorText}>{errors.key}</span>
              )}
              <span className={styles.hint}>
                Uppercase letters, numbers, and underscores only
              </span>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="env-value">Value</label>
              <input
                id="env-value"
                type={formData.isSecret ? 'password' : 'text'}
                value={formData.value}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, value: e.target.value }))
                  if (errors.value) setErrors(prev => ({ ...prev, value: '' }))
                }}
                className={`${styles.input} ${errors.value ? styles.inputError : ''}`}
                placeholder="Enter value..."
                required
              />
              {errors.value && (
                <span className={styles.errorText}>{errors.value}</span>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.isSecret}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  isSecret: e.target.checked 
                }))}
                className={styles.checkbox}
              />
              This is a secret (mask value in UI)
            </label>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className="btn btn-primary">
              <PlusIcon />
              {editingKey ? 'Update' : 'Add'} Variable
            </button>
            
            {editingKey && (
              <button 
                type="button" 
                onClick={handleCancel}
                className="btn btn-subtle"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </Card>

      {/* Environment Variables List */}
      <Card>
        <div className={styles.listHeader}>
          <h3>Current Environment Variables ({envVars.length})</h3>
        </div>

        {envVars.length === 0 ? (
          <div className={styles.emptyState}>
            <KeyIcon />
            <h4>No environment variables</h4>
            <p>Add your first credential using the form above</p>
          </div>
        ) : (
          <div className={styles.list}>
            {envVars.map((envVar) => {
              const isReferenced = referencedVars.has(envVar.key)
              const shouldShow = showValues[envVar.key] || !envVar.isSecret
              
              return (
                <div key={envVar.key} className={styles.listItem}>
                  <div className={styles.itemHeader}>
                    <div className={styles.itemName}>
                      <KeyIcon />
                      <span className={styles.keyName}>{envVar.key}</span>
                      {isReferenced && (
                        <span className={styles.referencedBadge}>
                          Referenced
                        </span>
                      )}
                    </div>
                    
                    <div className={styles.itemActions}>
                      {envVar.isSecret && (
                        <button
                          onClick={() => toggleShowValue(envVar.key)}
                          className="btn btn-sm btn-ghost"
                          title={shouldShow ? 'Hide value' : 'Show value'}
                        >
                          {shouldShow ? <EyeSlashIcon /> : <EyeIcon />}
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleEdit(envVar)}
                        className="btn btn-sm btn-ghost"
                        title="Edit variable"
                      >
                        Edit
                      </button>
                      
                      <button
                        onClick={() => handleDelete(envVar.key)}
                        className="btn btn-sm btn-ghost btn-danger-color"
                        title={isReferenced ? 'Cannot delete - referenced by registries' : 'Delete variable'}
                        disabled={isReferenced}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                  
                  <div className={styles.itemValue}>
                    <code className={`${styles.value} ${!shouldShow ? styles.masked : ''}`}>
                      {shouldShow ? envVar.value : '••••••••••••••••'}
                    </code>
                  </div>

                  {isReferenced && (
                    <div className={styles.referencedWarning}>
                      <ExclamationTriangleIcon />
                      <span>This variable is referenced by registry connections and cannot be deleted</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}