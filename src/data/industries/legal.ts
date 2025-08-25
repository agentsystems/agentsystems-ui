/**
 * Professional Legal Industry Agents
 * 
 * Comprehensive legal workflow automation agents for law firms, corporate legal departments,
 * and government legal offices. Each agent addresses specific legal job functions with
 * attorney-client privilege protection and measurable efficiency gains.
 */

import type { MarketplaceAgent } from '../types'

export const LEGAL_AGENTS: MarketplaceAgent[] = [
  // Contract Analysis and Drafting
  {
    id: 'contract-risk-analysis-engine',
    name: 'contract-risk-analysis-engine',
    displayName: 'Contract Risk Analysis Engine',
    description: 'Comprehensive legal contract risk assessment with clause-level analysis and liability scoring',
    longDescription: 'Performs detailed risk analysis of legal contracts by examining individual clauses, identifying unusual terms, assessing liability exposure, and flagging non-standard provisions. Analyzes contracts against industry standards, regulatory requirements, and firm precedents. Provides risk scoring for different contract elements and suggests mitigation strategies. Reduces contract review time by 50-70% while improving risk identification.',
    publisher: 'fintech-solutions',
    category: 'analysis-insights',
    subcategory: 'Contract Analysis',
    
    targetIndustries: ['legal'],
    complianceStandards: ['Legal Ethics', 'Contract Law'],
    dataRequirements: ['documents', 'text-only'],
    modelRequirements: ['claude-3-5-sonnet', 'gpt-4'],
    deploymentTypes: ['on-premise', 'cloud'],
    
    containerImage: 'fintech-solutions/contract-risk-engine',
    version: '2.8.0',
    size: '1.3 GB',
    lastUpdated: '2024-03-25',
    
    downloads: 2340,
    rating: 4.8,
    reviewCount: 156,
    
    pricingModel: 'usage-based',
    pricingDescription: '$15 per contract analyzed',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Contract analysis performed locally with attorney-client privilege protection.',
    
    tags: ['legal', 'contract-analysis', 'risk-assessment', 'due-diligence', 'liability'],
    featured: true,
    trending: true,
    new: false,
    
    demoAvailable: true,
    sampleInput: '{"contract_type": "service_agreement", "document": "This Agreement governs..."}',
    sampleOutput: '{"risk_score": 7.2, "high_risk_clauses": ["unlimited liability", "automatic renewal"], "recommendations": ["Add liability cap", "Include termination notice"]}'
  },

  {
    id: 'legal-document-drafter-specialist',
    name: 'legal-document-drafter-specialist',
    displayName: 'Legal Document Drafting Specialist',
    description: 'Automated legal document generation with jurisdiction-specific templates and clause libraries',
    longDescription: 'Comprehensive legal document drafting system that generates contracts, NDAs, employment agreements, and legal filings based on client requirements and attorney specifications. Includes extensive clause libraries, jurisdiction-specific templates, compliance checking, and version control. Reduces document drafting time by 60-80% while ensuring consistency and accuracy.',
    publisher: 'fintech-solutions',
    category: 'content-generation',
    subcategory: 'Document Drafting',
    
    targetIndustries: ['legal'],
    complianceStandards: ['Legal Ethics', 'Professional Responsibility'],
    dataRequirements: ['text-only'],
    modelRequirements: ['claude-3-5-sonnet', 'gpt-4'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'fintech-solutions/legal-drafter',
    version: '2.1.4',
    size: '920 MB',
    lastUpdated: '2024-03-23',
    
    downloads: 1890,
    rating: 4.7,
    reviewCount: 123,
    
    pricingModel: 'usage-based',
    pricingDescription: '$25 per document generated',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'All legal documents processed locally with attorney-client privilege protection.',
    
    tags: ['legal', 'document-drafting', 'contracts', 'agreements', 'legal-writing'],
    featured: true,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'merger-acquisition-due-diligence',
    name: 'merger-acquisition-due-diligence',
    displayName: 'M&A Due Diligence Document Analyzer',
    description: 'Automated analysis of M&A due diligence documents with risk flagging and data extraction',
    longDescription: 'Analyzes merger and acquisition due diligence documents including financial statements, contracts, intellectual property portfolios, and regulatory filings. Extracts key terms, identifies potential deal risks, flags regulatory concerns, and generates comprehensive due diligence summaries. Reduces due diligence review time by 40-60% while improving thoroughness.',
    publisher: 'fintech-solutions',
    category: 'analysis-insights',
    subcategory: 'M&A Due Diligence',
    
    targetIndustries: ['legal'],
    complianceStandards: ['Securities Regulations', 'Antitrust Law'],
    dataRequirements: ['documents', 'database'],
    modelRequirements: ['claude-3-5-sonnet', 'gpt-4'],
    deploymentTypes: ['on-premise', 'air-gapped'],
    
    containerImage: 'fintech-solutions/ma-due-diligence',
    version: '1.6.2',
    size: '1.4 GB',
    lastUpdated: '2024-03-21',
    
    downloads: 234,
    rating: 4.9,
    reviewCount: 18,
    
    pricingModel: 'usage-based',
    pricingDescription: '$200 per due diligence package analyzed',
    
    egressAllowlist: ['https://api.sec.gov'],
    requiredPorts: ['8000'],
    securityNotes: 'Due diligence documents processed locally with SEC database validation.',
    
    tags: ['legal', 'mergers-acquisitions', 'due-diligence', 'deal-analysis', 'risk-assessment'],
    featured: false,
    trending: true,
    new: false,
    
    demoAvailable: false
  },

  // Legal Research and Case Analysis
  {
    id: 'legal-research-specialist',
    name: 'legal-research-specialist',
    displayName: 'Legal Research Specialist Agent',
    description: 'AI-powered legal research with case law analysis, precedent identification, and research memos',
    longDescription: 'Conducts comprehensive legal research by analyzing case law, statutes, regulations, and legal precedents relevant to specific legal issues. Provides structured research memos with cited authorities, relevant case summaries, analysis of legal positions, and strategic recommendations. Includes Shepardizing and citation validation.',
    publisher: 'open-agents',
    category: 'analysis-insights',
    subcategory: 'Legal Research',
    
    targetIndustries: ['legal'],
    complianceStandards: ['Legal Research Standards', 'Citation Requirements'],
    dataRequirements: ['api-access', 'documents'],
    modelRequirements: ['claude-3-opus', 'gpt-4'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'openagents/legal-research-specialist',
    version: '2.4.1',
    size: '1.6 GB',
    lastUpdated: '2024-03-24',
    
    downloads: 3450,
    rating: 4.6,
    reviewCount: 234,
    
    pricingModel: 'usage-based',
    pricingDescription: '$35 per research request',
    
    egressAllowlist: ['https://api.westlaw.com', 'https://api.lexisnexis.com'],
    requiredPorts: ['8000'],
    securityNotes: 'Legal research with secure legal database integration and citation validation.',
    
    tags: ['legal', 'legal-research', 'case-law', 'precedent-analysis', 'research-memos'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'case-law-citator-validator',
    name: 'case-law-citator-validator',
    displayName: 'Case Law Citation Validator',
    description: 'Automated citation checking and case law validation with authority verification',
    longDescription: 'Validates legal citations in briefs, memos, and legal documents by checking case law authority, verifying citation accuracy, and identifying overruled or distinguished cases. Performs comprehensive Shepardizing equivalent analysis and suggests stronger authorities where available. Ensures citation accuracy and legal authority validation.',
    publisher: 'open-agents',
    category: 'data-processing',
    subcategory: 'Citation Validation',
    
    targetIndustries: ['legal'],
    complianceStandards: ['Citation Standards', 'Bluebook Rules'],
    dataRequirements: ['api-access', 'text-only'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['cloud'],
    
    containerImage: 'openagents/citation-validator',
    version: '1.9.0',
    size: '870 MB',
    lastUpdated: '2024-03-20',
    
    downloads: 1560,
    rating: 4.5,
    reviewCount: 89,
    
    pricingModel: 'usage-based',
    pricingDescription: '$10 per document validated',
    
    egressAllowlist: ['https://api.westlaw.com', 'https://api.lexisnexis.com'],
    requiredPorts: ['8000'],
    securityNotes: 'Citation validation with secure legal database access.',
    
    tags: ['legal', 'citation-checking', 'case-law-validation', 'shepardizing', 'legal-authority'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  // Litigation Support and Discovery
  {
    id: 'litigation-document-reviewer',
    name: 'litigation-document-reviewer',
    displayName: 'Litigation Document Review Agent',
    description: 'AI-powered document review for litigation discovery with privilege protection and relevance scoring',
    longDescription: 'Performs initial document review for litigation discovery processes by analyzing documents for relevance, responsiveness, and privilege. Identifies potentially privileged communications, classifies documents by relevance, flags sensitive materials requiring attorney review, and generates privilege logs. Reduces document review costs by 70-90%.',
    publisher: 'fintech-solutions',
    category: 'data-processing',
    subcategory: 'Document Review',
    
    targetIndustries: ['legal'],
    complianceStandards: ['Attorney-Client Privilege', 'Discovery Rules'],
    dataRequirements: ['documents', 'text-only'],
    modelRequirements: ['claude-3-5-sonnet', 'gpt-4'],
    deploymentTypes: ['on-premise', 'air-gapped'],
    
    containerImage: 'fintech-solutions/litigation-reviewer',
    version: '2.5.1',
    size: '1.5 GB',
    lastUpdated: '2024-03-22',
    
    downloads: 892,
    rating: 4.5,
    reviewCount: 67,
    
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
  },

  {
    id: 'deposition-transcript-analyzer',
    name: 'deposition-transcript-analyzer',
    displayName: 'Deposition Transcript Analysis Agent',
    description: 'AI analysis of deposition transcripts with key fact extraction and inconsistency identification',
    longDescription: 'Analyzes deposition transcripts to extract key facts, identify inconsistencies with other testimony or documents, highlight admissions, and generate summary reports. Creates searchable fact databases, identifies impeachment opportunities, and generates examination outlines for follow-up questioning.',
    publisher: 'fintech-solutions',
    category: 'analysis-insights',
    subcategory: 'Litigation Analysis',
    
    targetIndustries: ['legal'],
    complianceStandards: ['Court Rules', 'Evidence Rules'],
    dataRequirements: ['documents', 'text-only'],
    modelRequirements: ['claude-3-5-sonnet', 'gpt-4'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'fintech-solutions/deposition-analyzer',
    version: '1.4.3',
    size: '890 MB',
    lastUpdated: '2024-03-19',
    
    downloads: 445,
    rating: 4.7,
    reviewCount: 29,
    
    pricingModel: 'usage-based',
    pricingDescription: '$50 per deposition transcript analyzed',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Deposition analysis performed locally with litigation privilege protection.',
    
    tags: ['legal', 'deposition-analysis', 'litigation-support', 'fact-extraction', 'testimony-review'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'legal-brief-writing-assistant',
    name: 'legal-brief-writing-assistant',
    displayName: 'Legal Brief Writing Assistant',
    description: 'AI-powered legal brief drafting with argument structure and citation integration',
    longDescription: 'Assists attorneys in drafting legal briefs by structuring legal arguments, integrating relevant case law citations, and ensuring proper legal writing format. Analyzes case facts against legal precedents, suggests argument strategies, and generates initial draft sections requiring attorney review and refinement.',
    publisher: 'open-agents',
    category: 'content-generation',
    subcategory: 'Legal Writing',
    
    targetIndustries: ['legal'],
    complianceStandards: ['Court Rules', 'Legal Writing Standards'],
    dataRequirements: ['text-only', 'api-access'],
    modelRequirements: ['claude-3-opus', 'gpt-4'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'openagents/brief-writing-assistant',
    version: '1.8.2',
    size: '1.1 GB',
    lastUpdated: '2024-03-21',
    
    downloads: 1240,
    rating: 4.4,
    reviewCount: 78,
    
    pricingModel: 'subscription',
    pricingDescription: '$200/month per attorney',
    
    egressAllowlist: ['https://api.westlaw.com', 'https://api.lexisnexis.com'],
    requiredPorts: ['8000'],
    securityNotes: 'Legal briefs processed locally with secure legal database integration.',
    
    tags: ['legal', 'brief-writing', 'legal-arguments', 'litigation', 'legal-writing'],
    featured: false,
    trending: true,
    new: false,
    
    demoAvailable: true
  },

  // Intellectual Property Management
  {
    id: 'patent-prior-art-search-engine',
    name: 'patent-prior-art-search-engine',
    displayName: 'Patent Prior Art Search Engine',
    description: 'Advanced AI search for patent prior art with comprehensive analysis and claim mapping',
    longDescription: 'Specialized patent research agent that conducts comprehensive prior art searches across global patent databases, academic publications, and technical literature. Provides detailed analysis reports with relevance scoring, claim mapping, and patentability assessments. Includes freedom-to-operate analysis and competitive landscape mapping.',
    publisher: 'open-agents',
    category: 'analysis-insights',
    subcategory: 'Intellectual Property',
    
    targetIndustries: ['legal', 'technology'],
    complianceStandards: ['USPTO Rules', 'Patent Law'],
    dataRequirements: ['api-access', 'documents'],
    modelRequirements: ['gpt-4', 'claude-3-opus'],
    deploymentTypes: ['cloud'],
    
    containerImage: 'openagents/patent-prior-art',
    version: '2.3.0',
    size: '1.8 GB',
    lastUpdated: '2024-03-24',
    
    downloads: 567,
    rating: 4.6,
    reviewCount: 34,
    
    pricingModel: 'usage-based',
    pricingDescription: '$75 per comprehensive search',
    
    egressAllowlist: ['https://api.uspto.gov', 'https://api.epo.org', 'https://api.wipo.int'],
    requiredPorts: ['8000'],
    securityNotes: 'Patent search with secure global patent database integration.',
    
    tags: ['legal', 'patents', 'prior-art', 'intellectual-property', 'patentability'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'trademark-clearance-agent',
    name: 'trademark-clearance-agent',
    displayName: 'Trademark Clearance Search Agent',
    description: 'Comprehensive trademark clearance searches with conflict analysis and registration strategy',
    longDescription: 'Conducts comprehensive trademark clearance searches across federal and state databases, common law sources, and international registries. Analyzes potential conflicts, assesses likelihood of confusion, and provides registration strategy recommendations. Includes domain name availability checking and social media handle verification.',
    publisher: 'open-agents',
    category: 'analysis-insights',
    subcategory: 'Trademark Law',
    
    targetIndustries: ['legal', 'retail', 'technology'],
    complianceStandards: ['USPTO Rules', 'Trademark Law'],
    dataRequirements: ['api-access'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['cloud'],
    
    containerImage: 'openagents/trademark-clearance',
    version: '1.7.1',
    size: '950 MB',
    lastUpdated: '2024-03-18',
    
    downloads: 890,
    rating: 4.5,
    reviewCount: 52,
    
    pricingModel: 'usage-based',
    pricingDescription: '$40 per trademark search',
    
    egressAllowlist: ['https://api.uspto.gov'],
    requiredPorts: ['8000'],
    securityNotes: 'Trademark searches with secure USPTO database integration.',
    
    tags: ['legal', 'trademark', 'clearance-search', 'intellectual-property', 'brand-protection'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  // Employment Law and HR Compliance
  {
    id: 'employment-law-compliance-auditor',
    name: 'employment-law-compliance-auditor',
    displayName: 'Employment Law Compliance Auditor',
    description: 'Automated employment law compliance auditing with policy review and risk assessment',
    longDescription: 'Conducts comprehensive employment law compliance audits by reviewing employee handbooks, policies, practices, and documentation. Identifies potential violations of federal and state employment laws, assesses discrimination risks, and provides remediation recommendations. Includes wage and hour compliance analysis.',
    publisher: 'fintech-solutions',
    category: 'security-compliance',
    subcategory: 'Employment Law',
    
    targetIndustries: ['legal'],
    complianceStandards: ['EEOC', 'FLSA', 'State Employment Laws'],
    dataRequirements: ['documents', 'database'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'fintech-solutions/employment-compliance',
    version: '1.9.2',
    size: '1.0 GB',
    lastUpdated: '2024-03-22',
    
    downloads: 678,
    rating: 4.6,
    reviewCount: 41,
    
    pricingModel: 'subscription',
    pricingDescription: '$400/month per HR legal specialist',
    
    egressAllowlist: ['https://api.eeoc.gov', 'https://api.dol.gov'],
    requiredPorts: ['8000'],
    securityNotes: 'Employee data processed locally with employment law database validation.',
    
    tags: ['legal', 'employment-law', 'hr-compliance', 'discrimination', 'wage-hour'],
    featured: false,
    trending: true,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'workplace-investigation-manager',
    name: 'workplace-investigation-manager',
    displayName: 'Workplace Investigation Management Agent',
    description: 'Structured workplace investigation management with documentation and timeline tracking',
    longDescription: 'Manages workplace investigations including harassment, discrimination, and misconduct allegations. Provides investigation frameworks, tracks timelines, generates interview guides, analyzes witness statements for consistency, and creates comprehensive investigation reports with recommendations.',
    publisher: 'fintech-solutions',
    category: 'integration-automation',
    subcategory: 'Workplace Investigations',
    
    targetIndustries: ['legal'],
    complianceStandards: ['EEOC Investigation Standards', 'Employment Law'],
    dataRequirements: ['documents', 'text-only'],
    modelRequirements: ['claude-3-5-sonnet', 'gpt-4'],
    deploymentTypes: ['on-premise', 'air-gapped'],
    
    containerImage: 'fintech-solutions/investigation-manager',
    version: '1.5.1',
    size: '720 MB',
    lastUpdated: '2024-03-17',
    
    downloads: 234,
    rating: 4.7,
    reviewCount: 16,
    
    pricingModel: 'subscription',
    pricingDescription: '$300/month per HR investigator',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Investigation data processed locally with enhanced confidentiality protection.',
    
    tags: ['legal', 'workplace-investigations', 'hr-compliance', 'documentation', 'misconduct'],
    featured: false,
    trending: false,
    new: true,
    
    demoAvailable: false
  },

  // Regulatory Compliance and Government Relations
  {
    id: 'regulatory-filing-assistant',
    name: 'regulatory-filing-assistant',
    displayName: 'Regulatory Filing Assistant Agent',
    description: 'Automated preparation of regulatory filings with compliance checking and deadline tracking',
    longDescription: 'Assists in preparing regulatory filings for various agencies including SEC, FTC, DOJ, and state regulators. Validates filing requirements, checks document completeness, ensures proper formatting, and tracks submission deadlines. Includes annual report preparation and beneficial ownership reporting.',
    publisher: 'fintech-solutions',
    category: 'data-processing',
    subcategory: 'Regulatory Filings',
    
    targetIndustries: ['legal'],
    complianceStandards: ['SEC Regulations', 'Corporate Filing Requirements'],
    dataRequirements: ['documents', 'database'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'fintech-solutions/regulatory-filing',
    version: '2.0.4',
    size: '950 MB',
    lastUpdated: '2024-03-23',
    
    downloads: 156,
    rating: 4.8,
    reviewCount: 12,
    
    pricingModel: 'subscription',
    pricingDescription: '$500/month per corporate secretary',
    
    egressAllowlist: ['https://api.sec.gov'],
    requiredPorts: ['8000'],
    securityNotes: 'Corporate filings processed locally with SEC validation integration.',
    
    tags: ['legal', 'regulatory-filings', 'sec-compliance', 'corporate-governance', 'deadlines'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'environmental-compliance-monitor',
    name: 'environmental-compliance-monitor',
    displayName: 'Environmental Compliance Monitoring Agent',
    description: 'Environmental law compliance monitoring with permit tracking and violation detection',
    longDescription: 'Monitors environmental compliance by tracking permit requirements, analyzing monitoring data, and identifying potential violations of environmental regulations. Reviews air quality data, water discharge reports, and waste management records against permit limits and regulatory requirements.',
    publisher: 'fintech-solutions',
    category: 'security-compliance',
    subcategory: 'Environmental Law',
    
    targetIndustries: ['legal', 'manufacturing'],
    complianceStandards: ['EPA Regulations', 'Environmental Permits'],
    dataRequirements: ['database', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'fintech-solutions/environmental-compliance',
    version: '1.6.0',
    size: '880 MB',
    lastUpdated: '2024-03-20',
    
    downloads: 123,
    rating: 4.5,
    reviewCount: 8,
    
    pricingModel: 'subscription',
    pricingDescription: '$400/month per environmental lawyer',
    
    egressAllowlist: ['https://api.epa.gov'],
    requiredPorts: ['8000'],
    securityNotes: 'Environmental data processed locally with EPA database integration.',
    
    tags: ['legal', 'environmental-law', 'compliance-monitoring', 'permit-tracking', 'epa'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  // Corporate Law and Securities
  {
    id: 'securities-disclosure-analyzer',
    name: 'securities-disclosure-analyzer',
    displayName: 'Securities Disclosure Analysis Agent',
    description: 'SEC disclosure analysis with materiality assessment and filing compliance validation',
    longDescription: 'Analyzes corporate events and business developments to assess materiality for securities disclosure requirements. Reviews 10-K, 10-Q, and 8-K filings for completeness, identifies disclosure gaps, and ensures compliance with SEC reporting requirements. Includes insider trading compliance monitoring.',
    publisher: 'fintech-solutions',
    category: 'security-compliance',
    subcategory: 'Securities Law',
    
    targetIndustries: ['legal'],
    complianceStandards: ['SEC Regulations', 'Securities Exchange Act'],
    dataRequirements: ['documents', 'database'],
    modelRequirements: ['gpt-4', 'claude-3-opus'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'fintech-solutions/securities-disclosure',
    version: '2.1.1',
    size: '1.2 GB',
    lastUpdated: '2024-03-21',
    
    downloads: 234,
    rating: 4.8,
    reviewCount: 18,
    
    pricingModel: 'subscription',
    pricingDescription: '$800/month per securities lawyer',
    
    egressAllowlist: ['https://api.sec.gov'],
    requiredPorts: ['8000'],
    securityNotes: 'Securities data processed locally with SEC filing validation.',
    
    tags: ['legal', 'securities-law', 'sec-disclosure', 'materiality-assessment', 'compliance'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: false
  },

  {
    id: 'corporate-governance-compliance',
    name: 'corporate-governance-compliance',
    displayName: 'Corporate Governance Compliance Agent',
    description: 'Board governance compliance monitoring with fiduciary duty analysis and meeting management',
    longDescription: 'Monitors corporate governance compliance including board meeting requirements, fiduciary duty obligations, and shareholder rights. Tracks director independence, committee composition, and voting requirements. Generates board resolutions, meeting minutes templates, and governance compliance reports.',
    publisher: 'fintech-solutions',
    category: 'integration-automation',
    subcategory: 'Corporate Governance',
    
    targetIndustries: ['legal'],
    complianceStandards: ['Corporate Law', 'Fiduciary Duties'],
    dataRequirements: ['documents', 'database'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'fintech-solutions/governance-compliance',
    version: '1.4.2',
    size: '780 MB',
    lastUpdated: '2024-03-19',
    
    downloads: 178,
    rating: 4.6,
    reviewCount: 13,
    
    pricingModel: 'subscription',
    pricingDescription: '$500/month per corporate secretary',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Corporate governance data processed locally with board confidentiality protection.',
    
    tags: ['legal', 'corporate-governance', 'board-management', 'fiduciary-duties', 'compliance'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  // Real Estate and Transactional Law
  {
    id: 'real-estate-due-diligence-agent',
    name: 'real-estate-due-diligence-agent',
    displayName: 'Real Estate Due Diligence Agent',
    description: 'Comprehensive real estate transaction due diligence with title and zoning analysis',
    longDescription: 'Performs comprehensive due diligence for real estate transactions by analyzing title reports, surveys, zoning compliance, environmental reports, and lease agreements. Identifies potential issues, assesses transaction risks, and generates due diligence checklists and closing condition recommendations.',
    publisher: 'fintech-solutions',
    category: 'analysis-insights',
    subcategory: 'Real Estate Law',
    
    targetIndustries: ['legal', 'finance', 'retail'],
    complianceStandards: ['Real Estate Law', 'Zoning Regulations'],
    dataRequirements: ['documents', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'fintech-solutions/real-estate-dd',
    version: '1.8.0',
    size: '1.1 GB',
    lastUpdated: '2024-03-20',
    
    downloads: 445,
    rating: 4.4,
    reviewCount: 27,
    
    pricingModel: 'usage-based',
    pricingDescription: '$100 per transaction analyzed',
    
    egressAllowlist: ['https://api.county-records.gov'],
    requiredPorts: ['8000'],
    securityNotes: 'Real estate data processed locally with public records integration.',
    
    tags: ['legal', 'real-estate', 'due-diligence', 'title-analysis', 'zoning'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  // Immigration Law
  {
    id: 'immigration-case-manager',
    name: 'immigration-case-manager',
    displayName: 'Immigration Case Management Agent',
    description: 'Immigration case management with form preparation and deadline tracking',
    longDescription: 'Manages immigration cases by tracking deadlines, preparing USCIS forms, analyzing eligibility requirements, and generating supporting documentation. Monitors case status, identifies required evidence, and ensures compliance with immigration regulations and procedural requirements.',
    publisher: 'open-agents',
    category: 'integration-automation',
    subcategory: 'Immigration Law',
    
    targetIndustries: ['legal'],
    complianceStandards: ['USCIS Regulations', 'Immigration Law'],
    dataRequirements: ['documents', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'openagents/immigration-manager',
    version: '1.6.3',
    size: '850 MB',
    lastUpdated: '2024-03-18',
    
    downloads: 567,
    rating: 4.3,
    reviewCount: 34,
    
    pricingModel: 'subscription',
    pricingDescription: '$250/month per immigration attorney',
    
    egressAllowlist: ['https://api.uscis.gov'],
    requiredPorts: ['8000'],
    securityNotes: 'Immigration case data processed locally with USCIS system integration.',
    
    tags: ['legal', 'immigration-law', 'case-management', 'uscis-forms', 'deadline-tracking'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  // Criminal Law and Compliance
  {
    id: 'criminal-case-discovery-organizer',
    name: 'criminal-case-discovery-organizer',
    displayName: 'Criminal Case Discovery Organizer',
    description: 'Criminal case discovery organization with evidence analysis and Brady material identification',
    longDescription: 'Organizes criminal case discovery materials including police reports, witness statements, forensic evidence, and expert reports. Identifies potential Brady material, organizes evidence chronologically, and generates case timelines. Assists with plea negotiation analysis and sentencing preparation.',
    publisher: 'open-agents',
    category: 'data-processing',
    subcategory: 'Criminal Defense',
    
    targetIndustries: ['legal'],
    complianceStandards: ['Brady Obligations', 'Criminal Procedure Rules'],
    dataRequirements: ['documents', 'text-only'],
    modelRequirements: ['claude-3-5-sonnet', 'gpt-4'],
    deploymentTypes: ['on-premise', 'air-gapped'],
    
    containerImage: 'openagents/criminal-discovery',
    version: '1.4.1',
    size: '920 MB',
    lastUpdated: '2024-03-16',
    
    downloads: 234,
    rating: 4.5,
    reviewCount: 15,
    
    pricingModel: 'subscription',
    pricingDescription: '$300/month per criminal defense attorney',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Criminal case data processed locally with enhanced security protocols.',
    
    tags: ['legal', 'criminal-defense', 'discovery', 'brady-material', 'evidence-organization'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  }
]