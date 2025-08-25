// Extended agent database - this will be inserted into the main file
export const ADDITIONAL_AGENTS = [
  // More Finance Agents
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

  // Legal Agents
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
];