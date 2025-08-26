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
                
                <div className={styles.itemDetails}>
                  <div className={styles.detailBox}>
                    <span className={styles.detailLabel}>Model ID:</span>
                    <code className={styles.detailValue}>
                      {connection.model_id}
                    </code>
                  </div>
                  
                  <div className={styles.detailBox}>
                    <span className={styles.detailLabel}>Hosting Provider:</span>
                    <code className={styles.detailValue}>
                      {hostingProvider?.displayName || connection.hosting_provider}
                    </code>
                  </div>
                  
                  <div className={styles.detailBox}>
                    <span className={styles.detailLabel}>Credentials:</span>
                    <div className={styles.credentialsContainer}>
                      {connection.authMethod === 'api_key' && connection.apiKeyEnv && (
                        <code className={styles.detailValue}>
                          API Key: {connection.apiKeyEnv}
                        </code>
                      )}
                      {connection.authMethod === 'aws_credentials' && (
                        <>
                          {connection.awsAccessKeyEnv && (
                            <code className={styles.detailValue}>
                              Access Key: {connection.awsAccessKeyEnv}
                            </code>
                          )}
                          {connection.awsSecretKeyEnv && (
                            <code className={styles.detailValue}>
                              Secret Key: {connection.awsSecretKeyEnv}
                            </code>
                          )}
                          {connection.awsRegion && connection.awsRegion.trim() && (
                            <code className={styles.detailValue}>
                              Region Env: {connection.awsRegion}
                            </code>
                          )}
                        </>
                      )}
                      {connection.authMethod === 'none' && (
                        <code className={styles.detailValue}>
                          No authentication required
                        </code>
                      )}
                      {(!connection.authMethod || (connection.authMethod === 'api_key' && !connection.apiKeyEnv)) && (
                        <code className={styles.detailValue}>
                          Configuration required
                        </code>
                      )}
                      {connection.endpoint && (
                        <code className={styles.detailValue}>
                          Endpoint: {connection.endpoint}
                        </code>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}