/**
 * Agent filtering controls component for search and state filtering
 * 
 * Features:
 * - Real-time search by agent name
 * - State filtering (all, running, stopped)
 * - Result count display
 * - Clear search functionality
 * - Stop all agents batch action
 * - Keyboard navigation and accessibility
 * - Audio feedback for interactions
 * 
 * @example
 * ```tsx
 * <AgentFilters
 *   searchQuery={searchQuery}
 *   onSearchChange={setSearchQuery}
 *   selectedFilter={selectedFilter}
 *   onFilterChange={setSelectedFilter}
 *   filteredCount={filteredAgents.length}
 *   totalCount={allAgents.length}
 *   onStopAll={handleStopAll}
 * />
 * ```
 */

import { useAudio } from '@hooks/useAudio'
import styles from './AgentFilters.module.css'

interface AgentFiltersProps {
  /** Current search query */
  searchQuery: string
  /** Callback when search query changes */
  onSearchChange: (query: string) => void
  /** Currently selected filter */
  selectedFilter: 'all' | 'running' | 'stopped'
  /** Callback when filter selection changes */
  onFilterChange: (filter: 'all' | 'running' | 'stopped') => void
  /** Number of agents matching current filters */
  filteredCount: number
  /** Total number of agents */
  totalCount: number
  /** Count of running agents */
  runningCount: number
  /** Count of stopped agents */
  stoppedCount: number
  /** Callback for stop all agents action */
  onStopAll: () => void
  /** Whether stop all operation is in progress */
  isStoppingAll?: boolean
}

export default function AgentFilters({
  searchQuery,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  filteredCount,
  totalCount,
  runningCount,
  stoppedCount,
  onStopAll,
  isStoppingAll = false,
}: AgentFiltersProps) {
  const { playClickSound } = useAudio()

  return (
    <div className={styles.filterControls} role="region" aria-label="Agent filtering controls">
      <div className={styles.searchGroup}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by agent name..."
          className={styles.searchInput}
          aria-label="Search agents by name"
        />
        {searchQuery && (
          <button
            onClick={() => {
              onSearchChange('')
              playClickSound()
            }}
            className={styles.clearSearch}
            aria-label="Clear search"
            title="Clear search"
          >
            ×
          </button>
        )}
      </div>
      
      <select
        value={selectedFilter}
        onChange={(e) => {
          onFilterChange(e.target.value as 'all' | 'running' | 'stopped')
          playClickSound()
        }}
        className={styles.filterSelect}
        aria-label="Filter agents by status"
      >
        <option value="all">All ({totalCount})</option>
        <option value="running">On ({runningCount})</option>
        <option value="stopped">Off ({stoppedCount})</option>
      </select>
      
      <span className={styles.resultCount} aria-live="polite">
        Showing {filteredCount} agent{filteredCount !== 1 ? 's' : ''}
      </span>
      
      <button 
        className="btn btn-sm btn-subtle"
        onClick={() => {
          playClickSound()
          onStopAll()
        }}
        disabled={runningCount === 0 || isStoppingAll}
        aria-label={`Stop all ${runningCount} running agents`}
        title={runningCount === 0 ? 'No running agents to stop' : `Stop all ${runningCount} running agents`}
      >
        {isStoppingAll ? 'Stopping...' : 'Turn Off All'}
      </button>
    </div>
  )
}