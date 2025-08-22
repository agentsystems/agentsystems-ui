import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useConfigStore } from '@stores/configStore'
import { useAudio } from '@hooks/useAudio'
import { useToast } from '@hooks/useToast'
import Card from '@components/common/Card'
import Toast from '@components/Toast'
import { ModelConnectionForm } from '../../types/config'
import { 
  getModelIds, 
  getModelEntry, 
  getProvidersForModel, 
  getProviderModelId 
} from '../../data/modelCatalog'
import {
  CpuChipIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ExclamationTriangleIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import styles from './ModelConnectionsPage.module.css'

const initialFormData: Omit<ModelConnectionForm, 'id'> = {
  model_id: '',
  provider: 'anthropic',
  enabled: true,
  provider_model_id: '',
  endpoint: '',
  authMethod: 'api_key',
  apiKeyEnv: '',
  awsAccessKeyEnv: '',
  awsSecretKeyEnv: '',
  awsRegion: 'us-east-1',
  azureEndpoint: '',
  azureDeployment: '',
  azureApiVersion: '2023-12-01-preview'
}

export default function ModelConnectionsPage() {
  const [formData, setFormData] = useState<Omit<ModelConnectionForm, 'id'>>(initialFormData)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [availableProviders, setAvailableProviders] = useState<any[]>([])
  const formRef = useRef<HTMLDivElement>(null)
  
  const { 
    getModelConnections, 
    addModelConnection, 
    updateModelConnection, 
    deleteModelConnection,
    saveConfig,
    isSaving,
    hasUnsavedChanges
  } = useConfigStore()
  
  const { playClickSound } = useAudio()
  const { toasts, removeToast, showSuccess, showError } = useToast()
  
  const modelConnections = getModelConnections()

  // Update available providers when model_id changes
  const handleModelIdChange = (modelId: string) => {
    const providers = getProvidersForModel(modelId)
    setAvailableProviders(providers)
    
    // Reset provider and provider_model_id when model changes
    const defaultProvider = providers.length > 0 ? providers[0].id : 'anthropic'
    const defaultProviderModelId = providers.length > 0 ? providers[0].provider_model_id : ''
    
    setFormData(prev => ({
      ...prev,
      model_id: modelId,
      provider: defaultProvider as any,
      provider_model_id: defaultProviderModelId,
      // Reset auth method based on first provider's supported methods
      authMethod: providers.length > 0 && providers[0].auth_methods.includes('api_key') ? 'api_key' : 'none' as any
    }))
    
    // Clear any existing errors
    setErrors(prev => ({ ...prev, model_id: '', provider: '' }))
  }

  // Update provider_model_id when provider changes
  const handleProviderChange = (providerId: string) => {
    const modelId = formData.model_id
    const providerModelId = getProviderModelId(modelId, providerId) || ''
    const provider = availableProviders.find(p => p.id === providerId)
    
    setFormData(prev => ({
      ...prev,
      provider: providerId as any,
      provider_model_id: providerModelId,
      // Update auth method to first supported method for this provider
      authMethod: provider && provider.auth_methods.includes('api_key') ? 'api_key' : 
                  provider && provider.auth_methods.includes('aws_credentials') ? 'aws_credentials' :
                  provider && provider.auth_methods.includes('azure_ad') ? 'azure_ad' : 'none' as any
    }))
  }

  const validateForm = (data: Omit<ModelConnectionForm, 'id'>): Record<string, string> => {
    const newErrors: Record<string, string> = {}
    
    if (!data.model_id.trim()) {
      newErrors.model_id = 'Model ID is required'
    } else if (!/^[a-zA-Z0-9._-]+$/.test(data.model_id)) {
      newErrors.model_id = 'Model ID can only contain letters, numbers, dots, hyphens, and underscores'
    }
    
    if (!data.provider) {
      newErrors.provider = 'Provider is required'
    }
    
    // Provider-specific validation
    if (data.provider === 'custom' || data.provider === 'ollama') {
      if (!data.endpoint.trim()) {
        newErrors.endpoint = 'Endpoint is required for custom/Ollama providers'
      } else if (!data.endpoint.match(/^https?:\/\//)) {
        newErrors.endpoint = 'Endpoint must be a valid HTTP/HTTPS URL'
      }
    }
    
    // Auth method specific validation
    if (data.authMethod === 'api_key' && !data.apiKeyEnv.trim()) {
      newErrors.apiKeyEnv = 'API Key environment variable is required'
    }
    
    if (data.authMethod === 'aws_credentials') {
      if (!data.awsAccessKeyEnv.trim()) {
        newErrors.awsAccessKeyEnv = 'AWS Access Key environment variable is required'
      }
      if (!data.awsSecretKeyEnv.trim()) {
        newErrors.awsSecretKeyEnv = 'AWS Secret Key environment variable is required'
      }
      if (!data.awsRegion.trim()) {
        newErrors.awsRegion = 'AWS Region is required'
      }
    }
    
    if (data.authMethod === 'azure_ad') {
      if (!data.azureEndpoint.trim()) {
        newErrors.azureEndpoint = 'Azure endpoint is required'
      }
      if (!data.azureDeployment.trim()) {
        newErrors.azureDeployment = 'Azure deployment name is required'
      }
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
        showSuccess('Model connection updated successfully')
      } else {
        // Check for duplicate model_id
        if (modelConnections.some(conn => conn.model_id === formData.model_id)) {
          setErrors({ model_id: 'A model connection with this ID already exists' })
          showError('Model ID already exists')
          return
        }
        
        addModelConnection(formData)
        showSuccess('Model connection added successfully')
      }
      
      // Reset form
      setFormData(initialFormData)
      setEditingId(null)
      setErrors({})
      
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
      azureApiVersion: connection.azureApiVersion
    })
    setEditingId(connection.id)
    setErrors({})
    
    // Scroll to form
    formRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    playClickSound()
    
    if (!confirm('Are you sure you want to delete this model connection? This action cannot be undone.')) {
      return
    }
    
    try {
      deleteModelConnection(id)
      showSuccess('Model connection deleted successfully')
      
      // Clear form if we were editing this connection
      if (editingId === id) {
        setFormData(initialFormData)
        setEditingId(null)
        setErrors({})
      }
      
      // Save to file
      await saveConfig()
      
    } catch (error) {
      showError('Failed to delete model connection')
      console.error('Error deleting model connection:', error)
    }
  }

  const handleCancel = () => {
    playClickSound()
    setFormData(initialFormData)
    setEditingId(null)
    setErrors({})
  }


  const renderAuthFields = () => {
    switch (formData.authMethod) {
      case 'api_key':
        return (
          <div className={styles.inputGroup}>
            <label htmlFor="apiKeyEnv" className={styles.required}>API Key Environment Variable</label>
            <input
              id="apiKeyEnv"
              type="text"
              value={formData.apiKeyEnv}
              onChange={(e) => setFormData(prev => ({ ...prev, apiKeyEnv: e.target.value }))}
              placeholder="ANTHROPIC_API_KEY"
              className={errors.apiKeyEnv ? styles.error : ''}
            />
            {errors.apiKeyEnv && <span className={styles.errorText}>{errors.apiKeyEnv}</span>}
            <small className={styles.help}>
              Name of the environment variable containing the API key
            </small>
          </div>
        )
        
      case 'aws_credentials':
        return (
          <>
            <div className={styles.inputGroup}>
              <label htmlFor="awsAccessKeyEnv" className={styles.required}>AWS Access Key Environment Variable</label>
              <input
                id="awsAccessKeyEnv"
                type="text"
                value={formData.awsAccessKeyEnv}
                onChange={(e) => setFormData(prev => ({ ...prev, awsAccessKeyEnv: e.target.value }))}
                placeholder="AWS_ACCESS_KEY_ID"
                className={errors.awsAccessKeyEnv ? styles.error : ''}
              />
              {errors.awsAccessKeyEnv && <span className={styles.errorText}>{errors.awsAccessKeyEnv}</span>}
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="awsSecretKeyEnv" className={styles.required}>AWS Secret Key Environment Variable</label>
              <input
                id="awsSecretKeyEnv"
                type="text"
                value={formData.awsSecretKeyEnv}
                onChange={(e) => setFormData(prev => ({ ...prev, awsSecretKeyEnv: e.target.value }))}
                placeholder="AWS_SECRET_ACCESS_KEY"
                className={errors.awsSecretKeyEnv ? styles.error : ''}
              />
              {errors.awsSecretKeyEnv && <span className={styles.errorText}>{errors.awsSecretKeyEnv}</span>}
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="awsRegion" className={styles.required}>AWS Region</label>
              <select
                id="awsRegion"
                value={formData.awsRegion}
                onChange={(e) => setFormData(prev => ({ ...prev, awsRegion: e.target.value }))}
                className={errors.awsRegion ? styles.error : ''}
              >
                <option value="us-east-1">US East (N. Virginia)</option>
                <option value="us-west-2">US West (Oregon)</option>
                <option value="eu-west-1">Europe (Ireland)</option>
                <option value="ap-southeast-2">Asia Pacific (Sydney)</option>
              </select>
              {errors.awsRegion && <span className={styles.errorText}>{errors.awsRegion}</span>}
            </div>
          </>
        )
        
      case 'azure_ad':
        return (
          <>
            <div className={styles.inputGroup}>
              <label htmlFor="azureEndpoint" className={styles.required}>Azure OpenAI Endpoint</label>
              <input
                id="azureEndpoint"
                type="url"
                value={formData.azureEndpoint}
                onChange={(e) => setFormData(prev => ({ ...prev, azureEndpoint: e.target.value }))}
                placeholder="https://your-resource.openai.azure.com"
                className={errors.azureEndpoint ? styles.error : ''}
              />
              {errors.azureEndpoint && <span className={styles.errorText}>{errors.azureEndpoint}</span>}
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="azureDeployment" className={styles.required}>Azure Deployment Name</label>
              <input
                id="azureDeployment"
                type="text"
                value={formData.azureDeployment}
                onChange={(e) => setFormData(prev => ({ ...prev, azureDeployment: e.target.value }))}
                placeholder="gpt-4o-deployment"
                className={errors.azureDeployment ? styles.error : ''}
              />
              {errors.azureDeployment && <span className={styles.errorText}>{errors.azureDeployment}</span>}
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="azureApiVersion">API Version</label>
              <input
                id="azureApiVersion"
                type="text"
                value={formData.azureApiVersion}
                onChange={(e) => setFormData(prev => ({ ...prev, azureApiVersion: e.target.value }))}
                placeholder="2023-12-01-preview"
              />
            </div>
          </>
        )
        
      case 'none':
        return (
          <div className={styles.infoBox}>
            <ExclamationTriangleIcon className={styles.infoIcon} />
            <p>No authentication will be used for this model connection.</p>
          </div>
        )
        
      default:
        return null
    }
  }

  return (
    <div className={styles.modelConnectionsPage}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb}>
        <Link to="/configuration" className={styles.breadcrumbLink}>
          <ChevronLeftIcon className={styles.breadcrumbIcon} />
          Configuration
        </Link>
      </nav>

      <div className={styles.header}>
        <div>
          <h1>Model Connections</h1>
          <p>Configure connections to LLM providers for agent routing</p>
        </div>
      </div>

      {/* Existing Model Connections */}
      {modelConnections.length > 0 && (
        <Card>
          <h2>Model Connections</h2>
          <div className={styles.connectionsList}>
            {modelConnections.map((connection) => (
              <div key={connection.id} className={styles.connectionItem}>
                <div className={styles.connectionInfo}>
                  <div className={styles.connectionHeader}>
                    <CpuChipIcon className={styles.connectionIcon} />
                    <div>
                      <h3>{connection.model_id}</h3>
                      <div className={styles.connectionMeta}>
                        <span className={styles.provider}>{connection.provider}</span>
                        {connection.provider_model_id && (
                          <span className={styles.providerModel}>→ {connection.provider_model_id}</span>
                        )}
                        {connection.endpoint && (
                          <span className={styles.endpoint}>{connection.endpoint}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={styles.connectionAuth}>
                    <span className={styles.authMethod}>{connection.authMethod}</span>
                    {connection.authMethod === 'api_key' && connection.apiKeyEnv && (
                      <span className={styles.envVar}>{connection.apiKeyEnv}</span>
                    )}
                    {connection.authMethod === 'aws_credentials' && (
                      <span className={styles.envVar}>
                        {connection.awsAccessKeyEnv} / {connection.awsRegion}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className={styles.connectionActions}>
                  <div className={styles.connectionStatus}>
                    {connection.enabled ? (
                      <CheckIcon className={styles.statusEnabled} title="Enabled" />
                    ) : (
                      <XMarkIcon className={styles.statusDisabled} title="Disabled" />
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleEdit(connection)}
                    className={styles.editButton}
                    aria-label={`Edit ${connection.model_id}`}
                  >
                    Edit
                  </button>
                  
                  <button
                    onClick={() => handleDelete(connection.id)}
                    className={styles.deleteButton}
                    aria-label={`Delete ${connection.model_id}`}
                  >
                    <TrashIcon className={styles.deleteIcon} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Add/Edit Form */}
      <Card ref={formRef}>
        <h2>
          <PlusIcon className={styles.formIcon} />
          {editingId ? 'Edit Model Connection' : 'Add Model Connection'}
        </h2>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="model_id" className={styles.required}>Model</label>
            <select
              id="model_id"
              value={formData.model_id}
              onChange={(e) => handleModelIdChange(e.target.value)}
              className={errors.model_id ? styles.error : ''}
            >
              <option value="">Select a model...</option>
              {getModelIds().map(modelId => {
                const entry = getModelEntry(modelId)
                return (
                  <option key={modelId} value={modelId}>
                    {entry?.display_name} ({modelId})
                  </option>
                )
              })}
            </select>
            {errors.model_id && <span className={styles.errorText}>{errors.model_id}</span>}
            <small className={styles.help}>
              Standardized model identifier used by agents
            </small>
          </div>

          {formData.model_id && (
            <>
              {/* Show model description */}
              {getModelEntry(formData.model_id) && (
                <div className={styles.modelInfo}>
                  <p className={styles.modelDescription}>
                    {getModelEntry(formData.model_id)?.description}
                  </p>
                  <span className={styles.modelCategory}>
                    Category: {getModelEntry(formData.model_id)?.category}
                  </span>
                </div>
              )}

              <div className={styles.inputGroup}>
                <label htmlFor="provider" className={styles.required}>Provider</label>
                <select
                  id="provider"
                  value={formData.provider}
                  onChange={(e) => handleProviderChange(e.target.value)}
                  className={errors.provider ? styles.error : ''}
                >
                  <option value="">Select a provider...</option>
                  {availableProviders.map(provider => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name} {provider.type ? `(${provider.type})` : ''}
                    </option>
                  ))}
                </select>
                {errors.provider && <span className={styles.errorText}>{errors.provider}</span>}
                <small className={styles.help}>
                  Choose which provider to use for this model
                </small>
              </div>

              {formData.provider && formData.provider_model_id && (
                <div className={styles.inputGroup}>
                  <label htmlFor="provider_model_id">Provider Model ID</label>
                  <input
                    id="provider_model_id"
                    type="text"
                    value={formData.provider_model_id}
                    readOnly
                    className={styles.readonly}
                  />
                  <small className={styles.help}>
                    Provider-specific model identifier (auto-populated from catalog)
                  </small>
                </div>
              )}
            </>
          )}

          {formData.provider && (
            <>
              {/* Show endpoint field for custom/ollama providers */}
              {(formData.provider === 'custom' || formData.provider === 'ollama') && (
                <div className={styles.inputGroup}>
                  <label htmlFor="endpoint" className={styles.required}>Endpoint URL</label>
                  <input
                    id="endpoint"
                    type="url"
                    value={formData.endpoint}
                    onChange={(e) => setFormData(prev => ({ ...prev, endpoint: e.target.value }))}
                    placeholder={formData.provider === 'ollama' ? 'http://localhost:11434' : 'https://your-api.com/v1'}
                    className={errors.endpoint ? styles.error : ''}
                  />
                  {errors.endpoint && <span className={styles.errorText}>{errors.endpoint}</span>}
                </div>
              )}

              <div className={styles.inputGroup}>
                <label htmlFor="authMethod" className={styles.required}>Authentication Method</label>
                <select
                  id="authMethod"
                  value={formData.authMethod}
                  onChange={(e) => setFormData(prev => ({ ...prev, authMethod: e.target.value as any }))}
                >
                  {availableProviders.find(p => p.id === formData.provider)?.auth_methods.map(method => {
                    const label = method === 'api_key' ? 'API Key' :
                                  method === 'aws_credentials' ? 'AWS Credentials' :
                                  method === 'azure_ad' ? 'Azure AD' :
                                  method === 'none' ? 'None' : method
                    return <option key={method} value={method}>{label}</option>
                  })}
                </select>
                <small className={styles.help}>
                  Available authentication methods for selected provider
                </small>
              </div>
            </>
          )}

          {renderAuthFields()}

          <div className={styles.checkboxGroup}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => setFormData(prev => ({ ...prev, enabled: e.target.checked }))}
              />
              <span className={styles.checkboxLabel}>Enable this model connection</span>
            </label>
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={isSaving}
            >
              {editingId ? 'Update Connection' : 'Add Connection'}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </Card>

      {hasUnsavedChanges && (
        <div className={styles.unsavedWarning}>
          <ExclamationTriangleIcon className={styles.warningIcon} />
          You have unsaved changes. They will be saved automatically when you add/update connections.
        </div>
      )}

      {/* Toast messages */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}