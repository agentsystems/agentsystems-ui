/**
 * Professional Mock Agents Database
 * 
 * Based on detailed industry analysis and specific job functions.
 * Each agent represents a well-defined workflow with clear business value.
 */

// Types imported inline to avoid circular dependency
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
export type PricingModel = string

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

export const PROFESSIONAL_BANKING_AGENTS: MarketplaceAgent[] = [
  // Regulatory Compliance Agents
  {
    id: 'marketing-compliance-reviewer',
    name: 'marketing-compliance-reviewer',
    displayName: 'Marketing Compliance Review Agent',
    description: 'Reviews marketing materials for UDAAP, Regulation DD, and Truth in Lending compliance',
    longDescription: 'Reviews marketing materials, promotions, and advertisements for compliance with federal regulations including UDAAP, Regulation DD (Truth in Savings), Regulation Z (Truth in Lending), and bank-specific policies. Identifies potential compliance issues, misleading statements, missing disclosures, or other regulatory concerns before materials are published or distributed to customers.',
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
    pricingDescription: '$300/month per compliance reviewer + usage fees',
    
    egressAllowlist: ['https://api.cfpb.gov', 'https://www.federalregister.gov'],
    requiredPorts: ['8000'],
    securityNotes: 'Processes marketing materials locally with regulatory database integration.',
    
    tags: ['banking', 'marketing-compliance', 'UDAAP', 'regulation-dd', 'truth-in-lending'],
    featured: true,
    trending: true,
    new: false,
    
    demoAvailable: true,
    sampleInput: '{"marketing_material": "Special CD Offer - 5.5% APY for 12 months!", "material_type": "advertisement"}',
    sampleOutput: '{"compliance_score": 85, "issues": ["Missing FDIC insurance disclosure", "APY calculation verification needed"], "recommendations": ["Add standard FDIC language", "Include compounding disclosure"]}'
  },

  {
    id: 'regulation-dd-disclosure-validator',
    name: 'regulation-dd-disclosure-validator',
    displayName: 'Regulation DD Disclosure Validator',
    description: 'Validates deposit account disclosures for Truth in Savings Act compliance',
    longDescription: 'Validates deposit account disclosures for compliance with Regulation DD (Truth in Savings Act) requirements. Ensures all required elements are present, fees are accurately disclosed, APY calculations are correct, and advertising claims are properly supported. Reviews both new product disclosures and updates to existing product terms.',
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
    id: 'regulation-z-payment-analyzer',
    name: 'regulation-z-payment-analyzer',
    displayName: 'Regulation Z Payment History Analyzer',
    description: 'Analyzes loan payment histories for Truth in Lending Act compliance violations',
    longDescription: 'Analyzes loan payment histories and fee assessments to identify potential Truth in Lending Act (Regulation Z) violations. Examines payment application sequencing, interest calculations, fee assessments, and disclosure practices. Flags transactions that may violate regulatory requirements.',
    publisher: 'fintech-solutions',
    category: 'security-compliance',
    subcategory: 'Lending Compliance',
    
    targetIndustries: ['finance'],
    complianceStandards: ['Regulation Z', 'Truth in Lending'],
    dataRequirements: ['database', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-opus'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'fintech-solutions/reg-z-analyzer',
    version: '1.6.3',
    size: '1.1 GB',
    lastUpdated: '2024-03-18',
    
    downloads: 445,
    rating: 4.6,
    reviewCount: 19,
    
    pricingModel: 'subscription',
    pricingDescription: '$500/month per loan portfolio',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Processes loan payment data locally with no external transmission.',
    
    tags: ['banking', 'regulation-z', 'truth-in-lending', 'payment-analysis', 'compliance'],
    featured: false,
    trending: true,
    new: false,
    
    demoAvailable: false
  },

  {
    id: 'fee-disclosure-validator',
    name: 'fee-disclosure-validator',
    displayName: 'Fee Disclosure Validation Agent',
    description: 'Validates consistent fee disclosure across all customer touchpoints and documents',
    longDescription: 'Validates that all bank fees are accurately and consistently disclosed across multiple documents, including account agreements, fee schedules, online banking, and marketing materials. Ensures fees are consistently described and accurately presented to customers in accordance with regulatory requirements.',
    publisher: 'fintech-solutions',
    category: 'security-compliance',
    subcategory: 'Fee Compliance',
    
    targetIndustries: ['finance'],
    complianceStandards: ['Regulation DD', 'Consumer Protection'],
    dataRequirements: ['documents', 'text-only'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise', 'cloud'],
    
    containerImage: 'fintech-solutions/fee-validator',
    version: '1.4.2',
    size: '680 MB',
    lastUpdated: '2024-03-19',
    
    downloads: 723,
    rating: 4.5,
    reviewCount: 31,
    
    pricingModel: 'usage-based',
    pricingDescription: '$10 per document validation',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'All fee disclosures processed locally for consistency validation.',
    
    tags: ['banking', 'fee-disclosure', 'regulation-dd', 'customer-protection', 'consistency'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'regulation-e-dispute-manager',
    name: 'regulation-e-dispute-manager',
    displayName: 'Regulation E Dispute Resolution Manager',
    description: 'Manages electronic funds transfer disputes with regulatory timeline compliance',
    longDescription: 'Manages the electronic funds transfer dispute resolution process in compliance with Regulation E requirements. Tracks dispute timelines, generates appropriate customer communications, manages provisional credit decisions, and documents investigation results while ensuring compliance with strict regulatory timelines.',
    publisher: 'fintech-solutions',
    category: 'integration-automation',
    subcategory: 'Dispute Resolution',
    
    targetIndustries: ['finance'],
    complianceStandards: ['Regulation E', 'Electronic Fund Transfer Act'],
    dataRequirements: ['database', 'documents'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'fintech-solutions/reg-e-disputes',
    version: '2.2.1',
    size: '890 MB',
    lastUpdated: '2024-03-24',
    
    downloads: 334,
    rating: 4.7,
    reviewCount: 15,
    
    pricingModel: 'subscription',
    pricingDescription: '$400/month per dispute processor',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Processes customer dispute data locally with timeline enforcement.',
    
    tags: ['banking', 'regulation-e', 'dispute-resolution', 'eft', 'compliance-timeline'],
    featured: false,
    trending: false,
    new: true,
    
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

  // Risk Management & Security Agents
  {
    id: 'vendor-due-diligence-assessor',
    name: 'vendor-due-diligence-assessor',
    displayName: 'Vendor Due Diligence Assessment Agent',
    description: 'Conducts comprehensive third-party vendor risk assessments and due diligence',
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
    id: 'soc-report-analyzer',
    name: 'soc-report-analyzer',
    displayName: 'SOC Report Analysis Agent',
    description: 'Analyzes vendor SOC reports to identify control weaknesses and compliance gaps',
    longDescription: 'Analyzes vendor System and Organization Controls (SOC) reports to identify control weaknesses, exceptions, and potential risks to the bank. Evaluates vendor controls against bank requirements, tracks remediation of prior findings, and assesses the impact of control exceptions.',
    publisher: 'security-first',
    category: 'security-compliance',
    subcategory: 'Control Assessment',
    
    targetIndustries: ['finance'],
    complianceStandards: ['SOC 1', 'SOC 2', 'Internal Controls'],
    dataRequirements: ['documents'],
    modelRequirements: ['gpt-4', 'claude-3-opus'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'security-first/soc-analyzer',
    version: '2.1.0',
    size: '920 MB',
    lastUpdated: '2024-03-17',
    
    downloads: 234,
    rating: 4.8,
    reviewCount: 13,
    
    pricingModel: 'usage-based',
    pricingDescription: '$50 per SOC report analyzed',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Processes SOC reports locally with no external data transmission.',
    
    tags: ['banking', 'soc-reports', 'control-assessment', 'vendor-management', 'audit'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'wire-transfer-risk-assessor',
    name: 'wire-transfer-risk-assessor',
    displayName: 'Wire Transfer Risk Assessment Agent',
    description: 'Real-time fraud and AML risk assessment for wire transfers',
    longDescription: 'Evaluates wire transfers in real-time for fraud, money laundering, and sanctions risks before processing. Analyzes transaction details, customer profiles, and recipient information against known risk patterns and watch lists. Applies risk-based models to identify suspicious transactions requiring additional review.',
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
    
    egressAllowlist: ['https://api.ofac.treasury.gov', 'https://api.worldbank.org'],
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

  // BSA/AML Compliance Agents
  {
    id: 'sar-drafting-agent',
    name: 'sar-drafting-agent',
    displayName: 'Suspicious Activity Report Drafting Agent',
    description: 'Creates FinCEN-compliant SAR narratives from suspicious activity alerts',
    longDescription: 'Analyzes suspicious activity alerts and creates initial draft SAR narratives that follow FinCEN requirements and best practices. Compiles relevant transaction data, customer information, and supporting documentation to substantiate the suspicious activity in format that meets regulatory expectations.',
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

  // Lending and Credit Administration Agents
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

  {
    id: 'credit-limit-optimizer',
    name: 'credit-limit-optimizer',
    displayName: 'Credit Limit Recommendation Agent',
    description: 'AI-powered credit limit optimization based on customer behavior and risk analysis',
    longDescription: 'Analyzes customer transaction history, repayment behavior, and credit bureau information to recommend appropriate credit limit adjustments. Identifies customers with consistent payment history that may qualify for increases while flagging accounts showing signs of financial stress.',
    publisher: 'fintech-solutions',
    category: 'analysis-insights',
    subcategory: 'Credit Management',
    
    targetIndustries: ['finance'],
    complianceStandards: ['Credit Risk Management', 'Fair Credit Reporting'],
    dataRequirements: ['database', 'api-access'],
    modelRequirements: ['gpt-4', 'local-llm'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'fintech-solutions/credit-optimizer',
    version: '2.2.3',
    size: '980 MB',
    lastUpdated: '2024-03-22',
    
    downloads: 723,
    rating: 4.4,
    reviewCount: 33,
    
    pricingModel: 'subscription',
    pricingDescription: '$150/month per credit manager + $0.50 per analysis',
    
    egressAllowlist: ['https://api.experian.com', 'https://api.equifax.com'],
    requiredPorts: ['8000'],
    securityNotes: 'Credit bureau integration with encrypted data transmission.',
    
    tags: ['banking', 'credit-limits', 'portfolio-optimization', 'risk-management', 'revenue-optimization'],
    featured: false,
    trending: true,
    new: false,
    
    demoAvailable: true
  },

  // Treasury and Financial Management Agents
  {
    id: 'lcr-calculator',
    name: 'lcr-calculator',
    displayName: 'Liquidity Coverage Ratio Calculator',
    description: 'Basel III LCR calculations with regulatory compliance validation',
    longDescription: 'Calculates regulatory liquidity metrics, including the Liquidity Coverage Ratio (LCR), to ensure compliance with Basel III and regulatory requirements. Analyzes cash flows, classifies assets by liquidity quality, applies appropriate haircuts, and calculates required liquidity buffers.',
    publisher: 'fintech-solutions',
    category: 'analysis-insights',
    subcategory: 'Treasury Management',
    
    targetIndustries: ['finance'],
    complianceStandards: ['Basel III', 'LCR Requirements'],
    dataRequirements: ['database', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-opus'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'fintech-solutions/lcr-calculator',
    version: '1.9.2',
    size: '890 MB',
    lastUpdated: '2024-03-20',
    
    downloads: 178,
    rating: 4.9,
    reviewCount: 8,
    
    pricingModel: 'subscription',
    pricingDescription: '$1000/month per treasury analyst',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Liquidity calculations performed locally with secure regulatory reporting.',
    
    tags: ['banking', 'lcr', 'basel-iii', 'liquidity-management', 'regulatory-capital'],
    featured: false,
    trending: false,
    new: true,
    
    demoAvailable: false
  },

  {
    id: 'interest-rate-risk-modeler',
    name: 'interest-rate-risk-modeler',
    displayName: 'Interest Rate Risk Modeling Agent',
    description: 'Advanced interest rate risk modeling and scenario analysis for ALM',
    longDescription: 'Models potential effects of interest rate changes on bank earnings and capital. Analyzes balance sheet composition, repricing characteristics, and cash flow projections under various rate scenarios. Identifies assets and liabilities with significant interest rate sensitivity.',
    publisher: 'fintech-solutions',
    category: 'analysis-insights',
    subcategory: 'Asset Liability Management',
    
    targetIndustries: ['finance'],
    complianceStandards: ['Interest Rate Risk Management', 'Basel Guidelines'],
    dataRequirements: ['database', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-opus'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'fintech-solutions/irr-modeler',
    version: '2.1.1',
    size: '1.2 GB',
    lastUpdated: '2024-03-18',
    
    downloads: 156,
    rating: 4.7,
    reviewCount: 9,
    
    pricingModel: 'subscription',
    pricingDescription: '$1200/month per ALM analyst',
    
    egressAllowlist: ['https://api.federalreserve.gov'],
    requiredPorts: ['8000'],
    securityNotes: 'Interest rate modeling with secure Fed rate data integration.',
    
    tags: ['banking', 'interest-rate-risk', 'alm', 'stress-testing', 'earnings-at-risk'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: false
  },

  {
    id: 'deposit-portfolio-optimizer',
    name: 'deposit-portfolio-optimizer',
    displayName: 'Deposit Portfolio Optimization Agent',
    description: 'Optimizes deposit portfolio composition for cost, liquidity, and stability',
    longDescription: 'Analyzes deposit portfolio composition to identify opportunities for optimization of funding costs, liquidity, and stability. Examines deposit pricing, customer behaviors, competitive offerings, and interest rate sensitivity to recommend targeted strategies.',
    publisher: 'fintech-solutions',
    category: 'analysis-insights',
    subcategory: 'Deposit Management',
    
    targetIndustries: ['finance'],
    complianceStandards: ['Deposit Management', 'Liquidity Requirements'],
    dataRequirements: ['database', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise', 'cloud'],
    
    containerImage: 'fintech-solutions/deposit-optimizer',
    version: '1.8.0',
    size: '950 MB',
    lastUpdated: '2024-03-21',
    
    downloads: 245,
    rating: 4.5,
    reviewCount: 12,
    
    pricingModel: 'subscription',
    pricingDescription: '$600/month per treasury team',
    
    egressAllowlist: ['https://api.rateshop.com'],
    requiredPorts: ['8000'],
    securityNotes: 'Deposit analysis with competitive rate benchmarking.',
    
    tags: ['banking', 'deposit-optimization', 'funding-costs', 'liquidity', 'portfolio-management'],
    featured: false,
    trending: true,
    new: false,
    
    demoAvailable: true
  },

  // Operations and Processing Agents
  {
    id: 'exception-item-processor',
    name: 'exception-item-processor',
    displayName: 'Check Exception Processing Agent',
    description: 'Automated processing of check and payment exceptions with risk-based decisions',
    longDescription: 'Analyzes check and payment exceptions (e.g., non-sufficient funds, signature mismatches, endorsement issues) to recommend appropriate handling actions. Evaluates exception items against customer history, account agreements, and bank policies to determine appropriate disposition.',
    publisher: 'open-agents',
    category: 'integration-automation',
    subcategory: 'Payment Processing',
    
    targetIndustries: ['finance'],
    complianceStandards: ['UCC', 'Check Processing Standards'],
    dataRequirements: ['images', 'database'],
    modelRequirements: ['multimodal', 'gpt-4'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'openagents/exception-processor',
    version: '1.6.3',
    size: '1.1 GB',
    lastUpdated: '2024-03-17',
    
    downloads: 892,
    rating: 4.3,
    reviewCount: 41,
    
    pricingModel: 'usage-based',
    pricingDescription: '$0.75 per exception item processed',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Check image analysis performed locally with signature verification.',
    
    tags: ['banking', 'exception-processing', 'check-processing', 'signature-verification', 'operations'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'overdraft-nsf-fee-assessor',
    name: 'overdraft-nsf-fee-assessor',
    displayName: 'Overdraft/NSF Fee Assessment Agent',
    description: 'Validates accuracy of overdraft and NSF fee assessments against policies',
    longDescription: 'Validates the accuracy of overdraft and non-sufficient funds (NSF) fee assessments against regulatory requirements and bank policies. Analyzes transaction sequences, posting orders, and account balances to ensure proper fee application.',
    publisher: 'fintech-solutions',
    category: 'security-compliance',
    subcategory: 'Fee Management',
    
    targetIndustries: ['finance'],
    complianceStandards: ['Regulation DD', 'Fee Policy Compliance'],
    dataRequirements: ['database'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'fintech-solutions/fee-assessor',
    version: '2.0.2',
    size: '720 MB',
    lastUpdated: '2024-03-24',
    
    downloads: 445,
    rating: 4.6,
    reviewCount: 23,
    
    pricingModel: 'subscription',
    pricingDescription: '$250/month per deposit operations team',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Transaction analysis performed locally with no external data sharing.',
    
    tags: ['banking', 'overdraft-fees', 'nsf-fees', 'fee-validation', 'regulation-dd'],
    featured: false,
    trending: false,
    new: true,
    
    demoAvailable: true
  },

  // Audit and Governance Agents
  {
    id: 'call-report-preparer',
    name: 'call-report-preparer',
    displayName: 'Call Report Preparation Agent',
    description: 'Automates quarterly regulatory Call Report preparation and validation',
    longDescription: 'Assists in preparing quarterly regulatory financial reports (Call Reports) required by federal banking regulators. Extracts data from general ledger and subsystems, maps to appropriate call report line items, performs required calculations, and validates entries against regulatory requirements.',
    publisher: 'fintech-solutions',
    category: 'data-processing',
    subcategory: 'Regulatory Reporting',
    
    targetIndustries: ['finance'],
    complianceStandards: ['Call Report Requirements', 'FFIEC Guidelines'],
    dataRequirements: ['database'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'fintech-solutions/call-report-preparer',
    version: '2.4.1',
    size: '860 MB',
    lastUpdated: '2024-03-23',
    
    downloads: 234,
    rating: 4.8,
    reviewCount: 14,
    
    pricingModel: 'subscription',
    pricingDescription: '$500/month per financial reporting team',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Financial data processed locally for regulatory report generation.',
    
    tags: ['banking', 'call-reports', 'regulatory-reporting', 'ffiec', 'financial-reporting'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: false
  },

  {
    id: 'branch-audit-preparer',
    name: 'branch-audit-preparer',
    displayName: 'Branch Audit Preparation Agent',
    description: 'Proactive branch audit preparation with compliance gap identification',
    longDescription: 'Assists in preparing for internal and regulatory branch audits by identifying potential issues before auditors arrive. Analyzes branch operations data, teller transactions, cash handling records, and regulatory compliance metrics to identify potential audit findings.',
    publisher: 'fintech-solutions',
    category: 'security-compliance',
    subcategory: 'Audit Preparation',
    
    targetIndustries: ['finance'],
    complianceStandards: ['Branch Audit Standards', 'Operational Compliance'],
    dataRequirements: ['database', 'documents'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'fintech-solutions/branch-audit-prep',
    version: '1.4.3',
    size: '740 MB',
    lastUpdated: '2024-03-19',
    
    downloads: 167,
    rating: 4.5,
    reviewCount: 11,
    
    pricingModel: 'subscription',
    pricingDescription: '$200/month per branch + $50 per audit preparation',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Branch operations data analyzed locally for compliance assessment.',
    
    tags: ['banking', 'branch-audit', 'audit-preparation', 'compliance-assessment', 'operations'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'regulatory-exam-remediation-tracker',
    name: 'regulatory-exam-remediation-tracker',
    displayName: 'Regulatory Exam Remediation Tracker',
    description: 'Tracks and manages regulatory examination finding remediation with deadline compliance',
    longDescription: 'Tracks and manages the remediation of regulatory examination findings to ensure timely resolution. Monitors deadlines, documents remediation activities, verifies evidence collection, and generates status reports for management and regulators.',
    publisher: 'fintech-solutions',
    category: 'integration-automation',
    subcategory: 'Regulatory Management',
    
    targetIndustries: ['finance'],
    complianceStandards: ['Regulatory Examination Standards', 'Remediation Requirements'],
    dataRequirements: ['documents', 'database'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'fintech-solutions/exam-remediation',
    version: '1.7.1',
    size: '650 MB',
    lastUpdated: '2024-03-22',
    
    downloads: 123,
    rating: 4.7,
    reviewCount: 7,
    
    pricingModel: 'subscription',
    pricingDescription: '$400/month per compliance officer',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Examination findings tracked locally with secure documentation.',
    
    tags: ['banking', 'regulatory-examination', 'remediation-tracking', 'compliance-management', 'deadline-monitoring'],
    featured: false,
    trending: false,
    new: true,
    
    demoAvailable: true
  },

  {
    id: 'board-alco-report-compiler',
    name: 'board-alco-report-compiler',
    displayName: 'Board ALCO Report Compiler',
    description: 'Comprehensive Asset Liability Committee reporting for board governance',
    longDescription: 'Compiles comprehensive Asset Liability Committee (ALCO) reports for board and management review. Aggregates data from multiple financial systems to create standardized reports on liquidity, interest rate risk, investment portfolio performance, and deposit/loan trends.',
    publisher: 'fintech-solutions',
    category: 'data-processing',
    subcategory: 'Board Reporting',
    
    targetIndustries: ['finance'],
    complianceStandards: ['Board Governance', 'ALCO Requirements'],
    dataRequirements: ['database'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'fintech-solutions/alco-compiler',
    version: '2.0.4',
    size: '800 MB',
    lastUpdated: '2024-03-21',
    
    downloads: 89,
    rating: 4.8,
    reviewCount: 6,
    
    pricingModel: 'subscription',
    pricingDescription: '$600/month per ALCO committee',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Financial data compiled locally for board presentation.',
    
    tags: ['banking', 'alco-reporting', 'board-governance', 'financial-reporting', 'committee-management'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: false
  },

  {
    id: 'portfolio-stress-tester',
    name: 'portfolio-stress-tester',
    displayName: 'Portfolio Stress Testing Agent',
    description: 'Advanced stress testing for loan and investment portfolios under adverse scenarios',
    longDescription: 'Conducts stress testing on loan and investment portfolios to assess potential impacts of adverse economic scenarios. Applies regulatory and custom stress scenarios to portfolio data to project potential losses, capital impacts, and liquidity effects.',
    publisher: 'fintech-solutions',
    category: 'analysis-insights',
    subcategory: 'Risk Management',
    
    targetIndustries: ['finance'],
    complianceStandards: ['Stress Testing Requirements', 'Capital Planning'],
    dataRequirements: ['database', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-opus'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'fintech-solutions/stress-tester',
    version: '2.3.2',
    size: '1.4 GB',
    lastUpdated: '2024-03-25',
    
    downloads: 134,
    rating: 4.9,
    reviewCount: 8,
    
    pricingModel: 'subscription',
    pricingDescription: '$1500/month per risk management team',
    
    egressAllowlist: ['https://api.federalreserve.gov', 'https://api.bea.gov'],
    requiredPorts: ['8000'],
    securityNotes: 'Portfolio stress testing with secure economic data integration.',
    
    tags: ['banking', 'stress-testing', 'portfolio-analysis', 'risk-management', 'capital-planning'],
    featured: true,
    trending: false,
    new: false,
    
    demoAvailable: false
  },

  {
    id: 'cecl-model-validator',
    name: 'cecl-model-validator',
    displayName: 'CECL Model Validation Agent',
    description: 'Comprehensive CECL model validation for loan loss reserve compliance',
    longDescription: 'Validates Current Expected Credit Loss (CECL) models to ensure regulatory compliance and accuracy of loan loss reserves. Examines model methodology, input data quality, assumption reasonableness, and output sensitivities for accounting standard compliance.',
    publisher: 'fintech-solutions',
    category: 'security-compliance',
    subcategory: 'Model Risk Management',
    
    targetIndustries: ['finance'],
    complianceStandards: ['CECL', 'Model Risk Management', 'GAAP'],
    dataRequirements: ['database', 'documents'],
    modelRequirements: ['gpt-4', 'claude-3-opus'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'fintech-solutions/cecl-validator',
    version: '1.2.1',
    size: '1.1 GB',
    lastUpdated: '2024-03-16',
    
    downloads: 67,
    rating: 4.8,
    reviewCount: 5,
    
    pricingModel: 'enterprise',
    pricingDescription: 'Contact for CECL model validation pricing',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'CECL model validation performed locally with secure historical data analysis.',
    
    tags: ['banking', 'cecl', 'model-validation', 'loan-loss-reserves', 'accounting-compliance'],
    featured: false,
    trending: false,
    new: true,
    
    demoAvailable: false
  },

  {
    id: 'capital-planning-assistant',
    name: 'capital-planning-assistant',
    displayName: 'Capital Planning Assistant Agent',
    description: 'Strategic capital planning with regulatory compliance and scenario analysis',
    longDescription: 'Assists in developing capital plans that align with strategic objectives and regulatory requirements. Analyzes current capital position, projects capital needs based on growth and stress scenarios, and evaluates potential capital actions for optimal capital structure.',
    publisher: 'fintech-solutions',
    category: 'analysis-insights',
    subcategory: 'Capital Management',
    
    targetIndustries: ['finance'],
    complianceStandards: ['Capital Planning Requirements', 'Basel III'],
    dataRequirements: ['database', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-opus'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'fintech-solutions/capital-planner',
    version: '1.5.0',
    size: '920 MB',
    lastUpdated: '2024-03-18',
    
    downloads: 78,
    rating: 4.9,
    reviewCount: 4,
    
    pricingModel: 'enterprise',
    pricingDescription: 'Contact for capital planning pricing',
    
    egressAllowlist: ['https://api.federalreserve.gov'],
    requiredPorts: ['8000'],
    securityNotes: 'Capital planning with secure regulatory data integration.',
    
    tags: ['banking', 'capital-planning', 'strategic-planning', 'basel-iii', 'financial-modeling'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: false
  }
]

export const PROFESSIONAL_HEALTHCARE_AGENTS: MarketplaceAgent[] = [
  {
    id: 'clinical-decision-support',
    name: 'clinical-decision-support',
    displayName: 'Clinical Decision Support Agent',
    description: 'Evidence-based clinical decision support for diagnostic and treatment recommendations',
    longDescription: 'Provides evidence-based clinical decision support by analyzing patient symptoms, medical history, and diagnostic test results against current medical literature and guidelines. Offers differential diagnosis suggestions and treatment recommendations while maintaining physician oversight for all clinical decisions.',
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
    pricingDescription: '$400/month per clinician + usage fees',
    
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
    longDescription: 'Provides real-time screening of prescription orders for drug-drug interactions, drug-allergy contraindications, duplicate therapy issues, and dosing concerns. Integrates with pharmacy management systems to flag potential safety issues requiring pharmacist review before dispensing.',
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
  }
]

export const PROFESSIONAL_LEGAL_AGENTS: MarketplaceAgent[] = [
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