import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { agentsApi } from '@api/agents'
import Card from '@components/common/Card'
import { useAudio } from '@hooks/useAudio'
import type { InvocationResult } from '@types/api'
import styles from './AgentDetail.module.css'

export default function AgentDetail() {
  const { agentName } = useParams<{ agentName: string }>()
  const { playClickSound } = useAudio()
  const [invokePayload, setInvokePayload] = useState('{}')
  const [invocationResult, setInvocationResult] = useState<InvocationResult | null>(null)

  const { data: metadata } = useQuery({
    queryKey: ['agent-metadata', agentName],
    queryFn: () => agentsApi.getMetadata(agentName!),
    enabled: !!agentName,
  })

  const invokeMutation = useMutation({
    mutationFn: (payload: any) => agentsApi.invoke(agentName!, payload),
    onSuccess: async (response) => {
      // Poll for status
      const pollStatus = async () => {
        const status = await agentsApi.getStatus(response.thread_id)
        if (status.state === 'completed') {
          const result = await agentsApi.getResult(response.thread_id)
          setInvocationResult(result)
        } else if (status.state === 'running' || status.state === 'pending') {
          setTimeout(pollStatus, 1000)
        }
      }
      pollStatus()
    },
  })

  const handleInvoke = () => {
    playClickSound()
    try {
      const payload = JSON.parse(invokePayload)
      invokeMutation.mutate(payload)
    } catch (e) {
      console.error('Invalid JSON payload')
    }
  }

  return (
    <div className={styles.detail}>
      <div className={styles.header}>
        <h1>{agentName}</h1>
        <p className={styles.subtitle}>Agent details and invocation</p>
      </div>

      <div className={styles.grid}>
        <Card>
          <h2>Metadata</h2>
          <pre className={styles.metadata}>
            {JSON.stringify(metadata, null, 2)}
          </pre>
        </Card>

        <Card>
          <h2>Invoke Agent</h2>
          <div className={styles.invokeForm}>
            <label>
              Payload (JSON):
              <textarea
                className={styles.payloadInput}
                value={invokePayload}
                onChange={(e) => setInvokePayload(e.target.value)}
                rows={10}
              />
            </label>
            
            <button
              className={styles.invokeButton}
              onClick={handleInvoke}
              disabled={invokeMutation.isPending}
            >
              {invokeMutation.isPending ? 'Invoking...' : 'Invoke'}
            </button>

            {invocationResult && (
              <div className={styles.result}>
                <h3>Result:</h3>
                <pre>{JSON.stringify(invocationResult, null, 2)}</pre>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}