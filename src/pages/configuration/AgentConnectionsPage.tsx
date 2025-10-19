import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useConfigStore } from '@stores/configStore'
import { useAudio } from '@hooks/useAudio'
import { useToast } from '@hooks/useToast'
import Card from '@components/common/Card'
import Toast from '@components/Toast'
import { AgentConfigForm } from '../../types/config'
import {
  PlusIcon,
  RocketLaunchIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  ChevronLeftIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'
import styles from './AgentConnectionsPage.module.css'

const initialFormData: Omit<AgentConfigForm, 'id'> = {
  name: '',
  repo: '',
  tag: 'latest',
  registry_connection: '',
  egressAllowlist: '',
  labels: { 'agent.port': '8000' },
  envVariables: {},
  exposePorts: '8000'
}

export default function AgentConnectionsPage() {
  const [formData, setFormData] = useState<Omit<AgentConfigForm, 'id'>>(initialFormData)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showForm, setShowForm] = useState(false)
  // Advanced options removed - keeping state for potential future use
  // @ts-expect-error - keeping for potential future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showAdvanced] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)
  
  const { playClickSound } = useAudio()
  const { toasts, removeToast, showSuccess, showError } = useToast()
  
  const {
    getAgents,
    addAgent,
    updateAgent,
    deleteAgent,
    getRegistryConnections,
    saveConfig
  } = useConfigStore()

  const agents = getAgents()
  const registries = getRegistryConnections()

  const validateForm = (data: Omit<AgentConfigForm, 'id'>): boolean => {
    const newErrors: Record<string, string> = {}

    if (!data.name) {
      newErrors.name = 'Agent name is required'
    } else if (!/^[a-z0-9-]+$/.test(data.name)) {
      newErrors.name = 'Name must be lowercase letters, numbers, and hyphens only'
    } else if (!editingId && agents.some(a => a.name === data.name)) {
      // Only check for duplicates when adding a new agent (not editing)
      newErrors.name = `Agent name "${data.name}" already exists. Please choose a unique name.`
    }

    if (!data.repo) {
      newErrors.repo = 'Repository is required'
    }

    if (!data.tag) {
      newErrors.tag = 'Tag is required'
    }

    if (!data.registry_connection) {
      newErrors.registry_connection = 'Registry connection is required'
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
        updateAgent(editingId, formData)
        showSuccess(`Updated agent ${formData.name}`)
        setEditingId(null)
      } else {
        addAgent(formData)
        showSuccess(`Added agent ${formData.name}`)
      }
      
      // Save changes to config file
      await saveConfig()

      setFormData(initialFormData)
      setErrors({})
      setShowForm(false)
      setEditingId(null)
      // Advanced section removed
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to save agent')
    }
  }

  const handleEdit = (agent: AgentConfigForm) => {
    playClickSound()
    setFormData({
      name: agent.name,
      repo: agent.repo,
      tag: agent.tag,
      registry_connection: agent.registry_connection,
      egressAllowlist: agent.egressAllowlist,
      labels: agent.labels,
      envVariables: agent.envVariables,
      exposePorts: agent.exposePorts
    })
    setEditingId(agent.id)
    setShowForm(true)
    setErrors({})
    // Advanced section removed - no longer needed

    // Auto-scroll to form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const handleDelete = async (id: string, name: string) => {
    playClickSound()
    
    if (confirm(`Are you sure you want to delete agent "${name}"?`)) {
      try {
        deleteAgent(id)
        await saveConfig()
        showSuccess(`Deleted agent ${name}`)
      } catch (error) {
        showError(error instanceof Error ? error.message : 'Failed to delete agent')
      }
    }
  }

  const handleCancel = () => {
    playClickSound()
    setFormData(initialFormData)
    setEditingId(null)
    setShowForm(false)
    setErrors({})
    // Advanced section removed
  }

  const handleAddNew = () => {
    playClickSound()
    setFormData(initialFormData)
    setEditingId(null)
    setShowForm(true)
    setErrors({})

    // Auto-scroll to form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <div className={styles.agentsPage}>
      {/* Breadcrumb Navigation */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link to="/configuration" className={styles.breadcrumbLink}>
          <ChevronLeftIcon className={styles.backIcon} />
          <span>Configuration</span>
        </Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>Agent Connections</span>
      </nav>

      <div className={styles.header}>
        <div>
          <h1>Agent Connections</h1>
          <p>Configure agent deployments using your registry connections</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <a
            href="https://docs.agentsystems.ai/configuration/agent-connections"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-ghost"
            title="View documentation"
          >
            <QuestionMarkCircleIcon style={{ width: '1rem', height: '1rem' }} />
            View Docs
          </a>
          <button
            onClick={handleAddNew}
            className="btn btn-sm btn-primary"
            title="Add new agent connection"
          >
            <PlusIcon />
            Add Connection
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
      <Card className={styles.formCard} ref={formRef}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2>
            <RocketLaunchIcon />
            {editingId ? `Edit Agent Connection` : 'Add New Agent Connection'}
          </h2>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="agent-name">Agent Name</label>
              <input
                id="agent-name"
                type="text"
                value={formData.name}
                onChange={(e) => {
                  const value = e.target.value.toLowerCase()
                  setFormData(prev => ({ ...prev, name: value }))
                  if (errors.name) setErrors(prev => ({ ...prev, name: '' }))
                }}
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                placeholder="hello-world-agent"
                disabled={!!editingId}
                required
              />
              {errors.name && (
                <span className={styles.errorText}>{errors.name}</span>
              )}
              <span className={styles.hint}>
                Lowercase letters, numbers, and hyphens only
              </span>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="agent-repo">Repository</label>
              <input
                id="agent-repo"
                type="text"
                value={formData.repo}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, repo: e.target.value }))
                  if (errors.repo) setErrors(prev => ({ ...prev, repo: '' }))
                }}
                className={`${styles.input} ${errors.repo ? styles.inputError : ''}`}
                placeholder="agentsystems/hello-world-agent"
                required
              />
              {errors.repo && (
                <span className={styles.errorText}>{errors.repo}</span>
              )}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="agent-tag">Tag</label>
              <input
                id="agent-tag"
                type="text"
                value={formData.tag}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, tag: e.target.value }))
                  if (errors.tag) setErrors(prev => ({ ...prev, tag: '' }))
                }}
                className={`${styles.input} ${errors.tag ? styles.inputError : ''}`}
                placeholder="latest"
                required
              />
              {errors.tag && (
                <span className={styles.errorText}>{errors.tag}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="registry-connection">Registry Connection</label>
              <select
                id="registry-connection"
                value={formData.registry_connection}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, registry_connection: e.target.value }))
                  if (errors.registry_connection) setErrors(prev => ({ ...prev, registry_connection: '' }))
                }}
                className={`${styles.select} ${errors.registry_connection ? styles.inputError : ''}`}
                required
              >
                <option value="">Select registry...</option>
                {registries.filter(r => r.enabled).map(registry => (
                  <option key={registry.id} value={registry.id}>
                    {registry.name} ({registry.url})
                  </option>
                ))}
              </select>
              {errors.registry_connection && (
                <span className={styles.errorText}>{errors.registry_connection}</span>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="egress-allowlist">Egress Allowlist</label>
            <input
              id="egress-allowlist"
              type="text"
              value={formData.egressAllowlist}
              onChange={(e) => setFormData(prev => ({ ...prev, egressAllowlist: e.target.value }))}
              className={styles.input}
              placeholder="https://api.anthropic.com, https://api.openai.com"
            />
            <span className={styles.hint}>
              Comma-separated list of URLs this agent can access
            </span>
          </div>

          {/* Advanced Options Section Removed - keeping for potential future use */}
          {false && (
            <div className={styles.advancedSection}>
              <div className={styles.formGroup}>
                <label htmlFor="expose-ports">Exposed Ports</label>
                <input
                  id="expose-ports"
                  type="text"
                  value={formData.exposePorts}
                  onChange={(e) => setFormData(prev => ({ ...prev, exposePorts: e.target.value }))}
                  className={styles.input}
                  placeholder="8000"
                />
                <span className={styles.hint}>
                  Comma-separated list of ports to expose
                </span>
              </div>

              <div className={styles.formGroup}>
                <label>Environment Variables</label>
                <div className={styles.envVarsContainer}>
                  {Object.entries(formData.envVariables).map(([key, value]) => (
                    <div key={key} className={styles.envVarRow}>
                      <input
                        type="text"
                        value={key}
                        onChange={(e) => {
                          const newKey = e.target.value
                          setFormData(prev => {
                            const newEnvVars = { ...prev.envVariables }
                            delete newEnvVars[key]
                            if (newKey) newEnvVars[newKey] = value
                            return { ...prev, envVariables: newEnvVars }
                          })
                        }}
                        className={styles.envVarKey}
                        placeholder="KEY"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            envVariables: { ...prev.envVariables, [key]: e.target.value }
                          }))
                        }}
                        className={styles.envVarValue}
                        placeholder="value"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => {
                            const newEnvVars = { ...prev.envVariables }
                            delete newEnvVars[key]
                            return { ...prev, envVariables: newEnvVars }
                          })
                        }}
                        className="btn btn-sm btn-ghost"
                      >
                        <XMarkIcon />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        envVariables: { ...prev.envVariables, '': '' }
                      }))
                    }}
                    className="btn btn-sm btn-subtle"
                  >
                    <PlusIcon />
                    Add Environment Variable
                  </button>
                </div>
                <span className={styles.hint}>
                  Environment variables to set in the agent container
                </span>
              </div>
            </div>
          )}

          <div className={styles.formActions}>
            <button type="submit" className="btn btn-lg btn-bright">
              <CheckIcon />
              {editingId ? 'Update' : 'Add'} Connection
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-lg btn-subtle"
            >
              <XMarkIcon />
              Cancel
            </button>
          </div>
        </form>
      </Card>
      )}

      {/* Agent Connections List */}
      <Card>
        <div className={styles.listHeader}>
          <h2>Configured Agent Connections ({agents.length})</h2>
        </div>

        {agents.length === 0 ? (
          <div className={styles.emptyState}>
            <RocketLaunchIcon />
            <h3>No agent connections configured</h3>
            <p>Add your first agent connection to get started</p>
          </div>
        ) : (
          <div className={styles.list}>
            {agents.map((agent) => (
              <div key={agent.id} className={styles.listItem}>
                <div className={styles.itemHeader}>
                  <div className={styles.itemName}>
                    <RocketLaunchIcon />
                    <span className={styles.agentName}>{agent.name}</span>
                  </div>
                  
                  <div className={styles.itemActions}>
                    <button
                      onClick={() => handleEdit(agent)}
                      className="btn btn-sm btn-ghost"
                      title="Edit agent"
                    >
                      Edit
                    </button>
                    
                    <button
                      onClick={() => handleDelete(agent.id, agent.name)}
                      className={`btn btn-sm btn-ghost ${styles.deleteBtn}`}
                      title="Delete agent"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
                
                <div className={styles.itemDetails}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Image:</span>
                    <code className={styles.detailValue}>{agent.repo}:{agent.tag}</code>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Registry:</span>
                    <span className={styles.detailValue}>{agent.registry_connection}</span>
                  </div>
                  {agent.egressAllowlist && (
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Egress:</span>
                      <span className={styles.detailValue}>{agent.egressAllowlist}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
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