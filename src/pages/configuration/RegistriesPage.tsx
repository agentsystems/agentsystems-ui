import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useConfigStore } from '../../stores/configStore'
import { useAudio } from '../../hooks/useAudio'
import { useToast } from '../../hooks/useToast'
import Card from '../../components/common/Card'
import Toast from '../../components/Toast'
import { RegistryConnectionForm, AuthMethod } from '../../types/config'
import {
  PlusIcon,
  ServerIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import styles from './RegistriesPage.module.css'

const initialFormData: Omit<RegistryConnectionForm, 'id'> = {
  name: '',
  url: '',
  enabled: true,
  authMethod: 'none'
}

export default function RegistriesPage() {
  const [formData, setFormData] = useState<Omit<RegistryConnectionForm, 'id'>>(initialFormData)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const { playClickSound } = useAudio()
  const { toasts, removeToast, showSuccess, showError } = useToast()
  
  const {
    getRegistryConnections,
    addRegistryConnection,
    updateRegistryConnection,
    deleteRegistryConnection,
    getEnvVars,
    getReferencedRegistries,
    saveConfig
  } = useConfigStore()

  const registries = getRegistryConnections()
  const envVars = getEnvVars()
  const availableEnvVars = envVars.map(env => env.key)
  const referencedRegistries = getReferencedRegistries()

  const validateForm = (data: Omit<RegistryConnectionForm, 'id'>): boolean => {
    const newErrors: Record<string, string> = {}

    if (!data.name) {
      newErrors.name = 'Registry name is required'
    } else if (!/^[a-z0-9_]+$/.test(data.name)) {
      newErrors.name = 'Name must be lowercase letters, numbers, and underscores only'
    }

    if (!data.url) {
      newErrors.url = 'Registry URL is required'
    } else if (!/^(https?:\/\/|[a-zA-Z0-9.-]+)$/.test(data.url)) {
      newErrors.url = 'Invalid URL format'
    }

    if (data.authMethod === 'basic') {
      if (!data.usernameEnv) {
        newErrors.usernameEnv = 'Username environment variable is required'
      }
      if (!data.passwordEnv) {
        newErrors.passwordEnv = 'Password environment variable is required'
      }
    } else if (data.authMethod === 'token') {
      if (!data.tokenEnv) {
        newErrors.tokenEnv = 'Token environment variable is required'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    playClickSound()

    if (!validateForm(formData)) {
      showError('Please fix the validation errors')
      return
    }

    try {
      if (editingId) {
        updateRegistryConnection(editingId, formData)
        showSuccess(`Updated registry ${formData.name}`)
        setEditingId(null)
      } else {
        addRegistryConnection(formData)
        showSuccess(`Added registry ${formData.name}`)
      }
      
      // Save changes to file
      await saveConfig()
      
      setFormData(initialFormData)
      setErrors({})
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to save registry')
    }
  }

  const handleEdit = (registry: RegistryConnectionForm) => {
    playClickSound()
    setFormData({
      name: registry.name,
      url: registry.url,
      enabled: registry.enabled,
      authMethod: registry.authMethod,
      usernameEnv: registry.usernameEnv,
      passwordEnv: registry.passwordEnv,
      tokenEnv: registry.tokenEnv
    })
    setEditingId(registry.id)
    setErrors({})
  }

  const handleDelete = async (id: string, name: string) => {
    playClickSound()
    
    if (referencedRegistries.has(id)) {
      showError(`Cannot delete ${name} - it is referenced by agents`)
      return
    }
    
    if (confirm(`Are you sure you want to delete registry "${name}"?`)) {
      try {
        deleteRegistryConnection(id)
        await saveConfig()
        showSuccess(`Deleted registry ${name}`)
      } catch (error) {
        showError(error instanceof Error ? error.message : 'Failed to delete registry')
      }
    }
  }

  const handleCancel = () => {
    playClickSound()
    setFormData(initialFormData)
    setEditingId(null)
    setErrors({})
  }

  return (
    <div className={styles.registriesPage}>
      {/* Breadcrumb Navigation */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link to="/configuration" className={styles.breadcrumbLink}>
          <ChevronLeftIcon className={styles.backIcon} />
          <span>Configuration</span>
        </Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>Registries</span>
      </nav>

      <div className={styles.header}>
        <div>
          <h1>Registry Connections</h1>
          <p>Configure connections to Docker registries for agent deployment</p>
        </div>
      </div>

      {/* Add/Edit Form */}
      <Card className={styles.formCard}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2>
            <ServerIcon />
            {editingId ? `Edit Registry` : 'Add New Registry'}
          </h2>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="registry-name">Name</label>
              <input
                id="registry-name"
                type="text"
                value={formData.name}
                onChange={(e) => {
                  const value = e.target.value.toLowerCase()
                  setFormData(prev => ({ ...prev, name: value }))
                  if (errors.name) setErrors(prev => ({ ...prev, name: '' }))
                }}
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                placeholder="dockerhub_production"
                disabled={!!editingId}
                required
              />
              {errors.name && (
                <span className={styles.errorText}>{errors.name}</span>
              )}
              <span className={styles.hint}>
                Lowercase letters, numbers, and underscores only
              </span>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="registry-url">Registry URL</label>
              <input
                id="registry-url"
                type="text"
                value={formData.url}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, url: e.target.value }))
                  if (errors.url) setErrors(prev => ({ ...prev, url: '' }))
                }}
                className={`${styles.input} ${errors.url ? styles.inputError : ''}`}
                placeholder="https://registry.docker.io"
                required
              />
              {errors.url && (
                <span className={styles.errorText}>{errors.url}</span>
              )}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="auth-method">Authentication Method</label>
              <select
                id="auth-method"
                value={formData.authMethod}
                onChange={(e) => {
                  const authMethod = e.target.value as AuthMethod
                  setFormData(prev => ({ 
                    ...prev, 
                    authMethod,
                    usernameEnv: authMethod === 'basic' ? prev.usernameEnv : undefined,
                    passwordEnv: authMethod === 'basic' ? prev.passwordEnv : undefined,
                    tokenEnv: authMethod === 'token' ? prev.tokenEnv : undefined
                  }))
                }}
                className={styles.select}
              >
                <option value="none">No Authentication</option>
                <option value="basic">Basic (Username/Password)</option>
                <option value="token">Token</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.enabled}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    enabled: e.target.checked 
                  }))}
                  className={styles.checkbox}
                />
                Enabled
              </label>
            </div>
          </div>

          {formData.authMethod === 'basic' && (
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="username-env">Username Environment Variable</label>
                <select
                  id="username-env"
                  value={formData.usernameEnv || ''}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, usernameEnv: e.target.value }))
                    if (errors.usernameEnv) setErrors(prev => ({ ...prev, usernameEnv: '' }))
                  }}
                  className={`${styles.select} ${errors.usernameEnv ? styles.inputError : ''}`}
                  required
                >
                  <option value="">Select username variable...</option>
                  {availableEnvVars.map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
                {errors.usernameEnv && (
                  <span className={styles.errorText}>{errors.usernameEnv}</span>
                )}
                {availableEnvVars.length === 0 && (
                  <span className={styles.hint}>
                    <Link to="/configuration/credentials" className={styles.linkHint}>
                      Add credentials first →
                    </Link>
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password-env">Password Environment Variable</label>
                <select
                  id="password-env"
                  value={formData.passwordEnv || ''}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, passwordEnv: e.target.value }))
                    if (errors.passwordEnv) setErrors(prev => ({ ...prev, passwordEnv: '' }))
                  }}
                  className={`${styles.select} ${errors.passwordEnv ? styles.inputError : ''}`}
                  required
                >
                  <option value="">Select password variable...</option>
                  {availableEnvVars.map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
                {errors.passwordEnv && (
                  <span className={styles.errorText}>{errors.passwordEnv}</span>
                )}
              </div>
            </div>
          )}

          {formData.authMethod === 'token' && (
            <div className={styles.formGroup}>
              <label htmlFor="token-env">Token Environment Variable</label>
              <select
                id="token-env"
                value={formData.tokenEnv || ''}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, tokenEnv: e.target.value }))
                  if (errors.tokenEnv) setErrors(prev => ({ ...prev, tokenEnv: '' }))
                }}
                className={`${styles.select} ${errors.tokenEnv ? styles.inputError : ''}`}
                required
              >
                <option value="">Select token variable...</option>
                {availableEnvVars.map(key => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
              {errors.tokenEnv && (
                <span className={styles.errorText}>{errors.tokenEnv}</span>
              )}
              {availableEnvVars.length === 0 && (
                <span className={styles.hint}>
                  <Link to="/configuration/credentials" className={styles.linkHint}>
                    Add credentials first →
                  </Link>
                </span>
              )}
            </div>
          )}

          <div className={styles.formActions}>
            <button type="submit" className="btn btn-lg btn-bright">
              <CheckIcon />
              {editingId ? 'Update' : 'Add'} Registry
            </button>
            
            {editingId && (
              <button 
                type="button" 
                onClick={handleCancel}
                className="btn btn-lg btn-subtle"
              >
                <XMarkIcon />
                Cancel
              </button>
            )}
          </div>
        </form>
      </Card>

      {/* Registries List */}
      <Card>
        <div className={styles.listHeader}>
          <h2>Configured Registries ({registries.length})</h2>
        </div>

        {registries.length === 0 ? (
          <div className={styles.emptyState}>
            <ServerIcon />
            <h3>No registries configured</h3>
            <p>Add your first registry connection using the form above</p>
          </div>
        ) : (
          <div className={styles.list}>
            {registries.map((registry) => {
              const isReferenced = referencedRegistries.has(registry.id)
              
              return (
                <div key={registry.id} className={styles.listItem}>
                  <div className={styles.itemHeader}>
                    <div className={styles.itemName}>
                      <ServerIcon />
                      <span className={styles.registryName}>{registry.name}</span>
                      <span className={`${styles.statusBadge} ${registry.enabled ? styles.enabled : styles.disabled}`}>
                        {registry.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                      {isReferenced && (
                        <span className={styles.referencedBadge}>
                          Referenced
                        </span>
                      )}
                    </div>
                  
                  <div className={styles.itemActions}>
                    <button
                      onClick={() => handleEdit(registry)}
                      className="btn btn-sm btn-ghost"
                      title="Edit registry"
                    >
                      Edit
                    </button>
                    
                    <button
                      onClick={() => handleDelete(registry.id, registry.name)}
                      className={`btn btn-sm btn-ghost ${styles.deleteBtn}`}
                      title={isReferenced ? 'Cannot delete - referenced by agents' : 'Delete registry'}
                      disabled={isReferenced}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
                
                <div className={styles.itemDetails}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>URL:</span>
                    <code className={styles.detailValue}>{registry.url}</code>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Auth:</span>
                    <span className={styles.detailValue}>
                      {registry.authMethod === 'none' && 'No Authentication'}
                      {registry.authMethod === 'basic' && `Basic (${registry.usernameEnv}/${registry.passwordEnv})`}
                      {registry.authMethod === 'token' && `Token (${registry.tokenEnv})`}
                    </span>
                  </div>
                </div>

                {isReferenced && (
                  <div className={styles.referencedWarning}>
                    <ExclamationTriangleIcon />
                    <span>This registry is referenced by agents and cannot be deleted</span>
                  </div>
                )}
              </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* Toast notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}