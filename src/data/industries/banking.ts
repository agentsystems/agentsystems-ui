/**
 * Professional Banking Industry Agents
 * 
 * Comprehensive banking workflow automation agents based on detailed industry analysis.
 * Each agent represents a specific banking job function with clear regulatory compliance value.
 */

import type { MarketplaceAgent } from '../types'

export const BANKING_AGENTS: MarketplaceAgent[] = [
  // Regulatory Compliance Agents
  {
    id: 'marketing-compliance-reviewer',
    name: 'marketing-compliance-reviewer',
    displayName: 'Marketing Compliance Review Agent',
    description: 'Reviews marketing materials for UDAAP, Regulation DD, and Truth in Lending compliance',
    longDescription: 'Reviews marketing materials, promotions, and advertisements for compliance with federal regulations including UDAAP, Regulation DD (Truth in Savings), Regulation Z (Truth in Lending), and bank-specific policies. Identifies potential compliance issues, misleading statements, missing disclosures, or other regulatory concerns before materials are published. Reduces compliance review time by 50-70% while ensuring consistent regulatory standards.',
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
    id: 'hmda-cra-data-validator',
    name: 'hmda-cra-data-validator',
    displayName: 'HMDA/CRA Data Validation Agent',
    description: 'Validates Home Mortgage Disclosure Act and Community Reinvestment Act data accuracy',
    longDescription: 'Validates Home Mortgage Disclosure Act (HMDA) and Community Reinvestment Act (CRA) data for accuracy, completeness, and regulatory compliance prior to submission. Identifies data integrity issues, inconsistencies, and potential reporting errors that could trigger regulatory scrutiny. Ensures data meets all technical specifications required for successful regulatory filing.',
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
    id: 'sar-drafting-agent',
    name: 'sar-drafting-agent',
    displayName: 'Suspicious Activity Report Drafting Agent',
    description: 'Creates FinCEN-compliant SAR narratives from suspicious activity alerts',
    longDescription: 'Analyzes suspicious activity alerts and creates initial draft SAR narratives that follow FinCEN requirements and best practices. Compiles relevant transaction data, customer information, and supporting documentation to substantiate the suspicious activity in format that meets regulatory expectations. Reduces BSA analyst time by 50-70% while improving narrative quality.',
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
    id: 'wire-transfer-risk-assessor',
    name: 'wire-transfer-risk-assessor',
    displayName: 'Wire Transfer Risk Assessment Agent',
    description: 'Real-time fraud and AML risk assessment for wire transfers',
    longDescription: 'Evaluates wire transfers in real-time for fraud, money laundering, and sanctions risks before processing. Analyzes transaction details, customer profiles, and recipient information against known risk patterns and watch lists. Applies risk-based models to identify suspicious transactions requiring additional review while allowing legitimate transfers to proceed with minimal delay.',
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
    id: 'loan-document-verifier',
    name: 'loan-document-verifier',
    displayName: 'Loan Document Verification Agent',
    description: 'Validates loan application documents for authenticity and consistency',
    longDescription: 'Validates loan application documents for authenticity, completeness, and consistency. Compares information across multiple documents to identify discrepancies in income, employment, asset, and identification details. Verifies document authenticity through forensic analysis of digital signatures, formatting, and other security features.',
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
    longDescription: 'Tracks commercial loan covenants to ensure borrower compliance with financial and operational requirements. Extracts covenant terms from loan agreements, calculates financial metrics from borrower statements, and compares results against covenant thresholds. Identifies actual or potential covenant violations requiring attention, including early warning notifications for deteriorating metrics.',
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
    id: 'call-report-preparer',
    name: 'call-report-preparer',
    displayName: 'Call Report Preparation Agent',
    description: 'Automates quarterly regulatory Call Report preparation and validation',
    longDescription: 'Assists in preparing quarterly regulatory financial reports (Call Reports) required by federal banking regulators. Extracts data from general ledger and subsystems, maps to appropriate call report line items, performs required calculations, and validates entries against regulatory requirements. Reduces preparation time by 50-70% while improving accuracy.',
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
    id: 'fair-lending-analyzer',
    name: 'fair-lending-analyzer',
    displayName: 'Fair Lending Analysis Agent',
    description: 'Statistical analysis of lending patterns to identify potential fair lending concerns',
    longDescription: 'Conducts statistical analysis of lending patterns to identify potential fair lending concerns, including disparate treatment or disparate impact. Analyzes underwriting decisions, pricing, terms, and servicing actions across demographic groups to detect potential discrimination. Provides defendable methodology for fair lending compliance.',
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
  }
]