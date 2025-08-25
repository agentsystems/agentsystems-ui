/**
 * Professional Government and Public Sector Agents
 * 
 * Comprehensive government workflow automation agents for federal, state, and local
 * government operations. Each agent addresses specific public sector job functions
 * with security clearance and regulatory compliance requirements.
 */

import type { MarketplaceAgent } from '../types'

export const GOVERNMENT_AGENTS: MarketplaceAgent[] = [
  // Public Records and Transparency
  {
    id: 'foia-request-processor',
    name: 'foia-request-processor',
    displayName: 'FOIA Request Processing Agent',
    description: 'Automated Freedom of Information Act request processing with document redaction and response generation',
    longDescription: 'Processes Freedom of Information Act (FOIA) requests by identifying responsive documents, applying appropriate exemptions, generating redaction recommendations, and preparing response letters. Ensures compliance with FOIA timelines and requirements while protecting classified and sensitive information. Reduces FOIA processing time by 60-80%.',
    publisher: 'govtech-solutions',
    category: 'integration-automation',
    subcategory: 'Public Records',
    
    targetIndustries: ['government'],
    complianceStandards: ['FOIA', 'Privacy Act'],
    dataRequirements: ['documents', 'database'],
    modelRequirements: ['claude-3-5-sonnet', 'gpt-4'],
    deploymentTypes: ['on-premise', 'air-gapped'],
    
    containerImage: 'govtech-solutions/foia-processor',
    version: '2.1.3',
    size: '1.1 GB',
    lastUpdated: '2024-03-25',
    
    downloads: 456,
    rating: 4.7,
    reviewCount: 28,
    
    pricingModel: 'subscription',
    pricingDescription: '$500/month per FOIA officer',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'FOIA documents processed locally with classification protection and redaction.',
    
    tags: ['government', 'foia', 'public-records', 'document-redaction', 'transparency'],
    featured: true,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'government-contract-compliance-monitor',
    name: 'government-contract-compliance-monitor',
    displayName: 'Government Contract Compliance Monitor',
    description: 'Federal contract compliance monitoring with FAR analysis and deliverable tracking',
    longDescription: 'Monitors government contract compliance including Federal Acquisition Regulation (FAR) requirements, deliverable tracking, and performance metrics. Analyzes contract terms, tracks milestone completion, identifies compliance risks, and generates contract administration reports for contracting officers.',
    publisher: 'govtech-solutions',
    category: 'security-compliance',
    subcategory: 'Contract Administration',
    
    targetIndustries: ['government'],
    complianceStandards: ['FAR', 'Government Contract Law'],
    dataRequirements: ['documents', 'database'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise', 'air-gapped'],
    
    containerImage: 'govtech-solutions/contract-compliance',
    version: '2.0.1',
    size: '1.2 GB',
    lastUpdated: '2024-03-24',
    
    downloads: 234,
    rating: 4.8,
    reviewCount: 16,
    
    pricingModel: 'enterprise',
    pricingDescription: 'Contact for government pricing',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Contract data processed locally with government security requirements.',
    
    tags: ['government', 'contract-compliance', 'far', 'procurement', 'performance-monitoring'],
    featured: false,
    trending: false,
    new: true,
    
    demoAvailable: false
  },

  {
    id: 'citizen-service-request-manager',
    name: 'citizen-service-request-manager',
    displayName: 'Citizen Service Request Manager',
    description: 'Automated citizen service request routing and response management for local government',
    longDescription: 'Manages citizen service requests including 311 calls, online submissions, and municipal service issues. Automatically categorizes requests, routes to appropriate departments, tracks resolution status, and generates citizen communications. Integrates with GIS systems for location-based service coordination.',
    publisher: 'govtech-solutions',
    category: 'integration-automation',
    subcategory: 'Citizen Services',
    
    targetIndustries: ['government'],
    complianceStandards: ['Open Government', 'Public Records'],
    dataRequirements: ['text-only', 'database', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'govtech-solutions/citizen-service-manager',
    version: '1.7.2',
    size: '890 MB',
    lastUpdated: '2024-03-22',
    
    downloads: 678,
    rating: 4.5,
    reviewCount: 34,
    
    pricingModel: 'subscription',
    pricingDescription: '$200/month per 10,000 population served',
    
    egressAllowlist: ['https://api.usps.com'],
    requiredPorts: ['8000'],
    securityNotes: 'Citizen data processed locally with privacy protection protocols.',
    
    tags: ['government', 'citizen-services', '311-system', 'municipal-services', 'case-management'],
    featured: false,
    trending: true,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'federal-grant-compliance-tracker',
    name: 'federal-grant-compliance-tracker',
    displayName: 'Federal Grant Compliance Tracker',
    description: 'Federal grant compliance monitoring with reporting automation and deadline management',
    longDescription: 'Monitors federal grant compliance including financial reporting, performance metrics, and deliverable tracking. Analyzes grant terms, tracks expenditure compliance, identifies potential audit issues, and generates required federal reports. Ensures compliance with Uniform Guidance (2 CFR 200) and grant-specific requirements.',
    publisher: 'govtech-solutions',
    category: 'security-compliance',
    subcategory: 'Grant Management',
    
    targetIndustries: ['government'],
    complianceStandards: ['Uniform Guidance', 'Federal Grant Requirements'],
    dataRequirements: ['database', 'documents'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'govtech-solutions/grant-compliance',
    version: '1.8.1',
    size: '950 MB',
    lastUpdated: '2024-03-21',
    
    downloads: 167,
    rating: 4.6,
    reviewCount: 12,
    
    pricingModel: 'subscription',
    pricingDescription: '$400/month per grants manager',
    
    egressAllowlist: ['https://sam.gov'],
    requiredPorts: ['8000'],
    securityNotes: 'Grant data processed locally with federal reporting integration.',
    
    tags: ['government', 'federal-grants', 'compliance-tracking', 'financial-reporting', 'audit-preparation'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'public-safety-incident-analyzer',
    name: 'public-safety-incident-analyzer',
    displayName: 'Public Safety Incident Analyzer',
    description: 'Police incident report analysis with pattern detection and resource allocation optimization',
    longDescription: 'Analyzes police incident reports to identify crime patterns, resource allocation needs, and community safety trends. Processes incident narratives, identifies recurring issues, maps crime patterns geographically, and generates intelligence reports for patrol deployment and crime prevention strategies.',
    publisher: 'govtech-solutions',
    category: 'analysis-insights',
    subcategory: 'Public Safety',
    
    targetIndustries: ['government'],
    complianceStandards: ['CJIS Security Policy', 'Law Enforcement Standards'],
    dataRequirements: ['text-only', 'database'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise', 'air-gapped'],
    
    containerImage: 'govtech-solutions/public-safety-analyzer',
    version: '1.5.4',
    size: '1.0 GB',
    lastUpdated: '2024-03-20',
    
    downloads: 234,
    rating: 4.4,
    reviewCount: 15,
    
    pricingModel: 'enterprise',
    pricingDescription: 'Contact for law enforcement pricing',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Criminal justice data processed locally with CJIS compliance.',
    
    tags: ['government', 'public-safety', 'crime-analysis', 'incident-reports', 'law-enforcement'],
    featured: false,
    trending: true,
    new: false,
    
    demoAvailable: false
  },

  {
    id: 'municipal-budget-analyzer',
    name: 'municipal-budget-analyzer',
    displayName: 'Municipal Budget Analysis Agent',
    description: 'Municipal budget analysis with variance tracking and financial planning automation',
    longDescription: 'Analyzes municipal budgets including revenue forecasting, expenditure tracking, and variance analysis. Monitors budget performance against projections, identifies spending trends, and generates financial reports for city councils and public disclosure. Includes capital project tracking and debt service analysis.',
    publisher: 'govtech-solutions',
    category: 'analysis-insights',
    subcategory: 'Municipal Finance',
    
    targetIndustries: ['government'],
    complianceStandards: ['GASB Standards', 'Municipal Accounting'],
    dataRequirements: ['database', 'documents'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'govtech-solutions/budget-analyzer',
    version: '1.6.0',
    size: '820 MB',
    lastUpdated: '2024-03-19',
    
    downloads: 145,
    rating: 4.5,
    reviewCount: 9,
    
    pricingModel: 'subscription',
    pricingDescription: '$300/month per finance director',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Municipal financial data processed locally with public transparency features.',
    
    tags: ['government', 'municipal-budget', 'financial-analysis', 'variance-tracking', 'public-finance'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'regulatory-impact-assessor',
    name: 'regulatory-impact-assessor',
    displayName: 'Regulatory Impact Assessment Agent',
    description: 'Automated regulatory impact analysis for proposed government rules and policies',
    longDescription: 'Conducts regulatory impact assessments for proposed government rules and policies. Analyzes economic impacts, cost-benefit ratios, stakeholder effects, and compliance burdens. Generates structured RIA reports meeting OMB guidelines and identifies potential implementation challenges requiring attention.',
    publisher: 'govtech-solutions',
    category: 'analysis-insights',
    subcategory: 'Policy Analysis',
    
    targetIndustries: ['government'],
    complianceStandards: ['OMB Guidelines', 'Regulatory Analysis'],
    dataRequirements: ['documents', 'database', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-opus'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'govtech-solutions/regulatory-impact',
    version: '1.4.1',
    size: '980 MB',
    lastUpdated: '2024-03-18',
    
    downloads: 89,
    rating: 4.7,
    reviewCount: 6,
    
    pricingModel: 'enterprise',
    pricingDescription: 'Contact for agency pricing',
    
    egressAllowlist: ['https://api.census.gov', 'https://api.bls.gov'],
    requiredPorts: ['8000'],
    securityNotes: 'Policy data processed locally with economic database integration.',
    
    tags: ['government', 'regulatory-impact', 'policy-analysis', 'cost-benefit', 'omb-guidelines'],
    featured: false,
    trending: false,
    new: true,
    
    demoAvailable: false
  },

  {
    id: 'legislative-bill-analyzer',
    name: 'legislative-bill-analyzer',
    displayName: 'Legislative Bill Analysis Agent',
    description: 'Automated analysis of legislative bills with impact assessment and stakeholder identification',
    longDescription: 'Analyzes proposed legislation to identify key provisions, assess potential impacts on government operations, and identify affected stakeholder groups. Compares bills against existing laws, identifies conflicts or redundancies, and generates legislative analysis reports for policymakers and agency leadership.',
    publisher: 'govtech-solutions',
    category: 'analysis-insights',
    subcategory: 'Legislative Analysis',
    
    targetIndustries: ['government'],
    complianceStandards: ['Legislative Process', 'Government Operations'],
    dataRequirements: ['documents', 'text-only'],
    modelRequirements: ['claude-3-5-sonnet', 'gpt-4'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'govtech-solutions/legislative-analyzer',
    version: '1.3.2',
    size: '750 MB',
    lastUpdated: '2024-03-16',
    
    downloads: 123,
    rating: 4.6,
    reviewCount: 8,
    
    pricingModel: 'subscription',
    pricingDescription: '$400/month per policy analyst',
    
    egressAllowlist: ['https://api.congress.gov'],
    requiredPorts: ['8000'],
    securityNotes: 'Legislative data processed locally with policy impact analysis.',
    
    tags: ['government', 'legislative-analysis', 'bill-tracking', 'policy-impact', 'stakeholder-analysis'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'security-clearance-adjudicator',
    name: 'security-clearance-adjudicator',
    displayName: 'Security Clearance Adjudication Assistant',
    description: 'Security clearance investigation analysis with risk assessment and adjudication recommendations',
    longDescription: 'Assists in security clearance adjudication by analyzing background investigation reports, identifying potential security concerns, and providing risk-based adjudication recommendations. Reviews financial history, foreign contacts, and behavioral patterns against clearance criteria while maintaining investigative confidentiality.',
    publisher: 'govtech-solutions',
    category: 'security-compliance',
    subcategory: 'Security Clearance',
    
    targetIndustries: ['government'],
    complianceStandards: ['Security Executive Agent Directive', 'Adjudicative Guidelines'],
    dataRequirements: ['documents', 'database'],
    modelRequirements: ['gpt-4', 'claude-3-opus'],
    deploymentTypes: ['air-gapped'],
    
    containerImage: 'govtech-solutions/clearance-adjudicator',
    version: '1.2.1',
    size: '1.4 GB',
    lastUpdated: '2024-03-15',
    
    downloads: 67,
    rating: 4.9,
    reviewCount: 4,
    
    pricingModel: 'enterprise',
    pricingDescription: 'Contact for security clearance pricing',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Clearance data processed in air-gapped environment with classification protection.',
    
    tags: ['government', 'security-clearance', 'background-investigations', 'adjudication', 'national-security'],
    featured: true,
    trending: false,
    new: true,
    
    demoAvailable: false
  },

  {
    id: 'government-form-digitization-agent',
    name: 'government-form-digitization-agent',
    displayName: 'Government Form Digitization Agent',
    description: 'Automated processing of government forms with data extraction and validation',
    longDescription: 'Processes various government forms including tax documents, permit applications, and regulatory filings. Validates data accuracy, flags missing information, extracts structured data for processing systems, and ensures compliance with relevant regulations. Supports both paper and digital form processing.',
    publisher: 'agentsystems',
    category: 'data-processing',
    subcategory: 'Form Processing',
    
    targetIndustries: ['government'],
    complianceStandards: ['Government Paperwork Standards', 'Data Accuracy Requirements'],
    dataRequirements: ['documents', 'images', 'text-only'],
    modelRequirements: ['multimodal', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise', 'air-gapped'],
    
    containerImage: 'agentsystems/gov-form-processor',
    version: '1.8.3',
    size: '1.3 GB',
    lastUpdated: '2024-03-23',
    
    downloads: 345,
    rating: 4.4,
    reviewCount: 19,
    
    pricingModel: 'usage-based',
    pricingDescription: '$2 per form processed',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Form data processed locally with validation and accuracy checking.',
    
    tags: ['government', 'form-processing', 'data-extraction', 'document-digitization', 'validation'],
    featured: false,
    trending: true,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'public-meeting-transcript-analyzer',
    name: 'public-meeting-transcript-analyzer',
    displayName: 'Public Meeting Transcript Analyzer',
    description: 'Government meeting transcript analysis with action item extraction and public record generation',
    longDescription: 'Analyzes government meeting transcripts including city council, school board, and planning commission meetings. Extracts action items, voting records, and key decisions. Generates meeting minutes, identifies follow-up requirements, and creates searchable public records for transparency compliance.',
    publisher: 'govtech-solutions',
    category: 'data-processing',
    subcategory: 'Public Meetings',
    
    targetIndustries: ['government'],
    complianceStandards: ['Open Meeting Laws', 'Public Records'],
    dataRequirements: ['text-only', 'documents'],
    modelRequirements: ['claude-3-5-sonnet', 'gpt-4'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'govtech-solutions/meeting-analyzer',
    version: '1.5.2',
    size: '680 MB',
    lastUpdated: '2024-03-17',
    
    downloads: 267,
    rating: 4.3,
    reviewCount: 14,
    
    pricingModel: 'subscription',
    pricingDescription: '$150/month per clerk + $5 per meeting',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Meeting transcripts processed locally with public record formatting.',
    
    tags: ['government', 'meeting-transcripts', 'action-items', 'public-records', 'transparency'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'census-data-processor',
    name: 'census-data-processor',
    displayName: 'Census Data Processing Agent',
    description: 'Census and demographic data processing with redistricting analysis and population forecasting',
    longDescription: 'Processes census and demographic data for redistricting, resource allocation, and population analysis. Analyzes demographic trends, generates redistricting maps, calculates population projections, and ensures compliance with voting rights requirements. Supports both decennial census and American Community Survey data.',
    publisher: 'govtech-solutions',
    category: 'data-processing',
    subcategory: 'Demographics',
    
    targetIndustries: ['government'],
    complianceStandards: ['Voting Rights Act', 'Census Requirements'],
    dataRequirements: ['database', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'govtech-solutions/census-processor',
    version: '2.0.0',
    size: '1.1 GB',
    lastUpdated: '2024-03-22',
    
    downloads: 156,
    rating: 4.7,
    reviewCount: 11,
    
    pricingModel: 'enterprise',
    pricingDescription: 'Contact for redistricting pricing',
    
    egressAllowlist: ['https://api.census.gov'],
    requiredPorts: ['8000'],
    securityNotes: 'Census data processed locally with voting rights compliance validation.',
    
    tags: ['government', 'census-data', 'redistricting', 'demographics', 'population-analysis'],
    featured: false,
    trending: false,
    new: true,
    
    demoAvailable: false
  },

  {
    id: 'government-procurement-analyzer',
    name: 'government-procurement-analyzer',
    displayName: 'Government Procurement Analysis Agent',
    description: 'Government procurement analysis with vendor evaluation and bid scoring automation',
    longDescription: 'Analyzes government procurement processes including bid evaluations, vendor qualifications, and contract awards. Scores proposals against evaluation criteria, identifies potential conflicts of interest, and ensures compliance with procurement regulations. Generates procurement recommendations with justification documentation.',
    publisher: 'govtech-solutions',
    category: 'analysis-insights',
    subcategory: 'Procurement',
    
    targetIndustries: ['government'],
    complianceStandards: ['FAR', 'Procurement Regulations'],
    dataRequirements: ['documents', 'database'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'govtech-solutions/procurement-analyzer',
    version: '1.7.1',
    size: '900 MB',
    lastUpdated: '2024-03-21',
    
    downloads: 178,
    rating: 4.5,
    reviewCount: 12,
    
    pricingModel: 'subscription',
    pricingDescription: '$450/month per procurement officer',
    
    egressAllowlist: ['https://sam.gov'],
    requiredPorts: ['8000'],
    securityNotes: 'Procurement data processed locally with vendor database integration.',
    
    tags: ['government', 'procurement', 'bid-evaluation', 'vendor-analysis', 'contract-awards'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'environmental-permit-tracker',
    name: 'environmental-permit-tracker',
    displayName: 'Environmental Permit Tracking Agent',
    description: 'Environmental permit compliance monitoring with renewal tracking and violation detection',
    longDescription: 'Monitors environmental permits including air quality, water discharge, and waste management permits. Tracks compliance with permit conditions, identifies potential violations, manages renewal timelines, and generates compliance reports for environmental agencies. Includes inspection preparation and remediation planning.',
    publisher: 'govtech-solutions',
    category: 'security-compliance',
    subcategory: 'Environmental Compliance',
    
    targetIndustries: ['government'],
    complianceStandards: ['EPA Regulations', 'Environmental Permits'],
    dataRequirements: ['database', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'govtech-solutions/environmental-tracker',
    version: '1.9.0',
    size: '850 MB',
    lastUpdated: '2024-03-20',
    
    downloads: 123,
    rating: 4.6,
    reviewCount: 8,
    
    pricingModel: 'subscription',
    pricingDescription: '$350/month per environmental specialist',
    
    egressAllowlist: ['https://api.epa.gov'],
    requiredPorts: ['8000'],
    securityNotes: 'Environmental data processed locally with EPA database integration.',
    
    tags: ['government', 'environmental-permits', 'compliance-monitoring', 'epa', 'permit-tracking'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  }
]