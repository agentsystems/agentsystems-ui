import { useState, useMemo } from 'react'
import { MagnifyingGlassIcon, StarIcon, ShieldCheckIcon, PlusIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import Card from '@components/common/Card'
import { 
  MOCK_AGENTS, 
  MOCK_PUBLISHERS,
  MARKETPLACE_CATEGORIES,
  searchAgents
} from '@data/marketplaceComprehensive'
import { getModel } from '@data/modelCatalogUnified'
import type { MarketplaceAgent, AgentCategory, Industry, PricingModel } from '@data/types'
import styles from './Marketplace.module.css'

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<AgentCategory | 'all'>('all')
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | 'all'>('all')
  const [selectedPricing, setSelectedPricing] = useState<PricingModel | 'all'>('all')
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [selectedAgent, setSelectedAgent] = useState<MarketplaceAgent | null>(null)

  // Calculate agent counts for each model and prepare display data
  const modelOptions = useMemo(() => {
    const supportedModelIds = [
      'claude-sonnet-4', 'claude-3-5-sonnet', 'claude-3-5-haiku',
      'gpt-5', 'gpt-5-mini', 'gpt-5-nano', 'gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo',
      'o1', 'o1-mini', 'llama-3-3-70b'
    ]
    
    return supportedModelIds.map(modelId => {
      const modelDef = getModel(modelId)
      const agentCount = MOCK_AGENTS.filter(agent => 
        agent.modelRequirements.includes(modelId)
      ).length
      
      return {
        id: modelId,
        displayName: modelDef?.displayName || modelId,
        count: agentCount,
        label: `${modelDef?.displayName || modelId} (${agentCount})`
      }
    }).filter(model => model.count > 0) // Only show models that have agents
  }, [])

  // Filter and search logic
  const filteredAgents = useMemo(() => {
    let agents = searchQuery ? searchAgents(searchQuery) : MOCK_AGENTS
    
    if (selectedCategory !== 'all') {
      agents = agents.filter(agent => agent.category === selectedCategory)
    }
    
    if (selectedIndustry !== 'all') {
      agents = agents.filter(agent => 
        agent.targetIndustries.includes(selectedIndustry)
      )
    }
    
    if (selectedPricing !== 'all') {
      agents = agents.filter(agent => agent.pricingModel === selectedPricing)
    }
    
    if (selectedModels.length > 0) {
      agents = agents.filter(agent => 
        selectedModels.some(model => agent.modelRequirements.includes(model))
      )
    }
    
    // Sort by industry when all industries selected, otherwise by name
    if (selectedIndustry === 'all') {
      agents.sort((a, b) => {
        const industryA = a.targetIndustries[0] || 'zzz'
        const industryB = b.targetIndustries[0] || 'zzz'
        if (industryA !== industryB) {
          return industryA.localeCompare(industryB)
        }
        return a.displayName.localeCompare(b.displayName)
      })
    } else {
      agents.sort((a, b) => a.displayName.localeCompare(b.displayName))
    }
    
    return agents
  }, [searchQuery, selectedCategory, selectedIndustry, selectedPricing, selectedModels])


  const handleAgentClick = (agent: MarketplaceAgent) => {
    setSelectedAgent(agent)
  }

  const handleAddToDeployment = (agent: MarketplaceAgent) => {
    // TODO: Integrate with actual deployment configuration
    alert(`Agent Ecosystem is currently in beta - this is a demonstration of the planned Agent Ecosystem feature. ${agent.displayName} is not actually being deployed to your platform.`)
  }

  return (
    <div className={styles.marketplace}>
      <div className={styles.header}>
        <div>
          <h1>Agent Ecosystem</h1>
          <p className={styles.subtitle}>
            Discover and deploy workflow automation agents for business, personal, and regulated industries
          </p>
        </div>
        <a
          href="https://docs.agentsystems.ai/user-guide/agent-index"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.docsLink}
          title="View documentation"
        >
          <QuestionMarkCircleIcon className={styles.docsIcon} />
          <span>View Docs</span>
        </a>
      </div>
      
      <div className={styles.betaBanner}>
        🚧 <strong>Beta Preview:</strong> Agent Ecosystem showcasing the future of open agent infrastructure.
        Explore agents for business, development, and personal use - many are free and open source.
      </div>

      {/* Search and Filters */}
      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <MagnifyingGlassIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search agents, publishers, or use cases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label>Industry</label>
          <select 
            value={selectedIndustry} 
            onChange={(e) => setSelectedIndustry(e.target.value as Industry | 'all')}
          >
            <option value="all">All Industries</option>
            <option value="personal">Personal Use</option>
            <option value="business">Business & Sales</option>
            <option value="finance">Banking & Finance</option>
            <option value="healthcare">Healthcare</option>
            <option value="legal">Legal</option>
            <option value="government">Government</option>
            <option value="technology">Technology</option>
            <option value="education">Education</option>
            <option value="manufacturing">Manufacturing</option>
          </select>
        </div>
        
        <div className={styles.filterGroup}>
          <label>Category</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value as AgentCategory | 'all')}
          >
            <option value="all">All Categories</option>
            {Object.entries(MARKETPLACE_CATEGORIES).map(([key, category]) => (
              <option key={key} value={key}>{category.name}</option>
            ))}
          </select>
        </div>
        
        <div className={styles.filterGroup}>
          <label>Pricing</label>
          <select 
            value={selectedPricing} 
            onChange={(e) => setSelectedPricing(e.target.value as PricingModel | 'all')}
          >
            <option value="all">All Pricing</option>
            <option value="free">Free</option>
            <option value="usage-based">Usage-based</option>
            <option value="subscription">Subscription</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Models ({selectedModels.length} selected)</label>
          <div className={styles.multiSelect}>
            {modelOptions.map(model => (
              <label key={model.id} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={selectedModels.includes(model.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedModels(prev => [...prev, model.id])
                    } else {
                      setSelectedModels(prev => prev.filter(id => id !== model.id))
                    }
                  }}
                  className={styles.checkbox}
                />
                {model.label}
              </label>
            ))}
          </div>
        </div>
        
        {/* Active Filters Display */}
        {(selectedCategory !== 'all' || selectedIndustry !== 'all' || selectedPricing !== 'all' || selectedModels.length > 0) && (
          <div className={styles.activeFilters}>
            <span>Active filters:</span>
            {selectedIndustry !== 'all' && (
              <span className={styles.activeFilter}>
                Industry: {selectedIndustry}
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className={styles.activeFilter}>
                Category: {MARKETPLACE_CATEGORIES[selectedCategory as keyof typeof MARKETPLACE_CATEGORIES]?.name}
              </span>
            )}
            {selectedPricing !== 'all' && (
              <span className={styles.activeFilter}>
                Pricing: {selectedPricing}
              </span>
            )}
            {selectedModels.length > 0 && (
              <span className={styles.activeFilter}>
                Models: {selectedModels.join(', ')}
              </span>
            )}
            <button 
              className={styles.clearFilters}
              onClick={() => {
                setSelectedCategory('all')
                setSelectedIndustry('all')
                setSelectedPricing('all')
                setSelectedModels([])
              }}
            >
              Clear All
            </button>
          </div>
        )}
      </div>


      {/* Main Results */}
      <section className={styles.section}>
        <h2>
          {searchQuery ? `Search Results (${filteredAgents.length})` : 
           selectedCategory !== 'all' || selectedIndustry !== 'all' || selectedPricing !== 'all' ?
           `Filtered Results (${filteredAgents.length})` : 
           `All Agents (${filteredAgents.length})`}
        </h2>
        
        
        {filteredAgents.length === 0 ? (
          <div className={styles.noResults}>
            <p>No agents found matching your criteria.</p>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className={styles.agentGrid}>
            {filteredAgents.map(agent => (
              <AgentCard 
                key={agent.id} 
                agent={agent} 
                onClick={() => handleAgentClick(agent)}
                onAddToDeployment={() => handleAddToDeployment(agent)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <AgentDetailModal 
          agent={selectedAgent} 
          onClose={() => setSelectedAgent(null)}
          onAddToDeployment={() => handleAddToDeployment(selectedAgent)}
        />
      )}
    </div>
  )
}

// Agent Card Component
interface AgentCardProps {
  agent: MarketplaceAgent
  onClick: () => void
  onAddToDeployment: () => void
}

function AgentCard({ agent, onClick, onAddToDeployment }: AgentCardProps) {
  const publisher = MOCK_PUBLISHERS[agent.publisher]
  
  return (
    <Card className={styles.agentCard} onClick={onClick}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>
          <h3>{agent.displayName}</h3>
        </div>
      </div>
      
      <div className={styles.publisherInfo}>
        <span className={styles.publisherName}>
          by {publisher?.displayName}
          {publisher?.verified && <ShieldCheckIcon className={styles.verifiedBadge} />}
        </span>
      </div>
      
      <p className={styles.description}>{agent.description}</p>
      
      <div className={styles.cardMeta}>
        <div className={styles.rating}>
          <div className={styles.stars}>
            {[...Array(5)].map((_, i) => (
              i < Math.floor(agent.rating) ? 
                <StarSolidIcon key={i} className={styles.starFilled} /> :
                <StarIcon key={i} className={styles.starEmpty} />
            ))}
          </div>
          <span className={styles.ratingText}>
            {agent.rating} ({agent.reviewCount})
          </span>
        </div>
        
        <div className={styles.downloads}>
          {agent.downloads.toLocaleString()} downloads
        </div>
      </div>
      
      <div className={styles.cardTags}>
        <span className={styles.categoryTag}>
          {MARKETPLACE_CATEGORIES[agent.category].name}
        </span>
        {agent.subcategory && (
          <span className={styles.subcategoryTag}>
            {agent.subcategory}
          </span>
        )}
        {agent.targetIndustries.slice(0, 1).map((industry: string) => (
          <span key={industry} className={styles.industryTag}>
            {industry}
          </span>
        ))}
      </div>
      
      <div className={styles.cardActions}>
        <div className={styles.pricing}>
          {agent.pricingModel === 'free' ? 'Free' : 
           agent.pricingModel === 'usage-based' ? 'Usage-based' :
           agent.pricingModel === 'subscription' ? 'Subscription' : 'Enterprise'}
        </div>
        
        <button 
          className="btn btn-sm btn-subtle"
          onClick={(e) => {
            e.stopPropagation()
            onAddToDeployment()
          }}
        >
          <PlusIcon />
          Add to Deployment
        </button>
      </div>
    </Card>
  )
}

// Agent Detail Modal Component  
interface AgentDetailModalProps {
  agent: MarketplaceAgent
  onClose: () => void
  onAddToDeployment: () => void
}

function AgentDetailModal({ agent, onClose, onAddToDeployment }: AgentDetailModalProps) {
  const publisher = MOCK_PUBLISHERS[agent.publisher]
  
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h2>{agent.displayName}</h2>
            <p className={styles.modalPublisher}>
              by {publisher?.displayName}
              {publisher?.verified && <ShieldCheckIcon className={styles.verifiedBadge} />}
            </p>
          </div>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.modalDescription}>
            <p>{agent.longDescription}</p>
          </div>
          
          <div className={styles.modalSpecs}>
            <div className={styles.specGroup}>
              <h4>Requirements</h4>
              <ul>
                <li><strong>AI Models:</strong> {agent.modelRequirements.join(', ')}</li>
                <li><strong>Data Sources:</strong> {agent.dataRequirements.join(', ')}</li>
                <li><strong>Deployment:</strong> {agent.deploymentTypes.join(', ')}</li>
                {agent.complianceStandards.length > 0 && (
                  <li><strong>Compliance:</strong> {agent.complianceStandards.join(', ')}</li>
                )}
              </ul>
            </div>
            
            <div className={styles.specGroup}>
              <h4>Security & Network</h4>
              <ul>
                <li><strong>Network Access:</strong> {agent.egressAllowlist.length > 0 ? `${agent.egressAllowlist.length} external services` : 'Air-gapped capable'}</li>
                <li><strong>Required Ports:</strong> {agent.requiredPorts.join(', ')}</li>
                {agent.securityNotes && <li><strong>Security:</strong> {agent.securityNotes}</li>}
              </ul>
            </div>
            
            <div className={styles.specGroup}>
              <h4>Technical Details</h4>
              <ul>
                <li><strong>Version:</strong> {agent.version}</li>
                <li><strong>Size:</strong> {agent.size}</li>
                <li><strong>Updated:</strong> {agent.lastUpdated}</li>
                <li><strong>Container:</strong> {agent.containerImage}</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className={styles.modalFooter}>
          <div className={styles.modalPricing}>
            <strong>{agent.pricingDescription || agent.pricingModel}</strong>
          </div>
          <div className={styles.modalActions}>
            <button className="btn btn-lg btn-ghost" onClick={onClose}>
              Close
            </button>
            <button className="btn btn-lg btn-bright" onClick={onAddToDeployment}>
              <PlusIcon />
              Add to Deployment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}