/**
 * Shared types for marketplace data
 */

export type AgentCategory = 
  | 'data-processing'
  | 'content-generation' 
  | 'analysis-insights'
  | 'security-compliance'
  | 'integration-automation'
  | 'specialized'

export type Industry = 
  | 'personal'
  | 'business'
  | 'finance' 
  | 'healthcare'
  | 'legal'
  | 'government'
  | 'technology'
  | 'education'
  | 'manufacturing'

export type ComplianceStandard = string
export type DataRequirement = string  
export type ModelRequirement = string
export type DeploymentType = string
export type PricingModel = 
  | 'free'
  | 'usage-based'
  | 'subscription'
  | 'enterprise'

export interface MarketplaceAgent {
  id: string
  name: string
  displayName: string
  description: string
  longDescription: string
  publisher: string
  category: AgentCategory
  subcategory?: string
  
  targetIndustries: Industry[]
  complianceStandards: ComplianceStandard[]
  dataRequirements: DataRequirement[]
  modelRequirements: ModelRequirement[]
  deploymentTypes: DeploymentType[]
  
  containerImage: string
  version: string
  size: string
  lastUpdated: string
  
  downloads: number
  rating: number
  reviewCount: number
  
  pricingModel: PricingModel
  pricingDescription?: string
  
  egressAllowlist: string[]
  requiredPorts: string[]
  securityNotes?: string
  
  tags: string[]
  featured: boolean
  trending: boolean
  new: boolean
  
  demoAvailable: boolean
  sampleInput?: string
  sampleOutput?: string
}

export interface MarketplacePublisher {
  id: string
  name: string
  displayName: string
  type: 'individual' | 'startup' | 'enterprise' | 'verified'
  verified: boolean
  description: string
  website?: string
  totalAgents: number
  totalDownloads: number
  joinedDate: string
  rating: number
  avatar: string
}