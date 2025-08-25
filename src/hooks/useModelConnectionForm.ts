import { useState, useCallback } from 'react'
import { useConfigStore } from '@stores/configStore'
import { useToast } from '@hooks/useToast'
import { 
  getHostingProvidersForModel,
  getHostingProviderModelId,
  AUTH_METHODS,
  type HostingProviderSupport,
  type AuthFieldConfig
} from '../data/modelCatalogUnified'
import { ModelConnectionForm, type ModelProvider } from '../types/config'

const initialFormData: Omit<ModelConnectionForm, 'id'> = {
  model_id: '',
  hosting_provider: '' as ModelProvider,
  enabled: true,
  hosting_provider_model_id: '',
  endpoint: '',
  authMethod: 'none',
  apiKeyEnv: '',
  awsAccessKeyEnv: '',
  awsSecretKeyEnv: '',
  awsRegion: 'us-east-1',
  regionPrefix: '',
  gcpServiceAccountKeyEnv: '',
  gcpProjectId: '',
  gcpRegion: 'us-central1'
}

export function useModelConnectionForm() {
  const [formData, setFormData] = useState<Omit<ModelConnectionForm, 'id'>>(initialFormData)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [availableHostingProviders, setAvailableHostingProviders] = useState<HostingProviderSupport[]>([])
  
  const { 
    getModelConnections, 
    addModelConnection, 
    updateModelConnection, 
    deleteModelConnection,
    saveConfig,
    isSaving
  } = useConfigStore()
  
  const { showSuccess, showError } = useToast()
  
  const modelConnections = getModelConnections()

  const validateForm = useCallback((data: Omit<ModelConnectionForm, 'id'>): Record<string, string> => {
    const newErrors: Record<string, string> = {}
    
    if (!data.model_id.trim()) {
      newErrors.model_id = 'Model is required'
    }
    
    if (!data.hosting_provider) {
      newErrors.hosting_provider = 'Hosting provider is required'
    }
    
    // Find hosting provider config for validation
    const hostingProviders = getHostingProvidersForModel(data.model_id)
    const hostingProvider = hostingProviders.find(p => p.id === data.hosting_provider)
    
    // Hosting provider-specific validation
    if (hostingProvider?.requiresEndpoint) {
      if (!data.endpoint?.trim()) {
        newErrors.endpoint = `Endpoint is required for ${hostingProvider.displayName}`
      } else if (!data.endpoint.match(/^https?:\/\//)) {
        newErrors.endpoint = 'Endpoint must be a valid HTTP/HTTPS URL'
      }
    }
    
    // Auth method specific validation
    const authConfig = AUTH_METHODS[data.authMethod]
    if (authConfig) {
      authConfig.fields.forEach(field => {
        if (field.required) {
          const value = (data as Record<string, string | boolean>)[field.name]
          if (!value || (typeof value === 'string' && !value.trim())) {
            newErrors[field.name] = `${field.label} is required`
          }
        }
      })
    }

    return newErrors
  }, [])

  const handleModelIdChange = useCallback((modelId: string) => {
    const hostingProviders = getHostingProvidersForModel(modelId)
    setAvailableHostingProviders(hostingProviders)
    
    // Always reset provider and auth fields when model changes
    setFormData(prev => ({
      ...prev,
      model_id: modelId,
      hosting_provider: '' as ModelProvider,
      hosting_provider_model_id: '',
      authMethod: 'none',
      apiKeyEnv: '',
      awsAccessKeyEnv: '',
      awsSecretKeyEnv: '',
      regionPrefix: '',
      gcpServiceAccountKeyEnv: '',
      gcpProjectId: '',
      gcpRegion: 'us-central1',
      endpoint: ''
    }))
    
    // Clear related errors
    setErrors(prev => ({ ...prev, model_id: '', hosting_provider: '' }))
  }, [])

  const handleHostingProviderChange = useCallback((hostingProviderId: string) => {
    const modelId = formData.model_id
    const hostingProviderModelId = getHostingProviderModelId(modelId, hostingProviderId as ModelProvider) || ''
    const hostingProviders = getHostingProvidersForModel(modelId)
    const hostingProvider = hostingProviders.find(p => p.id === hostingProviderId)
    
    if (hostingProvider) {
      setFormData(prev => ({
        ...prev,
        hosting_provider: hostingProviderId as ModelProvider,
        hosting_provider_model_id: hostingProviderModelId,
        authMethod: hostingProvider.authMethod,
        endpoint: hostingProvider.requiresEndpoint ? hostingProvider.endpointPlaceholder || '' : '',
        // Clear auth fields when switching providers
        apiKeyEnv: '',
        awsAccessKeyEnv: '',
        awsSecretKeyEnv: '',
        regionPrefix: '',
        gcpServiceAccountKeyEnv: '',
        gcpProjectId: '',
        gcpRegion: 'us-central1'
      }))
    }
  }, [formData.model_id])

  const handleFieldChange = useCallback((fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }))
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }))
    }
  }, [errors])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
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
      setAvailableHostingProviders([])
      
      // Save to file
      await saveConfig()
      
    } catch (error) {
      showError('Failed to save model connection')
      console.error('Error saving model connection:', error)
    }
  }, [formData, editingId, validateForm, modelConnections, updateModelConnection, showSuccess, addModelConnection, showError, saveConfig])

  const handleEdit = useCallback((connection: ModelConnectionForm, scrollToForm: () => void) => {
    // Set available hosting providers for the model
    const hostingProviders = getHostingProvidersForModel(connection.model_id)
    setAvailableHostingProviders(hostingProviders)
    
    setFormData({
      model_id: connection.model_id,
      hosting_provider: connection.hosting_provider,
      enabled: connection.enabled,
      hosting_provider_model_id: connection.hosting_provider_model_id,
      endpoint: connection.endpoint,
      authMethod: connection.authMethod,
      apiKeyEnv: connection.apiKeyEnv,
      awsAccessKeyEnv: connection.awsAccessKeyEnv,
      awsSecretKeyEnv: connection.awsSecretKeyEnv,
      awsRegion: connection.awsRegion,
      regionPrefix: connection.regionPrefix || '',
      gcpServiceAccountKeyEnv: connection.gcpServiceAccountKeyEnv,
      gcpProjectId: connection.gcpProjectId,
      gcpRegion: connection.gcpRegion
    })
    setEditingId(connection.id)
    setErrors({})
    
    // Scroll to form after a brief delay
    setTimeout(scrollToForm, 100)
  }, [])

  const handleDelete = useCallback(async (id: string) => {
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
          setAvailableHostingProviders([])
        }
        
        // Save to file
        await saveConfig()
        
      } catch (error) {
        showError('Failed to delete model connection')
        console.error('Error deleting model connection:', error)
      }
    }
  }, [modelConnections, deleteModelConnection, showSuccess, editingId, showError, saveConfig])

  const handleCancel = useCallback(() => {
    setFormData(initialFormData)
    setEditingId(null)
    setErrors({})
    setAvailableHostingProviders([])
  }, [])

  // Get auth fields for current form state
  const getAuthFields = useCallback((): AuthFieldConfig[] => {
    if (!formData.hosting_provider || formData.authMethod === 'none') {
      return []
    }
    
    const authConfig = AUTH_METHODS[formData.authMethod]
    return authConfig ? authConfig.fields : []
  }, [formData.hosting_provider, formData.authMethod])

  // Get current hosting provider config
  const getCurrentHostingProvider = useCallback(() => {
    if (!formData.hosting_provider) return undefined
    const hostingProviders = getHostingProvidersForModel(formData.model_id)
    return hostingProviders.find(p => p.id === formData.hosting_provider)
  }, [formData.model_id, formData.hosting_provider])

  return {
    // Form state
    formData,
    editingId,
    errors,
    availableHostingProviders,
    isSaving,
    
    // Computed values
    authFields: getAuthFields(),
    currentHostingProvider: getCurrentHostingProvider(),
    authConfig: formData.authMethod !== 'none' ? AUTH_METHODS[formData.authMethod] : null,
    
    // Event handlers
    handleModelIdChange,
    handleHostingProviderChange,
    handleFieldChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleCancel,
    
    // Data
    modelConnections
  }
}