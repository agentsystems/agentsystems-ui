import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useConfigStore } from '@stores/configStore'
import { useAudio } from '@hooks/useAudio'
import { useToast } from '@hooks/useToast'
import Card from '@components/common/Card'
import Toast from '@components/Toast'
import { IndexConnectionForm } from '../../types/config'
import {
  GlobeAltIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'
import styles from './IndexConnectionsPage.module.css'

const initialFormData: Omit<IndexConnectionForm, 'id'> = {
  name: '',
  url: '',
  enabled: false,
  description: ''
}

export default function IndexConnectionsPage() {
  const [formData, setFormData] = useState<Omit<IndexConnectionForm, 'id'>>(initialFormData)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showEnableModal, setShowEnableModal] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)

  const { playClickSound } = useAudio()
  const { toasts, removeToast, showSuccess, showError } = useToast()

  const {
    getIndexConnections,
    addIndexConnection,
    updateIndexConnection,
    deleteIndexConnection,
    saveConfig
  } = useConfigStore()

  const indexes = getIndexConnections()

  const validateForm = (data: Omit<IndexConnectionForm, 'id'>): boolean => {
    const newErrors: Record<string, string> = {}

    if (!data.name) {
      newErrors.name = 'Index name is required'
    } else if (!/^[a-z0-9_]+$/.test(data.name)) {
      newErrors.name = 'Name must be lowercase letters, numbers, and underscores only'
    }

    if (!data.url) {
      newErrors.url = 'Index URL is required'
    } else if (!/^https?:\/\/.+/.test(data.url)) {
      newErrors.url = 'URL must start with http:// or https://'
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
        updateIndexConnection(editingId, formData)
        showSuccess(`Updated index ${formData.name}`)
        setEditingId(null)
      } else {
        addIndexConnection(formData)
        showSuccess(`Added index ${formData.name}`)
      }

      // Save changes to file
      await saveConfig()

      setFormData(initialFormData)
      setErrors({})
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to save index connection')
    }
  }

  const handleEdit = (index: IndexConnectionForm) => {
    playClickSound()
    setFormData({
      name: index.name,
      url: index.url,
      enabled: index.enabled,
      description: index.description || ''
    })
    setEditingId(index.id)
    setErrors({})

    // Auto-scroll to form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const handleDelete = async (id: string, name: string) => {
    playClickSound()

    if (confirm(`Are you sure you want to delete index connection "${name}"?`)) {
      try {
        deleteIndexConnection(id)
        await saveConfig()
        showSuccess(`Deleted index connection ${name}`)
      } catch (error) {
        showError(error instanceof Error ? error.message : 'Failed to delete index connection')
      }
    }
  }

  const handleCancel = () => {
    playClickSound()
    setFormData(initialFormData)
    setEditingId(null)
    setErrors({})
  }

  const handleEnableChange = (checked: boolean) => {
    if (checked && !formData.enabled) {
      // User is trying to enable - show confirmation modal
      setShowEnableModal(true)
    } else {
      // User is disabling - allow directly
      setFormData(prev => ({ ...prev, enabled: false }))
    }
  }

  const handleEnableConfirm = () => {
    playClickSound()
    setFormData(prev => ({ ...prev, enabled: true }))
    setShowEnableModal(false)
  }

  const handleEnableCancel = () => {
    playClickSound()
    setShowEnableModal(false)
  }

  return (
    <div className={styles.indexConnectionsPage}>
      {/* Breadcrumb Navigation */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link to="/configuration" className={styles.breadcrumbLink}>
          <ChevronLeftIcon className={styles.backIcon} />
          <span>Configuration</span>
        </Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>Index Connections</span>
      </nav>

      <div className={styles.header}>
        <div>
          <h1>Index Connections</h1>
          <p>Discover and browse community agents from public indexes.</p>
        </div>
        <a
          href="https://docs.agentsystems.ai/configuration/index-connections"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.docsLink}
          title="View documentation"
        >
          <QuestionMarkCircleIcon className={styles.docsIcon} />
          <span>View Docs</span>
        </a>
      </div>

      {/* Add/Edit Form */}
      <Card className={styles.formCard} ref={formRef}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2>
            <GlobeAltIcon />
            {editingId ? `Edit Index Connection` : 'Add New Index Connection'}
          </h2>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="index-name">Name</label>
              <input
                id="index-name"
                type="text"
                value={formData.name}
                onChange={(e) => {
                  const value = e.target.value.toLowerCase()
                  setFormData(prev => ({ ...prev, name: value }))
                  if (errors.name) setErrors(prev => ({ ...prev, name: '' }))
                }}
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                placeholder="agentsystems"
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
              <label htmlFor="index-url">Index API URL</label>
              <input
                id="index-url"
                type="text"
                value={formData.url}
                onChange={(e) => {
                  const newUrl = e.target.value
                  setFormData(prev => {
                    // If URL changes while enabled, uncheck enabled to require re-acknowledgement
                    const shouldDisable = prev.enabled && prev.url && newUrl !== prev.url
                    return {
                      ...prev,
                      url: newUrl,
                      enabled: shouldDisable ? false : prev.enabled
                    }
                  })
                  if (errors.url) setErrors(prev => ({ ...prev, url: '' }))
                }}
                className={`${styles.input} ${errors.url ? styles.inputError : ''}`}
                placeholder="https://index-api.agentsystems.ai"
                required
              />
              {errors.url && (
                <span className={styles.errorText}>{errors.url}</span>
              )}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="index-description">Description (Optional)</label>
              <input
                id="index-description"
                type="text"
                value={formData.description}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, description: e.target.value }))
                }}
                className={styles.input}
                placeholder="Community-contributed agent marketplace"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.enabled}
                  onChange={(e) => handleEnableChange(e.target.checked)}
                  className={styles.checkbox}
                  disabled={!formData.url}
                />
                Enabled
              </label>
              <span className={styles.hint}>
                {formData.url
                  ? 'Enable to browse agents from this index'
                  : 'Provide an Index API URL first'}
              </span>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className="btn btn-lg btn-bright">
              <CheckIcon />
              {editingId ? 'Update' : 'Add'} Index Connection
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

      {/* Index Connections List */}
      <Card>
        <div className={styles.listHeader}>
          <h2>Configured Index Connections ({indexes.length})</h2>
        </div>

        {indexes.length === 0 ? (
          <div className={styles.emptyState}>
            <GlobeAltIcon />
            <h3>No index connections configured</h3>
            <p>Add your first index connection using the form above</p>
          </div>
        ) : (
          <div className={styles.list}>
            {indexes.map((index) => {
              return (
                <div key={index.id} className={styles.listItem}>
                  <div className={styles.itemHeader}>
                    <div className={styles.itemName}>
                      <GlobeAltIcon />
                      <span className={styles.indexName}>{index.name}</span>
                      <span className={`${styles.statusBadge} ${index.enabled ? styles.enabled : styles.disabled}`}>
                        {index.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>

                    <div className={styles.itemActions}>
                      <button
                        onClick={() => handleEdit(index)}
                        className="btn btn-sm btn-ghost"
                        title="Edit index connection"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(index.id, index.name)}
                        className={`btn btn-sm btn-ghost ${styles.deleteBtn}`}
                        title="Delete index connection"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>

                  <div className={styles.itemDetails}>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>URL:</span>
                      <code className={styles.detailValue}>{index.url}</code>
                    </div>
                    {index.description && (
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Description:</span>
                        <span className={styles.detailValue}>{index.description}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* Enable Confirmation Modal */}
      {showEnableModal && (
        <EnableConfirmationModal
          indexUrl={formData.url}
          onConfirm={handleEnableConfirm}
          onCancel={handleEnableCancel}
        />
      )}

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

// Enable Confirmation Modal Component
interface EnableConfirmationModalProps {
  indexUrl: string
  onConfirm: () => void
  onCancel: () => void
}

function EnableConfirmationModal({ indexUrl, onConfirm, onCancel }: EnableConfirmationModalProps) {
  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <ExclamationTriangleIcon className={styles.modalIcon} />
          <h2>Enable Index Connection</h2>
        </div>

        <div className={styles.modalBody}>
          <p>
            <strong>You are enabling an agent index:</strong>
          </p>
          <div style={{
            padding: '0.75rem',
            background: 'var(--surface-2)',
            borderRadius: '0.25rem',
            marginBottom: '1rem',
            border: '1px solid var(--border)'
          }}>
            <code style={{
              display: 'block',
              wordBreak: 'break-all',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem',
              color: 'var(--text)'
            }}>
              {indexUrl}
            </code>
          </div>
          <p>
            Agents discovered through indexes are provided by third-party developers.
            AgentSystems does not review, endorse, verify, or control any agents listed in indexes.
            You are solely responsible for reviewing agent code, permissions, network access,
            and security before installation.
          </p>
          <p>
            <strong>Install agents at your own risk.</strong> Do you wish to proceed?
          </p>
        </div>

        <div className={styles.modalFooter}>
          <button className="btn btn-lg btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-lg btn-bright" onClick={onConfirm}>
            Enable Index
          </button>
        </div>
      </div>
    </div>
  )
}
