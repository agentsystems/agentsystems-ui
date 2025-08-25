/**
 * Professional Mock Marketplace Data
 * 
 * High-quality agent specifications based on detailed industry analysis.
 * Each agent represents a specific job function with clear business value.
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
    totalAgents: 8,
    totalDownloads: 25000,
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
    description: 'Banking and financial services automation specialists',
    website: 'https://fintech-solutions.com',
    totalAgents: 24,
    totalDownloads: 15000,
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
    description: 'HIPAA-compliant healthcare AI solutions',
    website: 'https://healthtech-ai.com',
    totalAgents: 12,
    totalDownloads: 8000,
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
    description: 'Cybersecurity and compliance automation specialists',
    website: 'https://securityfirst.io',
    totalAgents: 8,
    totalDownloads: 6500,
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
    description: 'Open source agent collective',
    totalAgents: 18,
    totalDownloads: 12000,
    joinedDate: '2024-03-01',
    rating: 4.4,
    avatar: '/publishers/community.png'
  }
}

// Professional Banking Agents (44 detailed workflows)
export const MOCK_AGENTS: MarketplaceAgent[] = [
  // Banking: Regulatory Compliance Agents
  {
    id: 'marketing-compliance-reviewer',
    name: 'marketing-compliance-reviewer',
    displayName: 'Marketing Compliance Review Agent',
    description: 'Reviews marketing materials for UDAAP, Regulation DD, and Truth in Lending compliance',
    longDescription: 'Reviews marketing materials, promotions, and advertisements for compliance with federal regulations including UDAAP, Regulation DD (Truth in Savings), Regulation Z (Truth in Lending), and bank-specific policies. Identifies potential compliance issues, misleading statements, missing disclosures, or other regulatory concerns before materials are published.',
    publisher: 'fintech-solutions',
    category: 'security-compliance',
    subcategory: 'Marketing Compliance',
    
    targetIndustries: ['finance'],
    complianceStandards: ['UDAAP', 'Regulation DD', 'Regulation Z'],
    dataRequirements: ['documents', 'text-only'],
    modelRequirements: ['claude-3-5-sonnet', 'gpt-4'],
    deploymentTypes: ['on-premise', 'cloud'],
    
    containerImage: 'fintech-solutions/marketing-compliance',
    version: '2.1.4',
    size: '850 MB',
    lastUpdated: '2024-03-25',
    
    downloads: 1240,
    rating: 4.8,
    reviewCount: 67,
    
    pricingModel: 'subscription',
    pricingDescription: '$300/month per compliance reviewer',
    
    egressAllowlist: ['https://api.cfpb.gov', 'https://www.federalregister.gov'],
    requiredPorts: ['8000'],
    securityNotes: 'Processes marketing materials locally with regulatory database integration.',
    
    tags: ['banking', 'marketing-compliance', 'UDAAP', 'regulation-dd', 'truth-in-lending'],
    featured: true,
    trending: true,
    new: false,
    
    demoAvailable: true,
    sampleInput: '{"marketing_material": "Special CD Offer - 5.5% APY for 12 months!", "material_type": "advertisement"}',
    sampleOutput: '{"compliance_score": 85, "issues": ["Missing FDIC insurance disclosure"], "recommendations": ["Add standard FDIC language"]}'
  },

  {
    id: 'regulation-dd-disclosure-validator',
    name: 'regulation-dd-disclosure-validator',
    displayName: 'Regulation DD Disclosure Validator',
    description: 'Validates deposit account disclosures for Truth in Savings Act compliance',
    longDescription: 'Validates deposit account disclosures for compliance with Regulation DD (Truth in Savings Act) requirements. Ensures all required elements are present, fees are accurately disclosed, APY calculations are correct, and advertising claims are properly supported.',
    publisher: 'fintech-solutions',
    category: 'security-compliance',
    subcategory: 'Deposit Compliance',
    
    targetIndustries: ['finance'],
    complianceStandards: ['Regulation DD', 'Truth in Savings'],
    dataRequirements: ['documents', 'text-only'],
    modelRequirements: ['claude-3-5-sonnet', 'gpt-4'],
    deploymentTypes: ['on-premise', 'cloud'],
    
    containerImage: 'fintech-solutions/reg-dd-validator',
    version: '1.8.2',
    size: '720 MB',
    lastUpdated: '2024-03-22',
    
    downloads: 892,
    rating: 4.9,
    reviewCount: 34,
    
    pricingModel: 'usage-based',
    pricingDescription: '$15 per disclosure review',
    
    egressAllowlist: ['https://api.cfpb.gov'],
    requiredPorts: ['8000'],
    securityNotes: 'All product disclosures processed locally with regulatory validation.',
    
    tags: ['banking', 'regulation-dd', 'truth-in-savings', 'deposit-compliance', 'apy-validation'],
    featured: false,
    trending: false,
    new: true,
    
    demoAvailable: true
  },

  {
    id: 'udaap-marketing-scanner',
    name: 'udaap-marketing-scanner',
    displayName: 'UDAAP Marketing Materials Scanner',
    description: 'Screens marketing materials for Unfair, Deceptive, or Abusive Acts or Practices',
    longDescription: 'Screens marketing materials, customer communications, and product descriptions for potential Unfair, Deceptive, or Abusive Acts or Practices (UDAAP) issues. Analyzes language for misleading statements, hidden terms, unreasonable practices, and other elements that could trigger regulatory concerns.',
    publisher: 'fintech-solutions',
    category: 'security-compliance',
    subcategory: 'UDAAP Compliance',
    
    targetIndustries: ['finance'],
    complianceStandards: ['UDAAP', 'Consumer Protection'],
    dataRequirements: ['documents', 'text-only'],
    modelRequirements: ['claude-3-5-sonnet', 'gpt-4'],
    deploymentTypes: ['on-premise', 'cloud'],
    
    containerImage: 'fintech-solutions/udaap-scanner',
    version: '2.0.1',
    size: '950 MB',
    lastUpdated: '2024-03-20',
    
    downloads: 567,
    rating: 4.7,
    reviewCount: 28,
    
    pricingModel: 'subscription',
    pricingDescription: '$250/month per marketing team',
    
    egressAllowlist: ['https://api.cfpb.gov'],
    requiredPorts: ['8000'],
    securityNotes: 'Analyzes marketing content with enforcement action database.',
    
    tags: ['banking', 'udaap', 'marketing-compliance', 'consumer-protection', 'enforcement'],
    featured: true,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'hmda-cra-data-validator',
    name: 'hmda-cra-data-validator',
    displayName: 'HMDA/CRA Data Validation Agent',
    description: 'Validates Home Mortgage Disclosure Act and Community Reinvestment Act data accuracy',
    longDescription: 'Validates Home Mortgage Disclosure Act (HMDA) and Community Reinvestment Act (CRA) data for accuracy, completeness, and regulatory compliance prior to submission. Identifies data integrity issues, inconsistencies, and potential reporting errors that could trigger regulatory scrutiny.',
    publisher: 'fintech-solutions',
    category: 'data-processing',
    subcategory: 'Regulatory Reporting',
    
    targetIndustries: ['finance'],
    complianceStandards: ['HMDA', 'CRA', 'Fair Lending'],
    dataRequirements: ['database', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'fintech-solutions/hmda-cra-validator',
    version: '2.3.0',
    size: '1.2 GB',
    lastUpdated: '2024-03-21',
    
    downloads: 287,
    rating: 4.9,
    reviewCount: 12,
    
    pricingModel: 'subscription',
    pricingDescription: '$600/month per reporting specialist',
    
    egressAllowlist: ['https://api.census.gov'],
    requiredPorts: ['8000'],
    securityNotes: 'Processes lending data locally with secure geocoding integration.',
    
    tags: ['banking', 'hmda', 'cra', 'fair-lending', 'regulatory-reporting'],
    featured: true,
    trending: false,
    new: false,
    
    demoAvailable: false
  },

  {
    id: 'fair-lending-analyzer',
    name: 'fair-lending-analyzer',
    displayName: 'Fair Lending Analysis Agent',
    description: 'Statistical analysis of lending patterns to identify potential fair lending concerns',
    longDescription: 'Conducts statistical analysis of lending patterns to identify potential fair lending concerns, including disparate treatment or disparate impact. Analyzes underwriting decisions, pricing, terms, and servicing actions across demographic groups to detect potential discrimination.',
    publisher: 'fintech-solutions',
    category: 'analysis-insights',
    subcategory: 'Fair Lending',
    
    targetIndustries: ['finance'],
    complianceStandards: ['Fair Housing Act', 'ECOA', 'Fair Lending'],
    dataRequirements: ['database'],
    modelRequirements: ['gpt-4', 'claude-3-opus'],
    deploymentTypes: ['on-premise', 'air-gapped'],
    
    containerImage: 'fintech-solutions/fair-lending-analyzer',
    version: '2.0.3',
    size: '1.0 GB',
    lastUpdated: '2024-03-24',
    
    downloads: 234,
    rating: 4.8,
    reviewCount: 11,
    
    pricingModel: 'subscription',
    pricingDescription: '$800/month per fair lending analyst',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Demographic analysis performed locally with no external data access.',
    
    tags: ['banking', 'fair-lending', 'statistical-analysis', 'disparate-impact', 'compliance'],
    featured: true,
    trending: false,
    new: false,
    
    demoAvailable: false
  },

  // Banking: Risk Management & Security Agents
  {
    id: 'vendor-due-diligence-assessor',
    name: 'vendor-due-diligence-assessor',
    displayName: 'Vendor Due Diligence Assessment Agent',
    description: 'Comprehensive third-party vendor risk assessments and due diligence automation',
    longDescription: 'Conducts initial and ongoing due diligence assessments of third-party vendors based on regulatory requirements and bank-specific risk criteria. Analyzes vendor questionnaire responses, financial stability indicators, and control environment information to generate risk ratings.',
    publisher: 'security-first',
    category: 'security-compliance',
    subcategory: 'Vendor Risk Management',
    
    targetIndustries: ['finance'],
    complianceStandards: ['OCC Guidance', 'Third-Party Risk Management'],
    dataRequirements: ['documents', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise', 'cloud'],
    
    containerImage: 'security-first/vendor-due-diligence',
    version: '1.9.1',
    size: '780 MB',
    lastUpdated: '2024-03-23',
    
    downloads: 456,
    rating: 4.6,
    reviewCount: 22,
    
    pricingModel: 'usage-based',
    pricingDescription: '$75 per vendor assessment',
    
    egressAllowlist: ['https://api.dnb.com', 'https://api.experian.com'],
    requiredPorts: ['8000'],
    securityNotes: 'Integrates with vendor databases for financial stability assessment.',
    
    tags: ['banking', 'vendor-risk', 'due-diligence', 'third-party-management', 'compliance'],
    featured: false,
    trending: true,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'wire-transfer-risk-assessor',
    name: 'wire-transfer-risk-assessor',
    displayName: 'Wire Transfer Risk Assessment Agent',
    description: 'Real-time fraud and AML risk assessment for wire transfers',
    longDescription: 'Evaluates wire transfers in real-time for fraud, money laundering, and sanctions risks before processing. Analyzes transaction details, customer profiles, and recipient information against known risk patterns and watch lists. Applies risk-based models to identify suspicious transactions.',
    publisher: 'security-first',
    category: 'security-compliance',
    subcategory: 'Payment Security',
    
    targetIndustries: ['finance'],
    complianceStandards: ['BSA', 'AML', 'OFAC Sanctions'],
    dataRequirements: ['database', 'api-access'],
    modelRequirements: ['gpt-4', 'local-llm'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'security-first/wire-risk-assessor',
    version: '3.0.2',
    size: '1.4 GB',
    lastUpdated: '2024-03-25',
    
    downloads: 678,
    rating: 4.9,
    reviewCount: 45,
    
    pricingModel: 'usage-based',
    pricingDescription: '$2.50 per wire transfer analyzed',
    
    egressAllowlist: ['https://api.ofac.treasury.gov'],
    requiredPorts: ['8000', '8443'],
    securityNotes: 'Real-time sanctions screening with encrypted watchlist integration.',
    
    tags: ['banking', 'wire-transfers', 'aml', 'sanctions-screening', 'fraud-detection'],
    featured: true,
    trending: true,
    new: false,
    
    demoAvailable: false
  },

  {
    id: 'account-opening-fraud-detector',
    name: 'account-opening-fraud-detector',
    displayName: 'Account Opening Fraud Detection Agent',
    description: 'AI-powered fraud detection for new account applications with identity verification',
    longDescription: 'Analyzes new account applications in real-time to identify potential fraud risk. Examines application data, identity documents, and device information for suspicious patterns or inconsistencies. Compares application information against known fraud indicators and provides risk scores.',
    publisher: 'security-first',
    category: 'security-compliance',
    subcategory: 'Identity Fraud Prevention',
    
    targetIndustries: ['finance'],
    complianceStandards: ['KYC', 'CIP', 'Identity Verification'],
    dataRequirements: ['documents', 'images', 'api-access'],
    modelRequirements: ['multimodal', 'gpt-4'],
    deploymentTypes: ['on-premise', 'cloud'],
    
    containerImage: 'security-first/account-fraud-detector',
    version: '2.4.1',
    size: '1.6 GB',
    lastUpdated: '2024-03-24',
    
    downloads: 834,
    rating: 4.5,
    reviewCount: 38,
    
    pricingModel: 'usage-based',
    pricingDescription: '$3 per application screened',
    
    egressAllowlist: ['https://api.lexisnexis.com', 'https://api.idology.com'],
    requiredPorts: ['8000'],
    securityNotes: 'Identity verification with fraud database integration.',
    
    tags: ['banking', 'account-opening', 'fraud-detection', 'identity-verification', 'kyc'],
    featured: true,
    trending: true,
    new: false,
    
    demoAvailable: true
  },

  // Banking: BSA/AML Compliance Agents
  {
    id: 'sar-drafting-agent',
    name: 'sar-drafting-agent',
    displayName: 'Suspicious Activity Report Drafting Agent',
    description: 'Creates FinCEN-compliant SAR narratives from suspicious activity alerts',
    longDescription: 'Analyzes suspicious activity alerts and creates initial draft SAR narratives that follow FinCEN requirements and best practices. Compiles relevant transaction data, customer information, and supporting documentation to substantiate the suspicious activity.',
    publisher: 'security-first',
    category: 'security-compliance',
    subcategory: 'AML Reporting',
    
    targetIndustries: ['finance'],
    complianceStandards: ['BSA', 'FinCEN SAR Requirements'],
    dataRequirements: ['database', 'text-only'],
    modelRequirements: ['claude-3-5-sonnet', 'gpt-4'],
    deploymentTypes: ['on-premise', 'air-gapped'],
    
    containerImage: 'security-first/sar-drafter',
    version: '2.5.3',
    size: '1.1 GB',
    lastUpdated: '2024-03-22',
    
    downloads: 445,
    rating: 4.8,
    reviewCount: 27,
    
    pricingModel: 'subscription',
    pricingDescription: '$800/month per BSA analyst',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Processes suspicious activity data locally with no external access.',
    
    tags: ['banking', 'sar', 'suspicious-activity', 'fincen', 'aml-reporting'],
    featured: true,
    trending: false,
    new: false,
    
    demoAvailable: false
  },

  {
    id: 'bsa-customer-risk-reclassifier',
    name: 'bsa-customer-risk-reclassifier',
    displayName: 'BSA Customer Risk Reclassification Agent',
    description: 'Continuously evaluates and updates customer BSA/AML risk classifications',
    longDescription: 'Continuously evaluates customer risk profiles based on transaction behavior, customer information changes, and external risk factors. Applies Bank Secrecy Act risk models to identify customers whose risk level has changed, requiring adjustment to their risk classification.',
    publisher: 'security-first',
    category: 'security-compliance',
    subcategory: 'Customer Risk Management',
    
    targetIndustries: ['finance'],
    complianceStandards: ['BSA', 'Customer Due Diligence'],
    dataRequirements: ['database', 'api-access'],
    modelRequirements: ['gpt-4', 'local-llm'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'security-first/bsa-risk-classifier',
    version: '1.7.2',
    size: '1.0 GB',
    lastUpdated: '2024-03-20',
    
    downloads: 378,
    rating: 4.6,
    reviewCount: 18,
    
    pricingModel: 'subscription',
    pricingDescription: '$300/month per 10,000 customers monitored',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Customer risk analysis performed locally with encrypted data processing.',
    
    tags: ['banking', 'bsa', 'customer-risk', 'aml', 'risk-classification'],
    featured: false,
    trending: true,
    new: false,
    
    demoAvailable: true
  },

  // Banking: Lending and Credit Administration
  {
    id: 'loan-document-verifier',
    name: 'loan-document-verifier',
    displayName: 'Loan Document Verification Agent',
    description: 'Validates loan application documents for authenticity and consistency',
    longDescription: 'Validates loan application documents for authenticity, completeness, and consistency. Compares information across multiple documents to identify discrepancies in income, employment, asset, and identification details. Verifies document authenticity through forensic analysis.',
    publisher: 'fintech-solutions',
    category: 'data-processing',
    subcategory: 'Document Verification',
    
    targetIndustries: ['finance'],
    complianceStandards: ['Lending Regulations', 'Documentation Standards'],
    dataRequirements: ['documents', 'images', 'api-access'],
    modelRequirements: ['multimodal', 'gpt-4'],
    deploymentTypes: ['on-premise', 'cloud'],
    
    containerImage: 'fintech-solutions/loan-doc-verifier',
    version: '2.8.1',
    size: '1.3 GB',
    lastUpdated: '2024-03-23',
    
    downloads: 1120,
    rating: 4.7,
    reviewCount: 56,
    
    pricingModel: 'usage-based',
    pricingDescription: '$8 per loan application processed',
    
    egressAllowlist: ['https://api.workday.com', 'https://theworknumber.com'],
    requiredPorts: ['8000'],
    securityNotes: 'Document verification with encrypted employment/income validation.',
    
    tags: ['banking', 'loan-verification', 'document-authentication', 'fraud-prevention', 'underwriting'],
    featured: false,
    trending: true,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'covenant-monitoring-agent',
    name: 'covenant-monitoring-agent',
    displayName: 'Commercial Loan Covenant Monitor',
    description: 'Tracks commercial loan covenant compliance with automated financial analysis',
    longDescription: 'Tracks commercial loan covenants to ensure borrower compliance with financial and operational requirements. Extracts covenant terms from loan agreements, calculates financial metrics from borrower statements, and compares results against covenant thresholds.',
    publisher: 'fintech-solutions',
    category: 'analysis-insights',
    subcategory: 'Credit Monitoring',
    
    targetIndustries: ['finance'],
    complianceStandards: ['Lending Regulations', 'Credit Risk Management'],
    dataRequirements: ['documents', 'database'],
    modelRequirements: ['gpt-4', 'claude-3-opus'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'fintech-solutions/covenant-monitor',
    version: '1.5.4',
    size: '890 MB',
    lastUpdated: '2024-03-19',
    
    downloads: 289,
    rating: 4.8,
    reviewCount: 16,
    
    pricingModel: 'subscription',
    pricingDescription: '$200/month per portfolio manager',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Borrower financial data processed locally with no external access.',
    
    tags: ['banking', 'covenant-monitoring', 'commercial-lending', 'credit-risk', 'financial-analysis'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'borrower-financial-analyzer',
    name: 'borrower-financial-analyzer',
    displayName: 'Borrower Financial Statement Analyzer',
    description: 'Comprehensive analysis of borrower financial statements with industry benchmarking',
    longDescription: 'Analyzes borrower financial statements to identify trends, risks, and changes in financial condition. Calculates key financial ratios, compares performance against industry benchmarks, and identifies significant year-over-year changes requiring attention.',
    publisher: 'fintech-solutions',
    category: 'analysis-insights',
    subcategory: 'Credit Analysis',
    
    targetIndustries: ['finance'],
    complianceStandards: ['Credit Risk Management', 'GAAP'],
    dataRequirements: ['documents', 'database'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise', 'cloud'],
    
    containerImage: 'fintech-solutions/financial-analyzer',
    version: '2.6.0',
    size: '1.0 GB',
    lastUpdated: '2024-03-21',
    
    downloads: 567,
    rating: 4.6,
    reviewCount: 29,
    
    pricingModel: 'usage-based',
    pricingDescription: '$25 per financial statement analysis',
    
    egressAllowlist: ['https://api.riskmgmtassoc.com'],
    requiredPorts: ['8000'],
    securityNotes: 'Financial analysis with encrypted industry benchmark integration.',
    
    tags: ['banking', 'financial-analysis', 'credit-risk', 'ratio-analysis', 'benchmarking'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  // Healthcare: Clinical and Administrative Agents
  {
    id: 'clinical-decision-support',
    name: 'clinical-decision-support',
    displayName: 'Clinical Decision Support Agent',
    description: 'Evidence-based clinical decision support for diagnostic and treatment recommendations',
    longDescription: 'Provides evidence-based clinical decision support by analyzing patient symptoms, medical history, and diagnostic test results against current medical literature and guidelines. Offers differential diagnosis suggestions and treatment recommendations while maintaining physician oversight.',
    publisher: 'healthtech-ai',
    category: 'analysis-insights',
    subcategory: 'Clinical Decision Support',
    
    targetIndustries: ['healthcare'],
    complianceStandards: ['HIPAA', 'FDA Medical Device'],
    dataRequirements: ['text-only', 'documents'],
    modelRequirements: ['claude-3-5-sonnet', 'gpt-4'],
    deploymentTypes: ['on-premise', 'air-gapped'],
    
    containerImage: 'healthtech-ai/clinical-decision-support',
    version: '3.1.2',
    size: '2.1 GB',
    lastUpdated: '2024-03-24',
    
    downloads: 445,
    rating: 4.9,
    reviewCount: 23,
    
    pricingModel: 'subscription',
    pricingDescription: '$400/month per clinician',
    
    egressAllowlist: ['https://api.nih.gov', 'https://api.uptodate.com'],
    requiredPorts: ['8000'],
    securityNotes: 'PHI processed locally with evidence-based medical database integration.',
    
    tags: ['healthcare', 'clinical-decision-support', 'diagnosis', 'treatment-recommendations', 'evidence-based'],
    featured: true,
    trending: true,
    new: false,
    
    demoAvailable: false
  },

  {
    id: 'medical-coding-quality-assurance',
    name: 'medical-coding-quality-assurance',
    displayName: 'Medical Coding Quality Assurance Agent',
    description: 'Automated quality assurance for ICD-10, CPT, and DRG coding accuracy',
    longDescription: 'Performs comprehensive quality assurance on medical coding assignments including ICD-10 diagnosis codes, CPT procedure codes, and DRG assignments. Identifies coding errors, missed diagnoses, upcoding/downcoding issues, and ensures compliance with CMS coding guidelines.',
    publisher: 'healthtech-ai',
    category: 'security-compliance',
    subcategory: 'Medical Coding QA',
    
    targetIndustries: ['healthcare'],
    complianceStandards: ['HIPAA', 'CMS Coding Guidelines'],
    dataRequirements: ['text-only', 'documents'],
    modelRequirements: ['gpt-4', 'claude-3-opus'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'healthtech-ai/coding-qa',
    version: '2.3.1',
    size: '1.3 GB',
    lastUpdated: '2024-03-22',
    
    downloads: 678,
    rating: 4.7,
    reviewCount: 34,
    
    pricingModel: 'usage-based',
    pricingDescription: '$1.50 per coding review',
    
    egressAllowlist: ['https://api.cms.gov'],
    requiredPorts: ['8000'],
    securityNotes: 'Medical coding analysis with secure CMS guideline validation.',
    
    tags: ['healthcare', 'medical-coding', 'quality-assurance', 'icd-10', 'cpt-codes'],
    featured: false,
    trending: true,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'pharmacy-drug-interaction-checker',
    name: 'pharmacy-drug-interaction-checker',
    displayName: 'Pharmacy Drug Interaction Checker',
    description: 'Real-time drug interaction and contraindication screening for pharmacy operations',
    longDescription: 'Provides real-time screening of prescription orders for drug-drug interactions, drug-allergy contraindications, duplicate therapy issues, and dosing concerns. Integrates with pharmacy management systems to flag potential safety issues requiring pharmacist review.',
    publisher: 'healthtech-ai',
    category: 'security-compliance',
    subcategory: 'Pharmacy Safety',
    
    targetIndustries: ['healthcare'],
    complianceStandards: ['HIPAA', 'FDA Drug Safety'],
    dataRequirements: ['database', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'healthtech-ai/drug-interaction-checker',
    version: '2.8.0',
    size: '1.5 GB',
    lastUpdated: '2024-03-25',
    
    downloads: 892,
    rating: 4.8,
    reviewCount: 67,
    
    pricingModel: 'subscription',
    pricingDescription: '$300/month per pharmacy location',
    
    egressAllowlist: ['https://api.nlm.nih.gov', 'https://api.fda.gov'],
    requiredPorts: ['8000'],
    securityNotes: 'Patient medication data processed locally with FDA drug database integration.',
    
    tags: ['healthcare', 'pharmacy', 'drug-interactions', 'patient-safety', 'prescription-screening'],
    featured: true,
    trending: false,
    new: false,
    
    demoAvailable: false
  },

  {
    id: 'insurance-prior-authorization',
    name: 'insurance-prior-authorization',
    displayName: 'Insurance Prior Authorization Agent',
    description: 'Automated insurance prior authorization request processing and approval prediction',
    longDescription: 'Streamlines insurance prior authorization requests by analyzing patient medical history, proposed treatments, and insurance coverage criteria. Predicts approval likelihood, identifies required documentation, and generates pre-authorization requests with supporting clinical justification.',
    publisher: 'healthtech-ai',
    category: 'integration-automation',
    subcategory: 'Insurance Processing',
    
    targetIndustries: ['healthcare'],
    complianceStandards: ['HIPAA', 'Insurance Regulations'],
    dataRequirements: ['text-only', 'documents', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise', 'cloud'],
    
    containerImage: 'healthtech-ai/prior-auth',
    version: '1.9.3',
    size: '1.0 GB',
    lastUpdated: '2024-03-20',
    
    downloads: 1240,
    rating: 4.4,
    reviewCount: 89,
    
    pricingModel: 'usage-based',
    pricingDescription: '$8 per prior authorization request',
    
    egressAllowlist: ['https://api.availity.com', 'https://api.change.com'],
    requiredPorts: ['8000'],
    securityNotes: 'Patient data processed locally with encrypted insurance system integration.',
    
    tags: ['healthcare', 'prior-authorization', 'insurance', 'claims-processing', 'clinical-justification'],
    featured: false,
    trending: true,
    new: false,
    
    demoAvailable: true
  },

  // Legal: Document Analysis and Compliance
  {
    id: 'contract-risk-analysis-engine',
    name: 'contract-risk-analysis-engine',
    displayName: 'Contract Risk Analysis Engine',
    description: 'Comprehensive legal contract risk assessment with clause-level analysis',
    longDescription: 'Performs detailed risk analysis of legal contracts by examining individual clauses, identifying unusual terms, assessing liability exposure, and flagging non-standard provisions. Analyzes contracts against industry standards and provides risk scoring for different contract elements.',
    publisher: 'fintech-solutions',
    category: 'analysis-insights',
    subcategory: 'Contract Analysis',
    
    targetIndustries: ['legal', 'finance', 'any'],
    complianceStandards: ['Legal Standards', 'Contract Law'],
    dataRequirements: ['documents', 'text-only'],
    modelRequirements: ['claude-3-5-sonnet', 'gpt-4'],
    deploymentTypes: ['on-premise', 'cloud'],
    
    containerImage: 'fintech-solutions/contract-risk-engine',
    version: '2.4.0',
    size: '1.1 GB',
    lastUpdated: '2024-03-23',
    
    downloads: 1560,
    rating: 4.8,
    reviewCount: 78,
    
    pricingModel: 'usage-based',
    pricingDescription: '$15 per contract analyzed',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Contract analysis performed locally with attorney-client privilege protection.',
    
    tags: ['legal', 'contract-analysis', 'risk-assessment', 'due-diligence', 'compliance'],
    featured: true,
    trending: true,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'legal-research-assistant',
    name: 'legal-research-assistant',
    displayName: 'Legal Research Assistant Agent',
    description: 'AI-powered legal research with case law analysis and precedent identification',
    longDescription: 'Conducts comprehensive legal research by analyzing case law, statutes, regulations, and legal precedents relevant to specific legal issues. Provides structured research memos with cited authorities, relevant case summaries, and analysis of legal positions.',
    publisher: 'open-agents',
    category: 'analysis-insights',
    subcategory: 'Legal Research',
    
    targetIndustries: ['legal'],
    complianceStandards: ['Legal Research Standards'],
    dataRequirements: ['api-access', 'documents'],
    modelRequirements: ['claude-3-opus', 'gpt-4'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'openagents/legal-research',
    version: '2.1.4',
    size: '1.4 GB',
    lastUpdated: '2024-03-21',
    
    downloads: 2340,
    rating: 4.6,
    reviewCount: 145,
    
    pricingModel: 'usage-based',
    pricingDescription: '$25 per research request',
    
    egressAllowlist: ['https://api.westlaw.com', 'https://api.lexisnexis.com'],
    requiredPorts: ['8000'],
    securityNotes: 'Legal research with secure legal database integration.',
    
    tags: ['legal', 'legal-research', 'case-law', 'precedent-analysis', 'legal-memo'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'litigation-document-reviewer',
    name: 'litigation-document-reviewer',
    displayName: 'Litigation Document Review Agent',
    description: 'AI-powered document review for litigation discovery with privilege protection',
    longDescription: 'Performs initial document review for litigation discovery processes by analyzing documents for relevance, responsiveness, and privilege. Identifies potentially privileged communications, classifies documents by relevance, and flags sensitive materials requiring attorney review.',
    publisher: 'fintech-solutions',
    category: 'data-processing',
    subcategory: 'Document Review',
    
    targetIndustries: ['legal'],
    complianceStandards: ['Attorney-Client Privilege', 'Discovery Rules'],
    dataRequirements: ['documents', 'text-only'],
    modelRequirements: ['claude-3-5-sonnet', 'gpt-4'],
    deploymentTypes: ['on-premise', 'air-gapped'],
    
    containerImage: 'fintech-solutions/litigation-reviewer',
    version: '2.2.3',
    size: '1.2 GB',
    lastUpdated: '2024-03-19',
    
    downloads: 567,
    rating: 4.5,
    reviewCount: 28,
    
    pricingModel: 'usage-based',
    pricingDescription: '$0.25 per document reviewed',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Document review performed locally with privilege protection protocols.',
    
    tags: ['legal', 'litigation', 'document-review', 'discovery', 'privilege-protection'],
    featured: false,
    trending: true,
    new: false,
    
    demoAvailable: true
  }
]

// Category definitions
export const MARKETPLACE_CATEGORIES = {
  'data-processing': {
    name: 'Data Processing',
    description: 'Document validation, data integrity, and regulatory reporting automation',
    icon: 'database'
  },
  'content-generation': {
    name: 'Content Generation', 
    description: 'Legal documents, compliance materials, and regulatory communications',
    icon: 'pencil-square'
  },
  'analysis-insights': {
    name: 'Analysis & Insights',
    description: 'Risk assessment, financial analysis, and pattern recognition',
    icon: 'chart-bar'
  },
  'security-compliance': {
    name: 'Security & Compliance',
    description: 'Regulatory compliance, fraud detection, and audit preparation',
    icon: 'shield-check'
  },
  'integration-automation': {
    name: 'Integration & Automation',
    description: 'Workflow automation, system integration, and process optimization',
    icon: 'cog-6-tooth'
  },
  'specialized': {
    name: 'Specialized',
    description: 'Industry-specific and domain-specialized professional workflows',
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
    agent.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    agent.subcategory?.toLowerCase().includes(lowerQuery)
  )
}

export function getAgent(id: string): MarketplaceAgent | undefined {
  return MOCK_AGENTS.find(agent => agent.id === id)
}

export function getPublisher(id: string): MarketplacePublisher | undefined {
  return MOCK_PUBLISHERS[id]
}