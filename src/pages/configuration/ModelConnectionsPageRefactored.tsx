import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAudio } from '@hooks/useAudio'
import { useToast } from '@hooks/useToast'
import { useModelConnectionForm } from '@hooks/useModelConnectionForm'
import Card from '@components/common/Card'
import Toast from '@components/Toast'
import ModelSelector from '@components/configuration/ModelSelector'
import HostingProviderSelector from '@components/configuration/HostingProviderSelector'
import AuthFieldsRenderer from '@components/configuration/AuthFieldsRenderer'
import ModelConnectionsList from '@components/configuration/ModelConnectionsList'
import {
  ChevronLeftIcon,
  PlusIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline'
import styles from './ModelConnectionsPage.module.css'

export default function ModelConnectionsPage() {
  const formRef = useRef<HTMLDivElement>(null)
  const { playClickSound } = useAudio()
  const { toasts, removeToast } = useToast()
  
  const {
    // Form state
    formData,
    editingId,
    errors,
    availableHostingProviders,
    isSaving,
    
    // Computed values
    authFields,
    currentHostingProvider,
    authConfig,
    
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
  } = useModelConnectionForm()

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const onEdit = (connection: any) => {
    handleEdit(connection, scrollToForm)
  }

  const onCancel = () => {
    playClickSound()
    handleCancel()
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
            <ModelSelector 
              value={formData.model_id}
              onChange={handleModelIdChange}
              error={errors.model_id}
              disabled={!!editingId}
            />

            <HostingProviderSelector 
              value={formData.hosting_provider}
              onChange={handleHostingProviderChange}
              availableProviders={availableHostingProviders}
              error={errors.hosting_provider}
              disabled={!formData.model_id}
            />
          </div>

          {/* Show endpoint field for hosting providers that require it */}
          {formData.hosting_provider && currentHostingProvider?.requiresEndpoint && (
            <div className={styles.formGroup}>
              <label htmlFor="endpoint">Endpoint URL</label>
              <input
                id="endpoint"
                type="url"
                value={formData.endpoint}
                onChange={(e) => handleFieldChange('endpoint', e.target.value)}
                placeholder={currentHostingProvider.endpointPlaceholder || 'https://your-api.com/v1'}
                className={`${styles.input} ${errors.endpoint ? styles.inputError : ''}`}
                required
              />
              {errors.endpoint && (
                <span className={styles.errorText}>{errors.endpoint}</span>
              )}
            </div>
          )}

          <AuthFieldsRenderer 
            authFields={authFields}
            authConfig={authConfig}
            formData={formData}
            errors={errors}
            onFieldChange={handleFieldChange}
          />

          <div className={styles.formActions}>
            <button type="submit" className="btn btn-lg btn-bright" disabled={isSaving}>
              <PlusIcon />
              {editingId ? 'Update' : 'Add'} Connection
            </button>
            
            {editingId && (
              <button 
                type="button" 
                onClick={onCancel}
                className="btn btn-lg btn-subtle"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </Card>

      {/* Model Connections List */}
      <ModelConnectionsList 
        connections={modelConnections}
        onEdit={onEdit}
        onDelete={handleDelete}
      />

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