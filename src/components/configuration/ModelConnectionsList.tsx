import { TrashIcon, CpuChipIcon } from '@heroicons/react/24/outline'
import Card from '@components/common/Card'
import { getModel, AUTH_METHODS } from '../../data/modelCatalogUnified'
import { type ModelConnectionForm } from '../../types/config'
import { useAudio } from '@hooks/useAudio'
import styles from './ModelConnectionsList.module.css'

interface ModelConnectionsListProps {
  connections: ModelConnectionForm[]
  onEdit: (connection: ModelConnectionForm) => void
  onDelete: (id: string) => void
}

export default function ModelConnectionsList({ 
  connections, 
  onEdit, 
  onDelete 
}: ModelConnectionsListProps) {
  const { playClickSound } = useAudio()

  const handleEdit = (connection: ModelConnectionForm) => {
    playClickSound()
    onEdit(connection)
  }

  const handleDelete = (id: string) => {
    playClickSound()
    onDelete(id)
  }

  return (
    <Card>
      <div className={styles.listHeader}>
        <h2>Current Model Connections ({connections.length})</h2>
      </div>

      {connections.length === 0 ? (
        <div className={styles.emptyState}>
          <CpuChipIcon />
          <h3>No model connections</h3>
          <p>Add your first model connection using the form above</p>
        </div>
      ) : (
        <div className={styles.list}>
          {connections.map((connection) => {
            const model = getModel(connection.model_id)
            const hostingProvider = model?.hostingProviders.find(p => p.id === connection.hosting_provider)
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
                      {hostingProvider?.displayName || connection.hosting_provider}
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
                      className="btn btn-sm btn-ghost"
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
                     connection.authMethod === 'gcp_oauth' ? 
                      ` ${connection.gcpProjectId} (${connection.gcpRegion})` :
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
  )
}