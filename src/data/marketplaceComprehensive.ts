/**
 * Comprehensive Professional Marketplace Data
 * 
 * Multi-industry agent marketplace showcasing professional workflow automation
 * across banking, healthcare, legal, and other regulated industries.
 * 
 * TODO: Replace with real API integration when marketplace goes live
 */

import { BANKING_AGENTS } from './industries/banking'
import { HEALTHCARE_AGENTS } from './industries/healthcare'  
import { LEGAL_AGENTS } from './industries/legal'
import { GOVERNMENT_AGENTS } from './industries/government'
import { BUSINESS_AGENTS } from './industries/business'
import { PERSONAL_AGENTS } from './industries/personal'
import type { 
  MarketplaceAgent, 
  MarketplacePublisher,
  AgentCategory,
  Industry
} from './types'

// Enhanced Publishers for Professional Marketplace
export const MOCK_PUBLISHERS: Record<string, MarketplacePublisher> = {
  'agentsystems': {
    id: 'agentsystems',
    name: 'agentsystems',
    displayName: 'AgentSystems',
    type: 'verified',
    verified: true,
    description: 'Official agents from the AgentSystems team for core platform functionality',
    website: 'https://agentsystems.ai',
    totalAgents: 6,
    totalDownloads: 15000,
    joinedDate: '2024-01-01',
    rating: 4.8,
    avatar: '/publishers/agentsystems.png'
  },
  'fintech-solutions': {
    id: 'fintech-solutions',
    name: 'fintech-solutions',
    displayName: 'FinTech Solutions Inc',
    type: 'enterprise',
    verified: true,
    description: 'Banking, financial services, and legal workflow automation specialists',
    website: 'https://fintech-solutions.com',
    totalAgents: 28,
    totalDownloads: 35000,
    joinedDate: '2024-01-20',
    rating: 4.7,
    avatar: '/publishers/fintech.png'
  },
  'healthtech-ai': {
    id: 'healthtech-ai',
    name: 'healthtech-ai',
    displayName: 'HealthTech AI',
    type: 'enterprise',
    verified: true,
    description: 'HIPAA-compliant healthcare workflow automation and clinical decision support',
    website: 'https://healthtech-ai.com',
    totalAgents: 15,
    totalDownloads: 22000,
    joinedDate: '2024-02-15',
    rating: 4.9,
    avatar: '/publishers/healthtech.png'
  },
  'security-first': {
    id: 'security-first',
    name: 'security-first',
    displayName: 'Security First Labs',
    type: 'startup',
    verified: true,
    description: 'Cybersecurity, fraud detection, and regulatory compliance automation',
    website: 'https://securityfirst.io',
    totalAgents: 12,
    totalDownloads: 18500,
    joinedDate: '2024-02-28',
    rating: 4.6,
    avatar: '/publishers/security.png'
  },
  'open-agents': {
    id: 'open-agents',
    name: 'open-agents',
    displayName: 'Open Agents Community',
    type: 'individual',
    verified: false,
    description: 'Open source professional workflow agents for various industries',
    totalAgents: 22,
    totalDownloads: 28000,
    joinedDate: '2024-03-01',
    rating: 4.4,
    avatar: '/publishers/community.png'
  },
  'govtech-solutions': {
    id: 'govtech-solutions',
    name: 'govtech-solutions',
    displayName: 'GovTech Solutions',
    type: 'enterprise',
    verified: true,
    description: 'Government and public sector workflow automation specialists',
    website: 'https://govtech-solutions.com',
    totalAgents: 8,
    totalDownloads: 8500,
    joinedDate: '2024-02-10',
    rating: 4.7,
    avatar: '/publishers/govtech.png'
  }
}

// Combine all professional agents from different industries
export const MOCK_AGENTS: MarketplaceAgent[] = [
  ...BANKING_AGENTS,
  ...HEALTHCARE_AGENTS,
  ...LEGAL_AGENTS,
  ...GOVERNMENT_AGENTS,
  ...BUSINESS_AGENTS,
  ...PERSONAL_AGENTS,
  
  // Technology and Security Agents
  {
    id: 'security-vulnerability-prioritizer',
    name: 'security-vulnerability-prioritizer',
    displayName: 'Security Vulnerability Prioritization Agent',
    description: 'AI-powered vulnerability assessment with business impact analysis and remediation prioritization',
    longDescription: 'Advanced vulnerability assessment that combines traditional scanning with AI analysis to prioritize security vulnerabilities based on business impact, exploitability, and threat landscape. Provides remediation guidance, tracks fix progress, and integrates with development workflows.',
    publisher: 'security-first',
    category: 'security-compliance',
    subcategory: 'Vulnerability Management',
    
    targetIndustries: ['technology'],
    complianceStandards: ['ISO 27001', 'SOC 2'],
    dataRequirements: ['api-access'],
    modelRequirements: ['gpt-4', 'local-llm'],
    deploymentTypes: ['on-premise', 'air-gapped'],
    
    containerImage: 'security-first/vuln-prioritizer',
    version: '3.1.2',
    size: '1.4 GB',
    lastUpdated: '2024-03-25',
    
    downloads: 890,
    rating: 4.7,
    reviewCount: 52,
    
    pricingModel: 'subscription',
    pricingDescription: '$300/month per security analyst',
    
    egressAllowlist: ['https://nvd.nist.gov'],
    requiredPorts: ['8000', '8443'],
    securityNotes: 'Vulnerability data processed locally with threat intelligence integration.',
    
    tags: ['technology', 'vulnerability-management', 'risk-prioritization', 'devops', 'threat-analysis'],
    featured: true,
    trending: true,
    new: false,
    
    demoAvailable: false
  },

  {
    id: 'code-security-auditor',
    name: 'code-security-auditor',
    displayName: 'Code Security Audit Agent',
    description: 'Automated code security auditing with vulnerability detection and secure coding recommendations',
    longDescription: 'Performs comprehensive security audits of source code to identify security vulnerabilities, coding best practice violations, and potential attack vectors. Analyzes code against OWASP guidelines, identifies SQL injection risks, XSS vulnerabilities, and provides specific remediation recommendations.',
    publisher: 'security-first',
    category: 'security-compliance',
    subcategory: 'Code Security',
    
    targetIndustries: ['technology'],
    complianceStandards: ['OWASP', 'Secure Coding Standards'],
    dataRequirements: ['files', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise', 'cloud'],
    
    containerImage: 'security-first/code-auditor',
    version: '2.2.3',
    size: '1.1 GB',
    lastUpdated: '2024-03-23',
    
    downloads: 1240,
    rating: 4.4,
    reviewCount: 78,
    
    pricingModel: 'usage-based',
    pricingDescription: '$5 per 1000 lines of code audited',
    
    egressAllowlist: ['https://api.github.com'],
    requiredPorts: ['8000'],
    securityNotes: 'Source code analyzed locally with secure repository integration.',
    
    tags: ['technology', 'code-audit', 'vulnerability-detection', 'secure-coding', 'owasp'],
    featured: false,
    trending: true,
    new: false,
    
    demoAvailable: true
  },

  // Free and Open Source Agents
  {
    id: 'basic-document-classifier',
    name: 'basic-document-classifier',
    displayName: 'Document Classification Agent',
    description: 'Basic document classification and organization for office workflows',
    longDescription: 'Open source document classification system that categorizes documents by type, extracts basic metadata, and organizes files for easy retrieval. Supports common document formats and provides simple workflow automation for document management.',
    publisher: 'open-agents',
    category: 'data-processing',
    subcategory: 'Document Management',
    
    targetIndustries: ['business'],
    complianceStandards: [],
    dataRequirements: ['documents'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'openagents/doc-classifier',
    version: '1.4.0',
    size: '450 MB',
    lastUpdated: '2024-03-20',
    
    downloads: 3400,
    rating: 4.2,
    reviewCount: 189,
    
    pricingModel: 'free',
    pricingDescription: 'Open source - free to use',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'All document processing performed locally.',
    
    tags: ['office', 'document-classification', 'workflow', 'open-source'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'email-auto-responder',
    name: 'email-auto-responder',
    displayName: 'Intelligent Email Auto-Responder',
    description: 'AI-powered email auto-response system with context-aware replies',
    longDescription: 'Free email automation agent that analyzes incoming emails and generates contextually appropriate auto-responses. Categorizes emails by urgency and type, provides draft responses for common inquiries, and escalates complex requests to human staff.',
    publisher: 'open-agents',
    category: 'integration-automation',
    subcategory: 'Email Management',
    
    targetIndustries: ['business'],
    complianceStandards: [],
    dataRequirements: ['text-only', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'openagents/email-responder',
    version: '2.1.0',
    size: '520 MB',
    lastUpdated: '2024-03-22',
    
    downloads: 5600,
    rating: 4.0,
    reviewCount: 267,
    
    pricingModel: 'free',
    pricingDescription: 'Open source with optional premium features',
    
    egressAllowlist: ['https://api.gmail.com', 'https://api.outlook.com'],
    requiredPorts: ['8000'],
    securityNotes: 'Email content processed locally with secure API integration.',
    
    tags: ['office', 'email-automation', 'auto-response', 'workflow', 'free'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'meeting-minutes-generator',
    name: 'meeting-minutes-generator',
    displayName: 'Meeting Minutes Generator',
    description: 'Automated meeting minutes generation from audio transcripts and notes',
    longDescription: 'Free meeting minutes generator that converts meeting transcripts and notes into structured meeting minutes. Identifies action items, decisions, and key discussion points. Formats output for professional distribution and maintains participant confidentiality.',
    publisher: 'open-agents',
    category: 'content-generation',
    subcategory: 'Meeting Management',
    
    targetIndustries: ['business'],
    complianceStandards: [],
    dataRequirements: ['text-only'],
    modelRequirements: ['claude-3-5-sonnet', 'gpt-4'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'openagents/meeting-minutes',
    version: '1.8.1',
    size: '380 MB',
    lastUpdated: '2024-03-19',
    
    downloads: 2800,
    rating: 4.3,
    reviewCount: 134,
    
    pricingModel: 'free',
    pricingDescription: 'Completely free and open source',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Meeting content processed locally with privacy protection.',
    
    tags: ['office', 'meeting-minutes', 'transcription', 'workflow', 'free'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'expense-report-processor',
    name: 'expense-report-processor',
    displayName: 'Expense Report Processing Agent',
    description: 'Automated expense report processing with receipt analysis and policy validation',
    longDescription: 'Free expense report automation that processes receipt images, extracts expense details, validates against company policies, and generates expense reports. Identifies policy violations and flags unusual expenses for human review.',
    publisher: 'open-agents',
    category: 'data-processing',
    subcategory: 'Expense Management',
    
    targetIndustries: ['business'],
    complianceStandards: [],
    dataRequirements: ['images', 'documents'],
    modelRequirements: ['multimodal', 'gpt-4'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'openagents/expense-processor',
    version: '1.6.2',
    size: '680 MB',
    lastUpdated: '2024-03-21',
    
    downloads: 4200,
    rating: 4.1,
    reviewCount: 198,
    
    pricingModel: 'free',
    pricingDescription: 'Free with optional corporate features',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Receipt data processed locally with expense policy validation.',
    
    tags: ['office', 'expense-reports', 'receipt-processing', 'policy-validation', 'free'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'basic-data-entry-assistant',
    name: 'basic-data-entry-assistant',
    displayName: 'Data Entry Assistant Agent',
    description: 'Automated data entry from forms and documents into structured databases',
    longDescription: 'Free data entry automation that extracts information from forms, invoices, and documents to populate databases and spreadsheets. Validates data accuracy, identifies missing fields, and provides simple workflow automation for common data entry tasks.',
    publisher: 'open-agents',
    category: 'data-processing',
    subcategory: 'Data Entry',
    
    targetIndustries: ['business'],
    complianceStandards: [],
    dataRequirements: ['documents', 'images'],
    modelRequirements: ['multimodal', 'gpt-4'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'openagents/data-entry',
    version: '1.5.3',
    size: '420 MB',
    lastUpdated: '2024-03-18',
    
    downloads: 6700,
    rating: 3.9,
    reviewCount: 342,
    
    pricingModel: 'free',
    pricingDescription: 'Completely free and open source',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Form data processed locally with accuracy validation.',
    
    tags: ['office', 'data-entry', 'form-processing', 'automation', 'free'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  }
]

// Enhanced category definitions for professional marketplace
export const MARKETPLACE_CATEGORIES = {
  'data-processing': {
    name: 'Data Processing',
    description: 'Document validation, data integrity, regulatory reporting, and structured data extraction',
    icon: 'database'
  },
  'content-generation': {
    name: 'Content Generation', 
    description: 'Legal documents, clinical notes, compliance materials, and professional communications',
    icon: 'pencil-square'
  },
  'analysis-insights': {
    name: 'Analysis & Insights',
    description: 'Risk assessment, financial analysis, clinical decision support, and pattern recognition',
    icon: 'chart-bar'
  },
  'security-compliance': {
    name: 'Security & Compliance',
    description: 'Regulatory compliance, fraud detection, audit preparation, and quality assurance',
    icon: 'shield-check'
  },
  'integration-automation': {
    name: 'Integration & Automation',
    description: 'Workflow automation, system integration, and business process optimization',
    icon: 'cog-6-tooth'
  },
  'specialized': {
    name: 'Specialized',
    description: 'Industry-specific professional workflows requiring domain expertise',
    icon: 'academic-cap'
  }
} as const

// Enhanced utility functions
export function getAgentsByCategory(category: AgentCategory): MarketplaceAgent[] {
  return MOCK_AGENTS.filter(agent => agent.category === category)
}

export function getAgentsByIndustry(industry: Industry): MarketplaceAgent[] {
  return MOCK_AGENTS.filter(agent => 
    agent.targetIndustries.includes(industry)
  )
}

export function getAgentsByPublisher(publisherId: string): MarketplaceAgent[] {
  return MOCK_AGENTS.filter(agent => agent.publisher === publisherId)
}

export function getFeaturedAgents(): MarketplaceAgent[] {
  return MOCK_AGENTS.filter(agent => agent.featured)
}

export function getTrendingAgents(): MarketplaceAgent[] {
  return MOCK_AGENTS.filter(agent => agent.trending)
}

export function getNewAgents(): MarketplaceAgent[] {
  return MOCK_AGENTS.filter(agent => agent.new)
}

export function searchAgents(query: string): MarketplaceAgent[] {
  const lowerQuery = query.toLowerCase()
  return MOCK_AGENTS.filter(agent =>
    agent.displayName.toLowerCase().includes(lowerQuery) ||
    agent.description.toLowerCase().includes(lowerQuery) ||
    agent.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    agent.subcategory?.toLowerCase().includes(lowerQuery) ||
    agent.complianceStandards.some(std => std.toLowerCase().includes(lowerQuery))
  )
}

export function getAgent(id: string): MarketplaceAgent | undefined {
  return MOCK_AGENTS.find(agent => agent.id === id)
}

export function getPublisher(id: string): MarketplacePublisher | undefined {
  return MOCK_PUBLISHERS[id]
}

export function getAgentsByCompliance(compliance: string): MarketplaceAgent[] {
  return MOCK_AGENTS.filter(agent =>
    agent.complianceStandards.some(std => 
      std.toLowerCase().includes(compliance.toLowerCase())
    )
  )
}

export function getMarketplaceStats() {
  return {
    totalAgents: MOCK_AGENTS.length,
    totalPublishers: Object.keys(MOCK_PUBLISHERS).length,
    totalDownloads: MOCK_AGENTS.reduce((sum, agent) => sum + agent.downloads, 0),
    verifiedPublishers: Object.values(MOCK_PUBLISHERS).filter(p => p.verified).length,
    industryCount: [...new Set(MOCK_AGENTS.flatMap(agent => agent.targetIndustries))].length
  }
}