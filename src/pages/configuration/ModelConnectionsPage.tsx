import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useConfigStore } from '@stores/configStore'
import { useAudio } from '@hooks/useAudio'
import { useToast } from '@hooks/useToast'
import Card from '@components/common/Card'
import Toast from '@components/Toast'
import { ModelConnectionForm } from '../../types/config'
import { 
  getAllModelIds,
  getModel,
  getProvidersForModel,
  getProviderModelId,
  getProvider,
  AUTH_METHODS,
  type AuthFieldConfig,
  type ProviderConfig
} from '../../data/catalog'
import {
  CpuChipIcon,
  TrashIcon,
  ChevronLeftIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import styles from './ModelConnectionsPage.module.css'

const initialFormData: Omit<ModelConnectionForm, 'id'> = {
  model_id: '',
  provider: '',
  enabled: true,
  provider_model_id: '',
  endpoint: '',
  authMethod: 'none',
  apiKeyEnv: '',
  awsAccessKeyEnv: '',
  awsSecretKeyEnv: '',
  awsRegion: 'us-east-1',
  azureEndpoint: '',
  azureDeployment: '',
  azureApiVersion: '2024-02-01'
}

export default function ModelConnectionsPage() {
  const [formData, setFormData] = useState<Omit<ModelConnectionForm, 'id'>>(initialFormData)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [availableProviders, setAvailableProviders] = useState<ProviderConfig[]>([])
  const formRef = useRef<HTMLDivElement>(null)
  
  const { 
    getModelConnections, 
    addModelConnection, 
    updateModelConnection, 
    deleteModelConnection,
    getEnvVars,
    saveConfig,
    isSaving
  } = useConfigStore()
  
  const { playClickSound } = useAudio()
  const { toasts, removeToast, showSuccess, showError } = useToast()
  
  const modelConnections = getModelConnections()
  const envVars = getEnvVars()
  const availableEnvVars = envVars.map(env => env.key)

  // Update available providers when model_id changes
  const handleModelIdChange = (modelId: string) => {
    const providers = getProvidersForModel(modelId)
    setAvailableProviders(providers)
    
    // Always reset provider to empty when model changes
    setFormData(prev => ({
      ...prev,
      model_id: modelId,
      provider: '', // Always reset to "Select a provider..."
      provider_model_id: '',
      authMethod: 'none',
      apiKeyEnv: '',
      awsAccessKeyEnv: '',
      awsSecretKeyEnv: '',
      azureEndpoint: '',
      azureDeployment: '',
      azureApiKeyEnv: ''
    }))
    
    // Clear any existing errors
    setErrors(prev => ({ ...prev, model_id: '', provider: '' }))
  }

  // Update provider_model_id and auth method when provider changes
  const handleProviderChange = (providerId: string) => {
    const modelId = formData.model_id
    const providerModelId = getProviderModelId(modelId, providerId) || ''
    const provider = getProvider(providerId)
    
    if (provider) {
      setFormData(prev => ({
        ...prev,
        provider: providerId,
        provider_model_id: providerModelId,
        authMethod: provider.defaultAuthMethod,
        // Clear auth fields when switching providers
        apiKeyEnv: '',
        awsAccessKeyEnv: '',
        awsSecretKeyEnv: '',
        azureEndpoint: '',
        azureDeployment: '',
        azureApiKeyEnv: ''
      }))
    }
  }

  const validateForm = (data: Omit<ModelConnectionForm, 'id'>): Record<string, string> => {
    const newErrors: Record<string, string> = {}
    
    if (!data.model_id.trim()) {
      newErrors.model_id = 'Model is required'
    }
    
    if (!data.provider) {
      newErrors.provider = 'Provider is required'
    }
    
    // Get provider config for validation
    const provider = getProvider(data.provider)
    
    // Provider-specific validation
    if (provider?.requiresEndpoint) {
      if (!data.endpoint?.trim()) {
        newErrors.endpoint = `Endpoint is required for ${provider.displayName}`
      } else if (!data.endpoint.match(/^https?:\/\//)) {
        newErrors.endpoint = 'Endpoint must be a valid HTTP/HTTPS URL'
      }
    }
    
    // Auth method specific validation using catalog
    const authConfig = AUTH_METHODS[data.authMethod]
    if (authConfig) {
      authConfig.fields.forEach(field => {
        if (field.required) {
          const value = (data as any)[field.name]
          if (!value || (typeof value === 'string' && !value.trim())) {
            newErrors[field.name] = `${field.label} is required`
          }
        }
      })
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    playClickSound()
    
    const validationErrors = validateForm(formData)
    setErrors(validationErrors)
    
    if (Object.keys(validationErrors).length > 0) {
      showError('Please fix the validation errors')
      return
    }
    
    try {
      if (editingId) {
        updateModelConnection(editingId, formData)
        showSuccess(`Updated ${formData.model_id}`)
      } else {
        // Check for duplicate model_id
        if (modelConnections.some(conn => conn.model_id === formData.model_id)) {
          setErrors({ model_id: 'A model connection with this ID already exists' })
          showError('Model ID already exists')
          return
        }
        
        addModelConnection(formData)
        showSuccess(`Added ${formData.model_id}`)
      }
      
      // Reset form
      setFormData(initialFormData)
      setEditingId(null)
      setErrors({})
      setAvailableProviders([])
      
      // Save to file
      await saveConfig()
      
    } catch (error) {
      showError('Failed to save model connection')
      console.error('Error saving model connection:', error)
    }
  }

  const handleEdit = (connection: ModelConnectionForm) => {
    playClickSound()
    
    // Set available providers for the model
    const providers = getProvidersForModel(connection.model_id)
    setAvailableProviders(providers)
    
    setFormData({
      model_id: connection.model_id,
      provider: connection.provider,
      enabled: connection.enabled,
      provider_model_id: connection.provider_model_id,
      endpoint: connection.endpoint,
      authMethod: connection.authMethod,
      apiKeyEnv: connection.apiKeyEnv,
      awsAccessKeyEnv: connection.awsAccessKeyEnv,
      awsSecretKeyEnv: connection.awsSecretKeyEnv,
      awsRegion: connection.awsRegion,
      azureEndpoint: connection.azureEndpoint,
      azureDeployment: connection.azureDeployment,
      azureApiVersion: connection.azureApiVersion,
      azureApiKeyEnv: connection.azureApiKeyEnv
    })
    setEditingId(connection.id)
    setErrors({})
    
    // Scroll to form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const handleDelete = async (id: string) => {
    playClickSound()
    
    const connection = modelConnections.find(c => c.id === id)
    if (!connection) return
    
    if (confirm(`Are you sure you want to delete ${connection.model_id}?`)) {
      try {
        deleteModelConnection(id)
        showSuccess(`Deleted ${connection.model_id}`)
        
        // Clear form if we were editing this connection
        if (editingId === id) {
          setFormData(initialFormData)
          setEditingId(null)
          setErrors({})
          setAvailableProviders([])
        }
        
        // Save to file
        await saveConfig()
        
      } catch (error) {
        showError('Failed to delete model connection')
        console.error('Error deleting model connection:', error)
      }
    }
  }

  const handleCancel = () => {
    playClickSound()
    setFormData(initialFormData)
    setEditingId(null)
    setErrors({})
    setAvailableProviders([])
  }

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }))
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }))
    }
  }

  const renderAuthField = (field: AuthFieldConfig) => {
    const value = (formData as any)[field.name] || ''
    const error = errors[field.name]
    
    switch (field.type) {
      case 'env_select':
        return (
          <div key={field.name} className={styles.formGroup}>
            <label htmlFor={field.name}>{field.label}</label>
            <select
              id={field.name}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
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
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
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
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
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

  const renderAuthFields = () => {
    if (!formData.provider || formData.authMethod === 'none') {
      if (formData.authMethod === 'none') {
        return (
          <div className={styles.hint}>
            No authentication required for this connection.
          </div>
        )
      }
      return null
    }
    
    const authConfig = AUTH_METHODS[formData.authMethod]
    if (!authConfig) return null
    
    // Group fields into rows for better layout
    const fields = authConfig.fields
    const rows: AuthFieldConfig[][] = []
    
    // Special handling for AWS credentials - put access and secret key side by side
    if (formData.authMethod === 'aws_credentials') {
      rows.push(fields.slice(0, 2)) // Access key and secret key
      fields.slice(2).forEach(field => rows.push([field])) // Region on its own
    } 
    // Special handling for Azure - endpoint and deployment side by side
    else if (formData.authMethod === 'azure_ad') {
      const apiKeyField = fields.find(f => f.name === 'azureApiKeyEnv')
      const endpointField = fields.find(f => f.name === 'azureEndpoint')
      const deploymentField = fields.find(f => f.name === 'azureDeployment')
      const versionField = fields.find(f => f.name === 'azureApiVersion')
      
      if (apiKeyField) rows.push([apiKeyField])
      if (endpointField && deploymentField) rows.push([endpointField, deploymentField])
      if (versionField) rows.push([versionField])
    }
    // Default: each field on its own row
    else {
      fields.forEach(field => rows.push([field]))
    }
    
    return (
      <>
        {authConfig.helpText && (
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
      </>
    )
  }

  return (
    <div className={styles.credentialsPage}>
      {/* Breadcrumb Navigation */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link to="/configuration" className={styles.breadcrumbLink}>
          <ChevronLeftIcon className={styles.backIcon} />
          <span>Configuration</span>
        </Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>Model Connections</span>
      </nav>

      <div className={styles.header}>
        <div>
          <h1>Model Connections</h1>
          <p>Configure connections to LLM providers for agent routing</p>
        </div>
      </div>

      {/* Add/Edit Form */}
      <Card className={styles.formCard} ref={formRef}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2>
            <CpuChipIcon />
            {editingId ? `Edit ${formData.model_id || 'Connection'}` : 'Add New Model Connection'}
          </h2>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="model">Model</label>
              <select
                id="model"
                value={formData.model_id}
                onChange={(e) => handleModelIdChange(e.target.value)}
                className={`${styles.input} ${errors.model_id ? styles.inputError : ''}`}
                disabled={!!editingId}
                required
              >
                <option value="">Select a model...</option>
                {getAllModelIds().map(modelId => {
                  const model = getModel(modelId)
                  return (
                    <option key={modelId} value={modelId}>
                      {model?.displayName || modelId}
                    </option>
                  )
                })}
              </select>
              {errors.model_id && (
                <span className={styles.errorText}>{errors.model_id}</span>
              )}
              <span className={styles.hint}>
                Choose the model to configure
              </span>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="provider">Provider</label>
              <select
                id="provider"
                value={formData.provider}
                onChange={(e) => handleProviderChange(e.target.value)}
                className={`${styles.input} ${errors.provider ? styles.inputError : ''}`}
                disabled={!formData.model_id}
                required
              >
                <option value="">Select a provider...</option>
                {availableProviders.map(provider => (
                  <option key={provider.id} value={provider.id}>
                    {provider.displayName}
                  </option>
                ))}
              </select>
              {errors.provider && (
                <span className={styles.errorText}>{errors.provider}</span>
              )}
              <span className={styles.hint}>
                {availableProviders.length === 0 && formData.model_id ? 
                  'Select a model first' : 
                  'Provider to use for this model'}
              </span>
            </div>
          </div>

          {/* Show endpoint field for providers that require it */}
          {formData.provider && getProvider(formData.provider)?.requiresEndpoint && (
            <div className={styles.formGroup}>
              <label htmlFor="endpoint">Endpoint URL</label>
              <input
                id="endpoint"
                type="url"
                value={formData.endpoint}
                onChange={(e) => handleFieldChange('endpoint', e.target.value)}
                placeholder={getProvider(formData.provider)?.endpointPlaceholder || 'https://your-api.com/v1'}
                className={`${styles.input} ${errors.endpoint ? styles.inputError : ''}`}
                required
              />
              {errors.endpoint && (
                <span className={styles.errorText}>{errors.endpoint}</span>
              )}
            </div>
          )}

          {renderAuthFields()}

          <div className={styles.formActions}>
            <button type="submit" className="btn btn-lg btn-bright" disabled={isSaving}>
              <PlusIcon />
              {editingId ? 'Update' : 'Add'} Connection
            </button>
            
            {editingId && (
              <button 
                type="button" 
                onClick={handleCancel}
                className="btn btn-lg btn-subtle"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </Card>

      {/* Model Connections List */}
      <Card>
        <div className={styles.listHeader}>
          <h2>Current Model Connections ({modelConnections.length})</h2>
        </div>

        {modelConnections.length === 0 ? (
          <div className={styles.emptyState}>
            <CpuChipIcon />
            <h3>No model connections</h3>
            <p>Add your first model connection using the form above</p>
          </div>
        ) : (
          <div className={styles.list}>
            {modelConnections.map((connection) => {
              const model = getModel(connection.model_id)
              const provider = getProvider(connection.provider)
              const authMethod = AUTH_METHODS[connection.authMethod]
              
              return (
                <div key={connection.id} className={styles.listItem}>
                  <div className={styles.itemHeader}>
                    <div className={styles.itemName}>
                      <CpuChipIcon />
                      <span className={styles.keyName}>
                        {model?.displayName || connection.model_id}
                      </span>
                      <span className={styles.referencedBadge}>
                        {provider?.displayName || connection.provider}
                      </span>
                    </div>
                    
                    <div className={styles.itemActions}>
                      <button
                        onClick={() => handleEdit(connection)}
                        className="btn btn-sm btn-ghost"
                        title="Edit connection"
                      >
                        Edit
                      </button>
                      
                      <button
                        onClick={() => handleDelete(connection.id)}
                        className={`btn btn-sm btn-ghost`}
                        title="Delete connection"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                  
                  <div className={styles.itemValue}>
                    <code className={styles.value}>
                      {authMethod?.displayName || 'Unknown'}: 
                      {connection.authMethod === 'api_key' && connection.apiKeyEnv ? 
                        ` ${connection.apiKeyEnv}` :
                       connection.authMethod === 'aws_credentials' ? 
                        ` ${connection.awsAccessKeyEnv} (${connection.awsRegion})` :
                       connection.authMethod === 'azure_ad' ? 
                        ` ${connection.azureDeployment}` :
                       connection.authMethod === 'none' ? 
                        ' No authentication' : 
                        ' Configuration required'}
                      {connection.endpoint && ` → ${connection.endpoint}`}
                    </code>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* Toast notifications */}
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          index={index}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}