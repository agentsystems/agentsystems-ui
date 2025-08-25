/**
 * Mock Marketplace Data
 * 
 * This is a temporary mockup to demonstrate the future AgentSystems marketplace.
 * Contains realistic agent examples to help beta testers envision the platform's potential.
 * 
 * TODO: Replace with real API integration when marketplace goes live
 */

export type AgentCategory = 
  | 'data-processing'
  | 'content-generation' 
  | 'analysis-insights'
  | 'security-compliance'
  | 'integration-automation'
  | 'specialized'

export type Industry = 
  | 'healthcare'
  | 'finance' 
  | 'legal'
  | 'government'
  | 'retail'
  | 'technology'
  | 'manufacturing'
  | 'education'
  | 'any'

export type ComplianceStandard = 
  | 'HIPAA'
  | 'SOX' 
  | 'GDPR'
  | 'FedRAMP'
  | 'PCI-DSS'
  | 'ISO-27001'

export type DataRequirement = 
  | 'text-only'
  | 'files'
  | 'database'
  | 'api-access'
  | 'images'
  | 'documents'

export type ModelRequirement = 
  | 'gpt-4'
  | 'claude-3-5-sonnet'
  | 'claude-3-opus'
  | 'gemini-pro'
  | 'local-llm'
  | 'multimodal'
  | 'any'

export type DeploymentType = 
  | 'cloud'
  | 'on-premise'
  | 'air-gapped'
  | 'hybrid'

export type PricingModel = 
  | 'free'
  | 'usage-based'
  | 'subscription'
  | 'enterprise'

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

export interface MarketplaceAgent {
  id: string
  name: string
  displayName: string
  description: string
  longDescription: string
  publisher: string
  category: AgentCategory
  subcategory?: string
  
  // Targeting & Requirements
  targetIndustries: Industry[]
  complianceStandards: ComplianceStandard[]
  dataRequirements: DataRequirement[]
  modelRequirements: ModelRequirement[]
  deploymentTypes: DeploymentType[]
  
  // Technical specs
  containerImage: string
  version: string
  size: string
  lastUpdated: string
  
  // Social proof
  downloads: number
  rating: number
  reviewCount: number
  
  // Business model
  pricingModel: PricingModel
  pricingDescription?: string
  
  // Security & Networking
  egressAllowlist: string[]
  requiredPorts: string[]
  securityNotes?: string
  
  // Metadata
  tags: string[]
  featured: boolean
  trending: boolean
  new: boolean
  
  // Demo info
  demoAvailable: boolean
  sampleInput?: string
  sampleOutput?: string
}

// Mock Publishers
export const MOCK_PUBLISHERS: Record<string, MarketplacePublisher> = {
  'agentsystems': {
    id: 'agentsystems',
    name: 'agentsystems',
    displayName: 'AgentSystems',
    type: 'verified',
    verified: true,
    description: 'Official agents from the AgentSystems team',
    website: 'https://agentsystems.ai',
    totalAgents: 12,
    totalDownloads: 45000,
    joinedDate: '2024-01-01',
    rating: 4.8,
    avatar: '/publishers/agentsystems.png'
  },
  'healthtech-ai': {
    id: 'healthtech-ai',
    name: 'healthtech-ai',
    displayName: 'HealthTech AI',
    type: 'enterprise',
    verified: true,
    description: 'HIPAA-compliant healthcare AI solutions',
    website: 'https://healthtech-ai.com',
    totalAgents: 8,
    totalDownloads: 12000,
    joinedDate: '2024-02-15',
    rating: 4.9,
    avatar: '/publishers/healthtech.png'
  },
  'fintech-solutions': {
    id: 'fintech-solutions',
    name: 'fintech-solutions',
    displayName: 'FinTech Solutions Inc',
    type: 'enterprise',
    verified: true,
    description: 'Financial analysis and risk management agents',
    website: 'https://fintech-solutions.com',
    totalAgents: 15,
    totalDownloads: 28000,
    joinedDate: '2024-01-20',
    rating: 4.7,
    avatar: '/publishers/fintech.png'
  },
  'open-agents': {
    id: 'open-agents',
    name: 'open-agents',
    displayName: 'Open Agents Community',
    type: 'individual',
    verified: false,
    description: 'Open source agent collective',
    totalAgents: 25,
    totalDownloads: 18000,
    joinedDate: '2024-03-01',
    rating: 4.4,
    avatar: '/publishers/community.png'
  },
  'security-first': {
    id: 'security-first',
    name: 'security-first',
    displayName: 'Security First Labs',
    type: 'startup',
    verified: true,
    description: 'Cybersecurity and compliance automation',
    website: 'https://securityfirst.io',
    totalAgents: 6,
    totalDownloads: 8500,
    joinedDate: '2024-02-28',
    rating: 4.6,
    avatar: '/publishers/security.png'
  }
}

// Import professional agent sets
import { PROFESSIONAL_BANKING_AGENTS, PROFESSIONAL_HEALTHCARE_AGENTS, PROFESSIONAL_LEGAL_AGENTS } from './professionalMockAgents'

// Mock Agents  
export const MOCK_AGENTS: MarketplaceAgent[] = [
  // Professional Banking Agents (from detailed industry analysis)
  ...PROFESSIONAL_BANKING_AGENTS,
  
  // Professional Healthcare Agents
  ...PROFESSIONAL_HEALTHCARE_AGENTS,
  
  // Professional Legal Agents
  ...PROFESSIONAL_LEGAL_AGENTS,
  // Healthcare Agents
  {
    id: 'hipaa-patient-summarizer',
    name: 'hipaa-patient-summarizer',
    displayName: 'HIPAA Patient Record Summarizer',
    description: 'Generates concise patient summaries from medical records while maintaining HIPAA compliance',
    longDescription: 'This agent processes complex patient medical records and generates clear, concise summaries for healthcare providers. Built with HIPAA compliance from the ground up, all processing occurs within your infrastructure with comprehensive audit logging.',
    publisher: 'healthtech-ai',
    category: 'data-processing',
    subcategory: 'Medical Records',
    
    targetIndustries: ['healthcare'],
    complianceStandards: ['HIPAA'],
    dataRequirements: ['text-only', 'documents'],
    modelRequirements: ['claude-3-5-sonnet', 'gpt-4'],
    deploymentTypes: ['on-premise', 'air-gapped'],
    
    containerImage: 'healthtech-ai/hipaa-patient-summarizer',
    version: '2.1.3',
    size: '1.2 GB',
    lastUpdated: '2024-03-15',
    
    downloads: 1250,
    rating: 4.9,
    reviewCount: 34,
    
    pricingModel: 'subscription',
    pricingDescription: '$200/month per deployment + usage fees',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'All PHI remains within your infrastructure. No external API calls.',
    
    tags: ['healthcare', 'HIPAA', 'medical-records', 'summarization'],
    featured: true,
    trending: false,
    new: false,
    
    demoAvailable: true,
    sampleInput: '{"patient_record": "Patient presents with recurring headaches..."}',
    sampleOutput: '{"summary": "45-year-old patient with 3-month history of tension headaches, likely stress-related..."}'
  },

  {
    id: 'medical-coding-assistant',
    name: 'medical-coding-assistant', 
    displayName: 'Medical Coding & Billing Assistant',
    description: 'Automates ICD-10 and CPT coding for medical procedures and diagnoses',
    longDescription: 'Advanced medical coding AI that analyzes physician notes and automatically suggests appropriate ICD-10, CPT, and HCPCS codes. Reduces coding errors, accelerates billing cycles, and ensures compliance with CMS guidelines.',
    publisher: 'healthtech-ai',
    category: 'data-processing',
    subcategory: 'Medical Coding',
    
    targetIndustries: ['healthcare'],
    complianceStandards: ['HIPAA'],
    dataRequirements: ['text-only', 'documents'],
    modelRequirements: ['gpt-4', 'claude-3-opus'],
    deploymentTypes: ['on-premise', 'cloud'],
    
    containerImage: 'healthtech-ai/medical-coder',
    version: '1.8.4',
    size: '950 MB',
    lastUpdated: '2024-03-20',
    
    downloads: 892,
    rating: 4.7,
    reviewCount: 28,
    
    pricingModel: 'usage-based',
    pricingDescription: '$2.50 per 100 codes generated',
    
    egressAllowlist: ['https://api.cms.gov'],
    requiredPorts: ['8000'],
    securityNotes: 'Integrates with CMS code databases for validation.',
    
    tags: ['healthcare', 'medical-coding', 'billing', 'ICD-10', 'CPT'],
    featured: false,
    trending: true,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'radiology-report-analyzer',
    name: 'radiology-report-analyzer',
    displayName: 'Radiology Report Analyzer', 
    description: 'AI-powered analysis of radiology reports to identify critical findings and abnormalities',
    longDescription: 'Specialized agent for analyzing radiology reports (X-rays, MRIs, CTs) to automatically flag critical findings, extract key measurements, and generate structured summaries. Helps radiologists prioritize urgent cases and improve reporting consistency.',
    publisher: 'healthtech-ai',
    category: 'analysis-insights',
    subcategory: 'Medical Imaging',
    
    targetIndustries: ['healthcare'],
    complianceStandards: ['HIPAA'],
    dataRequirements: ['text-only', 'documents', 'images'],
    modelRequirements: ['multimodal', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise', 'air-gapped'],
    
    containerImage: 'healthtech-ai/radiology-analyzer',
    version: '2.0.1',
    size: '1.8 GB',
    lastUpdated: '2024-03-18',
    
    downloads: 445,
    rating: 4.8,
    reviewCount: 15,
    
    pricingModel: 'subscription',
    pricingDescription: '$500/month per radiologist',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Processes imaging data locally with no external transmission.',
    
    tags: ['healthcare', 'radiology', 'medical-imaging', 'diagnosis'],
    featured: false,
    trending: false,
    new: true,
    
    demoAvailable: false
  },

  {
    id: 'clinical-trial-screener',
    name: 'clinical-trial-screener',
    displayName: 'Clinical Trial Patient Screener',
    description: 'Matches patients to relevant clinical trials based on medical history and eligibility criteria',
    longDescription: 'Automated clinical trial matching system that analyzes patient medical records against trial inclusion/exclusion criteria. Identifies potential participants, calculates eligibility scores, and generates referral reports for research coordinators.',
    publisher: 'healthtech-ai',
    category: 'analysis-insights',
    subcategory: 'Clinical Research',
    
    targetIndustries: ['healthcare'],
    complianceStandards: ['HIPAA', 'GDPR'],
    dataRequirements: ['text-only', 'database'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'healthtech-ai/trial-screener',
    version: '1.3.2',
    size: '750 MB',
    lastUpdated: '2024-03-12',
    
    downloads: 156,
    rating: 4.6,
    reviewCount: 8,
    
    pricingModel: 'subscription',
    pricingDescription: '$300/month per research site',
    
    egressAllowlist: ['https://clinicaltrials.gov'],
    requiredPorts: ['8000'],
    
    tags: ['healthcare', 'clinical-trials', 'research', 'patient-matching'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  // Finance Agents
  {
    id: 'financial-risk-analyzer',
    name: 'financial-risk-analyzer',
    displayName: 'Financial Risk Analyzer',
    description: 'Advanced risk assessment for investment portfolios and trading strategies',
    longDescription: 'Comprehensive risk analysis engine that evaluates investment portfolios, identifies potential risks, and provides actionable insights. Integrates with major financial data providers while maintaining strict data sovereignty.',
    publisher: 'fintech-solutions',
    category: 'analysis-insights',
    subcategory: 'Risk Management',
    
    targetIndustries: ['finance'],
    complianceStandards: ['SOX', 'PCI-DSS'],
    dataRequirements: ['api-access', 'database', 'files'],
    modelRequirements: ['gpt-4', 'claude-3-opus'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'fintech-solutions/risk-analyzer',
    version: '3.2.1',
    size: '850 MB',
    lastUpdated: '2024-03-20',
    
    downloads: 890,
    rating: 4.7,
    reviewCount: 28,
    
    pricingModel: 'usage-based',
    pricingDescription: '$0.50 per analysis + data provider costs',
    
    egressAllowlist: [
      'https://api.bloomberg.com',
      'https://api.quandl.com',
      'https://api.alphavantage.co'
    ],
    requiredPorts: ['8000'],
    
    tags: ['finance', 'risk-analysis', 'portfolio', 'trading'],
    featured: true,
    trending: true,
    new: false,
    
    demoAvailable: true
  },

  // Legal Agents
  {
    id: 'contract-risk-scanner',
    name: 'contract-risk-scanner',
    displayName: 'Legal Contract Risk Scanner',
    description: 'Identifies potential risks and issues in legal contracts before signing',
    longDescription: 'AI-powered contract analysis that identifies potential legal risks, unusual clauses, and compliance issues. Trained on thousands of contract types with expertise in corporate, employment, and vendor agreements.',
    publisher: 'fintech-solutions',
    category: 'analysis-insights',
    subcategory: 'Legal Analysis',
    
    targetIndustries: ['legal', 'any'],
    complianceStandards: ['GDPR'],
    dataRequirements: ['documents', 'text-only'],
    modelRequirements: ['claude-3-5-sonnet', 'gpt-4'],
    deploymentTypes: ['cloud', 'on-premise', 'air-gapped'],
    
    containerImage: 'fintech-solutions/contract-scanner',
    version: '1.8.0',
    size: '720 MB',
    lastUpdated: '2024-03-18',
    
    downloads: 2100,
    rating: 4.8,
    reviewCount: 67,
    
    pricingModel: 'usage-based',
    pricingDescription: '$5 per contract analysis',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'All contract data processed locally. No external transmissions.',
    
    tags: ['legal', 'contracts', 'risk-analysis', 'compliance'],
    featured: false,
    trending: true,
    new: false,
    
    demoAvailable: true
  },

  // Security Agents
  {
    id: 'security-incident-responder',
    name: 'security-incident-responder',
    displayName: 'AI Security Incident Responder',
    description: 'Automated security incident analysis and response recommendations',
    longDescription: 'Rapidly analyzes security incidents, correlates threat intelligence, and provides step-by-step response procedures. Integrates with major SIEM platforms and threat feeds while maintaining air-gapped capability.',
    publisher: 'security-first',
    category: 'security-compliance',
    subcategory: 'Incident Response',
    
    targetIndustries: ['technology', 'finance', 'government'],
    complianceStandards: ['ISO-27001', 'FedRAMP'],
    dataRequirements: ['api-access', 'text-only'],
    modelRequirements: ['gpt-4', 'claude-3-opus'],
    deploymentTypes: ['on-premise', 'air-gapped'],
    
    containerImage: 'security-first/incident-responder',
    version: '2.0.5',
    size: '950 MB',
    lastUpdated: '2024-03-22',
    
    downloads: 450,
    rating: 4.9,
    reviewCount: 15,
    
    pricingModel: 'enterprise',
    pricingDescription: 'Contact for enterprise pricing',
    
    egressAllowlist: [
      'https://api.virustotal.com',
      'https://otx.alienvault.com'
    ],
    requiredPorts: ['8000', '9200'],
    securityNotes: 'Can operate in air-gapped mode with local threat intelligence.',
    
    tags: ['security', 'incident-response', 'threat-analysis', 'SIEM'],
    featured: true,
    trending: false,
    new: true,
    
    demoAvailable: false
  },

  // Content Generation
  {
    id: 'brand-voice-copywriter',
    name: 'brand-voice-copywriter',
    displayName: 'Brand Voice Copywriter',
    description: 'Generates marketing copy that matches your specific brand voice and style',
    longDescription: 'Upload your brand guidelines and existing content to train a copywriter that perfectly matches your voice. Generates everything from social media posts to email campaigns while maintaining consistent brand personality.',
    publisher: 'open-agents',
    category: 'content-generation',
    subcategory: 'Marketing Copy',
    
    targetIndustries: ['retail', 'technology', 'any'],
    complianceStandards: ['GDPR'],
    dataRequirements: ['text-only', 'files'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'openagents/brand-voice-writer',
    version: '1.4.2',
    size: '600 MB',
    lastUpdated: '2024-03-10',
    
    downloads: 3200,
    rating: 4.5,
    reviewCount: 128,
    
    pricingModel: 'free',
    pricingDescription: 'Open source - free to use',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    
    tags: ['marketing', 'copywriting', 'branding', 'content'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true,
    sampleInput: '{"brand_guidelines": "Upload your style guide", "content_type": "social_media"}',
    sampleOutput: '{"copy": "Crafted copy that matches your brand voice..."}'
  },

  // Developer Productivity
  {
    id: 'code-review-assistant',
    name: 'code-review-assistant',
    displayName: 'AI Code Review Assistant',
    description: 'Automated code review with security, performance, and best practice analysis',
    longDescription: 'Comprehensive code review automation that checks for security vulnerabilities, performance issues, code style violations, and architectural concerns. Supports 20+ programming languages with customizable rules.',
    publisher: 'open-agents',
    category: 'integration-automation',
    subcategory: 'Development Tools',
    
    targetIndustries: ['technology', 'any'],
    complianceStandards: [],
    dataRequirements: ['files', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'openagents/code-reviewer',
    version: '2.3.1',
    size: '1.1 GB',
    lastUpdated: '2024-03-19',
    
    downloads: 5600,
    rating: 4.6,
    reviewCount: 203,
    
    pricingModel: 'free',
    pricingDescription: 'Open source with premium features available',
    
    egressAllowlist: [
      'https://api.github.com',
      'https://gitlab.com/api'
    ],
    requiredPorts: ['8000'],
    
    tags: ['development', 'code-review', 'security', 'automation'],
    featured: false,
    trending: true,
    new: false,
    
    demoAvailable: true
  },

  // Manufacturing
  {
    id: 'quality-inspector',
    name: 'quality-inspector',
    displayName: 'Manufacturing Quality Inspector',
    description: 'AI-powered visual quality control for manufacturing processes',
    longDescription: 'Computer vision-based quality control system that inspects manufactured parts for defects, dimensional accuracy, and compliance with specifications. Integrates with existing manufacturing systems.',
    publisher: 'open-agents',
    category: 'specialized',
    subcategory: 'Manufacturing',
    
    targetIndustries: ['manufacturing'],
    complianceStandards: ['ISO-27001'],
    dataRequirements: ['images', 'api-access'],
    modelRequirements: ['multimodal', 'gpt-4'],
    deploymentTypes: ['on-premise', 'air-gapped'],
    
    containerImage: 'openagents/quality-inspector',
    version: '1.2.0',
    size: '2.1 GB',
    lastUpdated: '2024-03-12',
    
    downloads: 180,
    rating: 4.3,
    reviewCount: 8,
    
    pricingModel: 'subscription',
    pricingDescription: '$500/month per production line',
    
    egressAllowlist: [],
    requiredPorts: ['8000', '8080'],
    securityNotes: 'Designed for air-gapped manufacturing environments',
    
    tags: ['manufacturing', 'quality-control', 'computer-vision', 'inspection'],
    featured: false,
    trending: false,
    new: true,
    
    demoAvailable: false
  },

  // Government/Compliance
  {
    id: 'government-form-processor',
    name: 'government-form-processor',
    displayName: 'Government Form Processor',
    description: 'Automated processing of government forms with compliance validation',
    longDescription: 'Processes various government forms including tax documents, permit applications, and regulatory filings. Validates data accuracy, flags missing information, and ensures compliance with relevant regulations.',
    publisher: 'agentsystems',
    category: 'data-processing',
    subcategory: 'Document Processing',
    
    targetIndustries: ['government'],
    complianceStandards: ['FedRAMP'],
    dataRequirements: ['documents', 'text-only', 'images'],
    modelRequirements: ['claude-3-5-sonnet', 'multimodal'],
    deploymentTypes: ['air-gapped', 'on-premise'],
    
    containerImage: 'agentsystems/gov-form-processor',
    version: '1.0.8',
    size: '1.3 GB',
    lastUpdated: '2024-03-21',
    
    downloads: 95,
    rating: 4.7,
    reviewCount: 6,
    
    pricingModel: 'enterprise',
    pricingDescription: 'Government pricing available',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'FedRAMP compliant, air-gapped deployment supported',
    
    tags: ['government', 'forms', 'compliance', 'document-processing'],
    featured: true,
    trending: false,
    new: true,
    
    demoAvailable: false
  },

  // Finance Agents (continued)
  {
    id: 'mortgage-underwriter',
    name: 'mortgage-underwriter',
    displayName: 'Mortgage Underwriting Assistant',
    description: 'Automated mortgage application analysis and risk assessment for loan officers',
    longDescription: 'AI-powered mortgage underwriting that analyzes loan applications, verifies income documentation, assesses debt-to-income ratios, and evaluates property values. Reduces processing time from days to hours while maintaining compliance with lending regulations.',
    publisher: 'fintech-solutions',
    category: 'analysis-insights',
    subcategory: 'Mortgage & Lending',
    
    targetIndustries: ['finance'],
    complianceStandards: ['SOX'],
    dataRequirements: ['documents', 'api-access', 'database'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'fintech-solutions/mortgage-underwriter',
    version: '2.4.1',
    size: '980 MB',
    lastUpdated: '2024-03-22',
    
    downloads: 672,
    rating: 4.6,
    reviewCount: 21,
    
    pricingModel: 'usage-based',
    pricingDescription: '$12 per loan application processed',
    
    egressAllowlist: ['https://api.experian.com', 'https://api.equifax.com'],
    requiredPorts: ['8000'],
    
    tags: ['finance', 'mortgage', 'underwriting', 'lending', 'risk-assessment'],
    featured: false,
    trending: true,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'fraud-detection-engine',
    name: 'fraud-detection-engine',
    displayName: 'Real-time Fraud Detection Engine',
    description: 'Advanced ML-powered fraud detection for payment processing and banking transactions',
    longDescription: 'Real-time fraud detection system that analyzes transaction patterns, device fingerprinting, behavioral biometrics, and network analysis to identify suspicious activities. Integrates with existing payment systems and provides instant risk scoring.',
    publisher: 'fintech-solutions',
    category: 'security-compliance',
    subcategory: 'Fraud Prevention',
    
    targetIndustries: ['finance'],
    complianceStandards: ['PCI-DSS', 'SOX'],
    dataRequirements: ['api-access', 'database'],
    modelRequirements: ['gpt-4', 'local-llm'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'fintech-solutions/fraud-detector',
    version: '3.1.0',
    size: '1.4 GB',
    lastUpdated: '2024-03-25',
    
    downloads: 1340,
    rating: 4.8,
    reviewCount: 45,
    
    pricingModel: 'usage-based',
    pricingDescription: '$0.05 per transaction analyzed',
    
    egressAllowlist: ['https://api.threatmetrix.com', 'https://api.sift.com'],
    requiredPorts: ['8000', '8001'],
    
    tags: ['finance', 'fraud-detection', 'security', 'payments', 'risk'],
    featured: true,
    trending: true,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'algorithmic-trading-advisor',
    name: 'algorithmic-trading-advisor',
    displayName: 'Algorithmic Trading Strategy Advisor',
    description: 'AI-powered trading strategy development and backtesting for quantitative analysts',
    longDescription: 'Sophisticated trading strategy advisor that analyzes market data, develops algorithmic trading strategies, performs comprehensive backtesting, and provides risk-adjusted performance metrics. Supports multiple asset classes and trading frequencies.',
    publisher: 'fintech-solutions',
    category: 'analysis-insights',
    subcategory: 'Trading & Investment',
    
    targetIndustries: ['finance'],
    complianceStandards: ['SOX'],
    dataRequirements: ['api-access', 'database'],
    modelRequirements: ['gpt-4', 'claude-3-opus'],
    deploymentTypes: ['cloud'],
    
    containerImage: 'fintech-solutions/trading-advisor',
    version: '1.9.3',
    size: '1.1 GB',
    lastUpdated: '2024-03-20',
    
    downloads: 298,
    rating: 4.5,
    reviewCount: 12,
    
    pricingModel: 'subscription',
    pricingDescription: '$2000/month per trading desk',
    
    egressAllowlist: ['https://api.bloomberg.com', 'https://api.refinitiv.com'],
    requiredPorts: ['8000'],
    
    tags: ['finance', 'trading', 'algorithms', 'backtesting', 'quantitative'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: false
  },

  {
    id: 'credit-scoring-engine',
    name: 'credit-scoring-engine',
    displayName: 'Alternative Credit Scoring Engine',
    description: 'AI-driven credit assessment using alternative data sources for underbanked populations',
    longDescription: 'Advanced credit scoring system that evaluates creditworthiness using alternative data sources including mobile phone usage, utility payments, social media behavior, and transaction patterns. Designed to serve underbanked populations with limited credit history.',
    publisher: 'fintech-solutions',
    category: 'analysis-insights',
    subcategory: 'Credit Assessment',
    
    targetIndustries: ['finance'],
    complianceStandards: ['SOX', 'GDPR'],
    dataRequirements: ['api-access', 'database'],
    modelRequirements: ['gpt-4', 'local-llm'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'fintech-solutions/credit-scorer',
    version: '2.2.0',
    size: '890 MB',
    lastUpdated: '2024-03-18',
    
    downloads: 445,
    rating: 4.4,
    reviewCount: 18,
    
    pricingModel: 'usage-based',
    pricingDescription: '$3 per credit assessment',
    
    egressAllowlist: ['https://api.yodlee.com', 'https://api.plaid.com'],
    requiredPorts: ['8000'],
    
    tags: ['finance', 'credit-scoring', 'alternative-data', 'underbanked'],
    featured: false,
    trending: false,
    new: true,
    
    demoAvailable: true
  },

  // Legal Agents (expanded)
  {
    id: 'legal-document-drafter',
    name: 'legal-document-drafter',
    displayName: 'AI Legal Document Drafter',
    description: 'Automated legal document generation for contracts, agreements, and legal filings',
    longDescription: 'Comprehensive legal document drafting system that generates contracts, NDAs, employment agreements, and legal filings based on client requirements. Includes clause libraries, jurisdiction-specific templates, and compliance checking.',
    publisher: 'fintech-solutions',
    category: 'content-generation',
    subcategory: 'Legal Documents',
    
    targetIndustries: ['legal', 'any'],
    complianceStandards: ['GDPR'],
    dataRequirements: ['text-only'],
    modelRequirements: ['claude-3-5-sonnet', 'gpt-4'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'fintech-solutions/legal-drafter',
    version: '1.6.2',
    size: '650 MB',
    lastUpdated: '2024-03-16',
    
    downloads: 1850,
    rating: 4.7,
    reviewCount: 89,
    
    pricingModel: 'usage-based',
    pricingDescription: '$25 per document generated',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'All legal documents processed locally with attorney-client privilege protection.',
    
    tags: ['legal', 'contracts', 'document-generation', 'compliance'],
    featured: true,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'patent-prior-art-search',
    name: 'patent-prior-art-search',
    displayName: 'Patent Prior Art Search Engine',
    description: 'Advanced AI search for patent prior art analysis and intellectual property research',
    longDescription: 'Specialized patent research agent that conducts comprehensive prior art searches across global patent databases, academic publications, and technical literature. Provides detailed analysis reports with relevance scoring and claim mapping.',
    publisher: 'open-agents',
    category: 'analysis-insights',
    subcategory: 'Intellectual Property',
    
    targetIndustries: ['legal', 'technology'],
    complianceStandards: [],
    dataRequirements: ['api-access', 'documents'],
    modelRequirements: ['gpt-4', 'claude-3-opus'],
    deploymentTypes: ['cloud'],
    
    containerImage: 'openagents/patent-search',
    version: '2.1.4',
    size: '1.3 GB',
    lastUpdated: '2024-03-14',
    
    downloads: 234,
    rating: 4.6,
    reviewCount: 13,
    
    pricingModel: 'usage-based',
    pricingDescription: '$50 per comprehensive search',
    
    egressAllowlist: ['https://api.uspto.gov', 'https://api.epo.org'],
    requiredPorts: ['8000'],
    
    tags: ['legal', 'patents', 'prior-art', 'intellectual-property', 'research'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'compliance-monitoring-assistant',
    name: 'compliance-monitoring-assistant',
    displayName: 'Regulatory Compliance Monitor',
    description: 'Automated monitoring of regulatory changes and compliance requirements across jurisdictions',
    longDescription: 'AI-powered compliance monitoring system that tracks regulatory changes, analyzes impact on business operations, and generates compliance reports. Monitors multiple jurisdictions and regulatory bodies simultaneously.',
    publisher: 'fintech-solutions',
    category: 'security-compliance',
    subcategory: 'Regulatory Monitoring',
    
    targetIndustries: ['legal', 'finance', 'healthcare'],
    complianceStandards: ['SOX', 'GDPR', 'HIPAA'],
    dataRequirements: ['api-access', 'text-only'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['cloud'],
    
    containerImage: 'fintech-solutions/compliance-monitor',
    version: '1.4.0',
    size: '720 MB',
    lastUpdated: '2024-03-21',
    
    downloads: 389,
    rating: 4.5,
    reviewCount: 16,
    
    pricingModel: 'subscription',
    pricingDescription: '$500/month per regulatory domain',
    
    egressAllowlist: ['https://api.sec.gov', 'https://api.fda.gov'],
    requiredPorts: ['8000'],
    
    tags: ['legal', 'compliance', 'regulatory', 'monitoring', 'reporting'],
    featured: false,
    trending: true,
    new: false,
    
    demoAvailable: true
  },

  // HR & Recruitment Agents
  {
    id: 'resume-screening-ai',
    name: 'resume-screening-ai',
    displayName: 'AI Resume Screening Assistant',
    description: 'Automated resume screening and candidate ranking for HR departments',
    longDescription: 'Advanced resume screening system that analyzes candidate qualifications, matches skills to job requirements, identifies red flags, and provides detailed scoring reports. Includes bias detection and fair hiring compliance features.',
    publisher: 'open-agents',
    category: 'analysis-insights',
    subcategory: 'Human Resources',
    
    targetIndustries: ['any'],
    complianceStandards: ['GDPR'],
    dataRequirements: ['documents', 'text-only'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'openagents/resume-screener',
    version: '1.7.1',
    size: '580 MB',
    lastUpdated: '2024-03-17',
    
    downloads: 2650,
    rating: 4.3,
    reviewCount: 127,
    
    pricingModel: 'usage-based',
    pricingDescription: '$2 per resume screened',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Includes bias detection algorithms for fair hiring practices.',
    
    tags: ['hr', 'recruitment', 'resume-screening', 'candidate-assessment'],
    featured: false,
    trending: true,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'employee-sentiment-analyzer',
    name: 'employee-sentiment-analyzer',
    displayName: 'Employee Sentiment Analysis Tool',
    description: 'AI-powered analysis of employee feedback, surveys, and communication for HR insights',
    longDescription: 'Comprehensive employee sentiment analysis that processes surveys, Slack messages, email communications, and feedback forms to identify satisfaction trends, predict turnover risk, and highlight areas for improvement.',
    publisher: 'open-agents',
    category: 'analysis-insights',
    subcategory: 'Employee Analytics',
    
    targetIndustries: ['any'],
    complianceStandards: ['GDPR'],
    dataRequirements: ['text-only', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'openagents/sentiment-analyzer',
    version: '2.0.3',
    size: '670 MB',
    lastUpdated: '2024-03-19',
    
    downloads: 834,
    rating: 4.4,
    reviewCount: 31,
    
    pricingModel: 'subscription',
    pricingDescription: '$100/month per 100 employees',
    
    egressAllowlist: ['https://api.slack.com'],
    requiredPorts: ['8000'],
    
    tags: ['hr', 'employee-satisfaction', 'sentiment-analysis', 'retention'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  // Security & DevOps Agents
  {
    id: 'vulnerability-scanner-ai',
    name: 'vulnerability-scanner-ai',
    displayName: 'AI-Enhanced Vulnerability Scanner',
    description: 'Advanced vulnerability detection with AI-powered threat analysis and prioritization',
    longDescription: 'Next-generation vulnerability scanner that combines traditional scanning techniques with AI analysis to identify, prioritize, and provide remediation guidance for security vulnerabilities across infrastructure, applications, and containers.',
    publisher: 'security-first',
    category: 'security-compliance',
    subcategory: 'Vulnerability Management',
    
    targetIndustries: ['technology', 'finance', 'healthcare'],
    complianceStandards: ['ISO-27001'],
    dataRequirements: ['api-access'],
    modelRequirements: ['gpt-4', 'local-llm'],
    deploymentTypes: ['on-premise', 'air-gapped'],
    
    containerImage: 'security-first/vuln-scanner',
    version: '3.2.1',
    size: '1.6 GB',
    lastUpdated: '2024-03-23',
    
    downloads: 567,
    rating: 4.7,
    reviewCount: 22,
    
    pricingModel: 'subscription',
    pricingDescription: '$200/month per 1000 assets',
    
    egressAllowlist: ['https://nvd.nist.gov'],
    requiredPorts: ['8000', '8443'],
    
    tags: ['security', 'vulnerability-scanning', 'threat-analysis', 'devops'],
    featured: true,
    trending: true,
    new: false,
    
    demoAvailable: false
  },

  {
    id: 'log-analysis-engine',
    name: 'log-analysis-engine',
    displayName: 'AI Security Log Analyzer',
    description: 'Intelligent log analysis for security event detection and incident investigation',
    longDescription: 'Advanced log analysis engine that processes security logs from multiple sources, identifies patterns indicative of security threats, correlates events across systems, and provides detailed investigation reports with threat attribution.',
    publisher: 'security-first',
    category: 'security-compliance',
    subcategory: 'Security Analytics',
    
    targetIndustries: ['technology', 'finance'],
    complianceStandards: ['ISO-27001'],
    dataRequirements: ['text-only', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-opus'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'security-first/log-analyzer',
    version: '2.5.0',
    size: '1.2 GB',
    lastUpdated: '2024-03-20',
    
    downloads: 423,
    rating: 4.6,
    reviewCount: 18,
    
    pricingModel: 'usage-based',
    pricingDescription: '$0.10 per GB of logs analyzed',
    
    egressAllowlist: ['https://api.virustotal.com'],
    requiredPorts: ['8000', '9200'],
    
    tags: ['security', 'log-analysis', 'siem', 'threat-detection'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'infrastructure-monitoring-ai',
    name: 'infrastructure-monitoring-ai',
    displayName: 'AI Infrastructure Monitor',
    description: 'Intelligent infrastructure monitoring with predictive failure analysis',
    longDescription: 'AI-powered infrastructure monitoring that tracks system performance, predicts hardware failures, optimizes resource allocation, and provides automated remediation suggestions. Supports cloud and on-premise environments.',
    publisher: 'open-agents',
    category: 'integration-automation',
    subcategory: 'Infrastructure Management',
    
    targetIndustries: ['technology'],
    complianceStandards: [],
    dataRequirements: ['api-access'],
    modelRequirements: ['gpt-4', 'local-llm'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'openagents/infra-monitor',
    version: '1.8.2',
    size: '950 MB',
    lastUpdated: '2024-03-15',
    
    downloads: 1240,
    rating: 4.2,
    reviewCount: 56,
    
    pricingModel: 'subscription',
    pricingDescription: '$50/month per 100 monitored hosts',
    
    egressAllowlist: ['https://api.prometheus.io'],
    requiredPorts: ['8000', '9090'],
    
    tags: ['devops', 'monitoring', 'infrastructure', 'predictive-analysis'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  // Marketing & Sales Agents
  {
    id: 'social-media-manager',
    name: 'social-media-manager',
    displayName: 'AI Social Media Manager',
    description: 'Automated social media content creation, scheduling, and engagement management',
    longDescription: 'Comprehensive social media management platform that creates brand-consistent content, schedules posts across multiple platforms, engages with followers, and analyzes performance metrics. Includes crisis management and brand protection features.',
    publisher: 'open-agents',
    category: 'content-generation',
    subcategory: 'Social Media Marketing',
    
    targetIndustries: ['retail', 'any'],
    complianceStandards: ['GDPR'],
    dataRequirements: ['text-only', 'api-access', 'images'],
    modelRequirements: ['gpt-4', 'multimodal'],
    deploymentTypes: ['cloud'],
    
    containerImage: 'openagents/social-manager',
    version: '2.3.1',
    size: '780 MB',
    lastUpdated: '2024-03-22',
    
    downloads: 3200,
    rating: 4.1,
    reviewCount: 198,
    
    pricingModel: 'subscription',
    pricingDescription: '$99/month per brand + platform fees',
    
    egressAllowlist: ['https://api.twitter.com', 'https://graph.facebook.com'],
    requiredPorts: ['8000'],
    
    tags: ['marketing', 'social-media', 'content-creation', 'automation'],
    featured: false,
    trending: true,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'email-campaign-optimizer',
    name: 'email-campaign-optimizer',
    displayName: 'Email Campaign Optimization AI',
    description: 'AI-powered email marketing optimization with A/B testing and personalization',
    longDescription: 'Advanced email marketing platform that optimizes subject lines, content, send times, and segmentation strategies. Includes predictive analytics for open rates, click-through rates, and conversion optimization.',
    publisher: 'open-agents',
    category: 'analysis-insights',
    subcategory: 'Email Marketing',
    
    targetIndustries: ['retail', 'technology', 'any'],
    complianceStandards: ['GDPR'],
    dataRequirements: ['text-only', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['cloud'],
    
    containerImage: 'openagents/email-optimizer',
    version: '1.9.0',
    size: '620 MB',
    lastUpdated: '2024-03-18',
    
    downloads: 1560,
    rating: 4.3,
    reviewCount: 78,
    
    pricingModel: 'usage-based',
    pricingDescription: '$0.50 per 1000 emails optimized',
    
    egressAllowlist: ['https://api.sendgrid.com', 'https://api.mailchimp.com'],
    requiredPorts: ['8000'],
    
    tags: ['marketing', 'email-marketing', 'optimization', 'personalization'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  // Education & Training Agents
  {
    id: 'personalized-tutor-ai',
    name: 'personalized-tutor-ai',
    displayName: 'Personalized Learning Tutor',
    description: 'AI-powered personalized tutoring system for K-12 and higher education',
    longDescription: 'Adaptive learning platform that provides personalized tutoring across multiple subjects, identifies learning gaps, adapts to individual learning styles, and provides progress tracking for students, parents, and educators.',
    publisher: 'open-agents',
    category: 'specialized',
    subcategory: 'Education Technology',
    
    targetIndustries: ['education'],
    complianceStandards: ['GDPR'],
    dataRequirements: ['text-only', 'images'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'openagents/tutor-ai',
    version: '1.5.3',
    size: '890 MB',
    lastUpdated: '2024-03-16',
    
    downloads: 678,
    rating: 4.5,
    reviewCount: 34,
    
    pricingModel: 'subscription',
    pricingDescription: '$15/month per student',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    
    tags: ['education', 'personalized-learning', 'tutoring', 'adaptive-learning'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  // Manufacturing & Industrial Agents
  {
    id: 'predictive-maintenance-ai',
    name: 'predictive-maintenance-ai',
    displayName: 'Predictive Maintenance System',
    description: 'AI-powered predictive maintenance for industrial equipment and machinery',
    longDescription: 'Advanced predictive maintenance system that analyzes sensor data, vibration patterns, temperature readings, and operational metrics to predict equipment failures before they occur. Reduces downtime and maintenance costs.',
    publisher: 'open-agents',
    category: 'specialized',
    subcategory: 'Industrial IoT',
    
    targetIndustries: ['manufacturing'],
    complianceStandards: ['ISO-27001'],
    dataRequirements: ['api-access'],
    modelRequirements: ['gpt-4', 'local-llm'],
    deploymentTypes: ['on-premise', 'air-gapped'],
    
    containerImage: 'openagents/predictive-maintenance',
    version: '2.1.2',
    size: '1.1 GB',
    lastUpdated: '2024-03-14',
    
    downloads: 289,
    rating: 4.6,
    reviewCount: 12,
    
    pricingModel: 'subscription',
    pricingDescription: '$300/month per production line',
    
    egressAllowlist: [],
    requiredPorts: ['8000', '1883'],
    
    tags: ['manufacturing', 'predictive-maintenance', 'iot', 'industrial'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: false
  },

  {
    id: 'supply-chain-optimizer',
    name: 'supply-chain-optimizer',
    displayName: 'Supply Chain Optimization AI',
    description: 'AI-driven supply chain optimization and demand forecasting for manufacturing',
    longDescription: 'Comprehensive supply chain optimization platform that analyzes demand patterns, optimizes inventory levels, identifies bottlenecks, and provides real-time recommendations for procurement and logistics decisions.',
    publisher: 'open-agents',
    category: 'analysis-insights',
    subcategory: 'Supply Chain Management',
    
    targetIndustries: ['manufacturing', 'retail'],
    complianceStandards: [],
    dataRequirements: ['api-access', 'database'],
    modelRequirements: ['gpt-4', 'claude-3-opus'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'openagents/supply-optimizer',
    version: '1.7.4',
    size: '940 MB',
    lastUpdated: '2024-03-21',
    
    downloads: 445,
    rating: 4.4,
    reviewCount: 19,
    
    pricingModel: 'subscription',
    pricingDescription: '$500/month + $0.10 per SKU managed',
    
    egressAllowlist: ['https://api.ups.com', 'https://api.fedex.com'],
    requiredPorts: ['8000'],
    
    tags: ['manufacturing', 'supply-chain', 'optimization', 'forecasting'],
    featured: false,
    trending: true,
    new: false,
    
    demoAvailable: true
  },

  // Government & Public Sector Agents
  {
    id: 'citizen-service-chatbot',
    name: 'citizen-service-chatbot',
    displayName: 'Citizen Services Chatbot',
    description: 'AI-powered chatbot for government citizen services and information requests',
    longDescription: 'Multilingual chatbot designed for government agencies to handle citizen inquiries, provide information about services, guide users through processes, and escalate complex issues to human agents. Includes accessibility features and multi-channel support.',
    publisher: 'agentsystems',
    category: 'integration-automation',
    subcategory: 'Citizen Services',
    
    targetIndustries: ['government'],
    complianceStandards: ['FedRAMP'],
    dataRequirements: ['text-only'],
    modelRequirements: ['claude-3-5-sonnet'],
    deploymentTypes: ['on-premise', 'air-gapped'],
    
    containerImage: 'agentsystems/citizen-chatbot',
    version: '1.2.1',
    size: '680 MB',
    lastUpdated: '2024-03-19',
    
    downloads: 127,
    rating: 4.3,
    reviewCount: 7,
    
    pricingModel: 'enterprise',
    pricingDescription: 'Contact for government pricing',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Designed for air-gapped government environments.',
    
    tags: ['government', 'citizen-services', 'chatbot', 'multilingual'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  }
]

// Category definitions
export const MARKETPLACE_CATEGORIES = {
  'data-processing': {
    name: 'Data Processing',
    description: 'ETL, transformation, validation, and data pipeline automation',
    icon: 'database'
  },
  'content-generation': {
    name: 'Content Generation', 
    description: 'Writing, marketing, creative content, and documentation',
    icon: 'pencil-square'
  },
  'analysis-insights': {
    name: 'Analysis & Insights',
    description: 'Financial, research, reporting, and business intelligence',
    icon: 'chart-bar'
  },
  'security-compliance': {
    name: 'Security & Compliance',
    description: 'Audit, monitoring, incident response, and compliance automation',
    icon: 'shield-check'
  },
  'integration-automation': {
    name: 'Integration & Automation',
    description: 'Workflow automation, API integration, and process optimization', 
    icon: 'cog-6-tooth'
  },
  'specialized': {
    name: 'Specialized',
    description: 'Industry-specific and domain-specialized agents',
    icon: 'academic-cap'
  }
} as const

// Utility functions
export function getAgentsByCategory(category: AgentCategory): MarketplaceAgent[] {
  return MOCK_AGENTS.filter(agent => agent.category === category)
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
    agent.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

export function getAgent(id: string): MarketplaceAgent | undefined {
  return MOCK_AGENTS.find(agent => agent.id === id)
}

export function getPublisher(id: string): MarketplacePublisher | undefined {
  return MOCK_PUBLISHERS[id]
}