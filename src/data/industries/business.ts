/**
 * General Business and Operations Agents
 * 
 * Comprehensive business workflow automation for sales, marketing, operations,
 * and general business functions. Designed for any business size and industry.
 */

import type { MarketplaceAgent } from '../types'

export const BUSINESS_AGENTS: MarketplaceAgent[] = [
  // Sales and CRM Agents
  {
    id: 'lead-qualification-agent',
    name: 'lead-qualification-agent',
    displayName: 'Lead Qualification Agent',
    description: 'AI-powered lead scoring and qualification with automated follow-up recommendations',
    longDescription: 'Analyzes incoming leads from multiple sources to score quality, predict conversion likelihood, and recommend appropriate follow-up actions. Integrates with CRM systems to update lead status, schedule tasks, and route qualified leads to appropriate sales representatives.',
    publisher: 'open-agents',
    category: 'analysis-insights',
    subcategory: 'Sales Operations',
    
    targetIndustries: ['business'],
    complianceStandards: [],
    dataRequirements: ['database', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'openagents/lead-qualifier',
    version: '2.3.1',
    size: '720 MB',
    lastUpdated: '2024-03-24',
    
    downloads: 2340,
    rating: 4.4,
    reviewCount: 127,
    
    pricingModel: 'free',
    pricingDescription: 'Free and open source',
    
    egressAllowlist: ['https://api.salesforce.com', 'https://api.hubspot.com'],
    requiredPorts: ['8000'],
    securityNotes: 'Lead data processed locally with CRM integration.',
    
    tags: ['sales', 'lead-qualification', 'crm', 'conversion-optimization', 'scoring'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'sales-proposal-generator',
    name: 'sales-proposal-generator',
    displayName: 'Sales Proposal Generator',
    description: 'Automated sales proposal creation with pricing optimization and competitive analysis',
    longDescription: 'Generates customized sales proposals by analyzing client requirements, company capabilities, and competitive landscape. Creates professional proposals with appropriate pricing, terms, and deliverables. Includes win/loss analysis and proposal optimization recommendations.',
    publisher: 'open-agents',
    category: 'content-generation',
    subcategory: 'Sales Content',
    
    targetIndustries: ['business'],
    complianceStandards: [],
    dataRequirements: ['text-only', 'documents'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'openagents/proposal-generator',
    version: '1.9.2',
    size: '580 MB',
    lastUpdated: '2024-03-22',
    
    downloads: 1890,
    rating: 4.3,
    reviewCount: 89,
    
    pricingModel: 'free',
    pricingDescription: 'Free and open source',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Proposal content generated locally with competitive intelligence.',
    
    tags: ['sales', 'proposals', 'pricing-optimization', 'competitive-analysis', 'rfp'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'customer-feedback-analyzer',
    name: 'customer-feedback-analyzer',
    displayName: 'Customer Feedback Analysis Agent',
    description: 'Comprehensive customer feedback analysis with sentiment tracking and trend identification',
    longDescription: 'Analyzes customer feedback from surveys, reviews, support tickets, and social media to identify trends, satisfaction drivers, and improvement opportunities. Provides sentiment analysis, topic clustering, and actionable insights for product and service enhancement.',
    publisher: 'open-agents',
    category: 'analysis-insights',
    subcategory: 'Customer Intelligence',
    
    targetIndustries: ['business'],
    complianceStandards: [],
    dataRequirements: ['text-only', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'openagents/feedback-analyzer',
    version: '2.0.3',
    size: '640 MB',
    lastUpdated: '2024-03-21',
    
    downloads: 1560,
    rating: 4.5,
    reviewCount: 78,
    
    pricingModel: 'free',
    pricingDescription: 'Free and open source',
    
    egressAllowlist: ['https://api.trustpilot.com', 'https://api.zendesk.com'],
    requiredPorts: ['8000'],
    securityNotes: 'Customer feedback processed locally with review platform integration.',
    
    tags: ['sales', 'customer-feedback', 'sentiment-analysis', 'product-improvement', 'reviews'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  // Marketing and Content Agents
  {
    id: 'social-media-content-creator',
    name: 'social-media-content-creator',
    displayName: 'Social Media Content Creator',
    description: 'AI-powered social media content creation with brand voice consistency and scheduling',
    longDescription: 'Creates brand-consistent social media content across multiple platforms including posts, captions, and engagement responses. Maintains brand voice, optimizes for platform-specific algorithms, and schedules content for maximum engagement. Includes hashtag optimization and competitor analysis.',
    publisher: 'open-agents',
    category: 'content-generation',
    subcategory: 'Social Media Marketing',
    
    targetIndustries: ['business'],
    complianceStandards: [],
    dataRequirements: ['text-only', 'images', 'api-access'],
    modelRequirements: ['multimodal', 'gpt-4'],
    deploymentTypes: ['cloud'],
    
    containerImage: 'openagents/social-creator',
    version: '2.4.0',
    size: '780 MB',
    lastUpdated: '2024-03-25',
    
    downloads: 4200,
    rating: 4.2,
    reviewCount: 234,
    
    pricingModel: 'free',
    pricingDescription: 'Free and open source',
    
    egressAllowlist: ['https://api.instagram.com', 'https://api.twitter.com', 'https://graph.facebook.com'],
    requiredPorts: ['8000'],
    securityNotes: 'Content created locally with secure platform integration.',
    
    tags: ['marketing', 'social-media', 'content-creation', 'brand-management', 'automation'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'email-campaign-optimizer',
    name: 'email-campaign-optimizer',
    displayName: 'Email Campaign Optimizer',
    description: 'Email marketing optimization with A/B testing, personalization, and deliverability analysis',
    longDescription: 'Optimizes email marketing campaigns through A/B testing of subject lines, content personalization, send time optimization, and deliverability analysis. Provides detailed analytics on open rates, click-through rates, and conversion optimization with automated recommendations.',
    publisher: 'open-agents',
    category: 'analysis-insights',
    subcategory: 'Email Marketing',
    
    targetIndustries: ['business'],
    complianceStandards: [],
    dataRequirements: ['text-only', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['cloud'],
    
    containerImage: 'openagents/email-optimizer',
    version: '1.7.3',
    size: '590 MB',
    lastUpdated: '2024-03-23',
    
    downloads: 1780,
    rating: 4.3,
    reviewCount: 94,
    
    pricingModel: 'free',
    pricingDescription: 'Free and open source',
    
    egressAllowlist: ['https://api.sendgrid.com', 'https://api.mailchimp.com'],
    requiredPorts: ['8000'],
    securityNotes: 'Email content processed locally with platform integration.',
    
    tags: ['marketing', 'email-campaigns', 'ab-testing', 'personalization', 'deliverability'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'seo-content-optimizer',
    name: 'seo-content-optimizer',
    displayName: 'SEO Content Optimization Agent',
    description: 'Content optimization for search engines with keyword analysis and ranking improvement',
    longDescription: 'Optimizes web content for search engines by analyzing keyword density, competitor content, search intent, and ranking factors. Provides content recommendations, meta tag optimization, and technical SEO suggestions to improve search visibility and organic traffic.',
    publisher: 'open-agents',
    category: 'content-generation',
    subcategory: 'SEO Optimization',
    
    targetIndustries: ['business'],
    complianceStandards: [],
    dataRequirements: ['text-only', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['cloud'],
    
    containerImage: 'openagents/seo-optimizer',
    version: '2.1.1',
    size: '650 MB',
    lastUpdated: '2024-03-20',
    
    downloads: 2100,
    rating: 4.1,
    reviewCount: 112,
    
    pricingModel: 'free',
    pricingDescription: 'Free and open source',
    
    egressAllowlist: ['https://api.semrush.com', 'https://api.ahrefs.com'],
    requiredPorts: ['8000'],
    securityNotes: 'Content analysis with secure SEO tool integration.',
    
    tags: ['marketing', 'seo', 'content-optimization', 'keyword-analysis', 'search-ranking'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  // Operations and Productivity Agents
  {
    id: 'inventory-demand-forecaster',
    name: 'inventory-demand-forecaster',
    displayName: 'Inventory Demand Forecasting Agent',
    description: 'AI-powered inventory forecasting with demand planning and stock optimization',
    longDescription: 'Analyzes sales history, seasonal patterns, and market trends to forecast inventory demand and optimize stock levels. Provides reorder recommendations, identifies slow-moving inventory, and suggests pricing strategies to improve inventory turnover.',
    publisher: 'open-agents',
    category: 'analysis-insights',
    subcategory: 'Inventory Management',
    
    targetIndustries: ['business'],
    complianceStandards: [],
    dataRequirements: ['database', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'openagents/inventory-forecaster',
    version: '1.8.2',
    size: '820 MB',
    lastUpdated: '2024-03-21',
    
    downloads: 890,
    rating: 4.4,
    reviewCount: 56,
    
    pricingModel: 'free',
    pricingDescription: '$150/month + $0.05 per SKU',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Inventory data processed locally with sales platform integration.',
    
    tags: ['retail', 'inventory-management', 'demand-forecasting', 'stock-optimization', 'analytics'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'competitor-price-monitor',
    name: 'competitor-price-monitor',
    displayName: 'Competitive Pricing Monitor',
    description: 'Automated competitor price monitoring with dynamic pricing recommendations',
    longDescription: 'Monitors competitor pricing across multiple channels and provides dynamic pricing recommendations based on market conditions, inventory levels, and business objectives. Includes price elasticity analysis and margin optimization suggestions.',
    publisher: 'open-agents',
    category: 'analysis-insights',
    subcategory: 'Pricing Strategy',
    
    targetIndustries: ['business'],
    complianceStandards: [],
    dataRequirements: ['api-access'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['cloud'],
    
    containerImage: 'openagents/price-monitor',
    version: '2.0.4',
    size: '690 MB',
    lastUpdated: '2024-03-22',
    
    downloads: 1240,
    rating: 4.3,
    reviewCount: 67,
    
    pricingModel: 'free',
    pricingDescription: '$200/month per pricing manager',
    
    egressAllowlist: ['https://api.shopify.com', 'https://api.amazon.com'],
    requiredPorts: ['8000'],
    securityNotes: 'Pricing data collected via public APIs with competitive intelligence.',
    
    tags: ['retail', 'competitive-pricing', 'price-monitoring', 'dynamic-pricing', 'margin-optimization'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'customer-service-chatbot',
    name: 'customer-service-chatbot',
    displayName: 'Customer Service Chatbot Agent',
    description: 'Intelligent customer service automation with escalation and knowledge base integration',
    longDescription: 'Handles customer service inquiries through intelligent chatbot interactions. Integrates with knowledge bases, order systems, and support tickets to provide accurate responses. Escalates complex issues to human agents while handling routine inquiries automatically.',
    publisher: 'open-agents',
    category: 'integration-automation',
    subcategory: 'Customer Support',
    
    targetIndustries: ['business'],
    complianceStandards: [],
    dataRequirements: ['text-only', 'database', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'openagents/cs-chatbot',
    version: '2.2.1',
    size: '750 MB',
    lastUpdated: '2024-03-24',
    
    downloads: 3200,
    rating: 4.1,
    reviewCount: 178,
    
    pricingModel: 'free',
    pricingDescription: '$150/month per support agent replaced',
    
    egressAllowlist: ['https://api.zendesk.com', 'https://api.intercom.com'],
    requiredPorts: ['8000'],
    securityNotes: 'Customer interactions processed locally with support system integration.',
    
    tags: ['retail', 'customer-service', 'chatbot', 'support-automation', 'escalation'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  // HR and Workforce Management
  {
    id: 'employee-onboarding-assistant',
    name: 'employee-onboarding-assistant',
    displayName: 'Employee Onboarding Assistant',
    description: 'Automated employee onboarding with task management and document collection',
    longDescription: 'Streamlines employee onboarding by managing task checklists, collecting required documents, scheduling training sessions, and tracking completion status. Provides new hire guidance and ensures consistent onboarding experience across all departments.',
    publisher: 'open-agents',
    category: 'integration-automation',
    subcategory: 'Human Resources',
    
    targetIndustries: ['business'],
    complianceStandards: [],
    dataRequirements: ['documents', 'database'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'openagents/onboarding-assistant',
    version: '1.6.1',
    size: '480 MB',
    lastUpdated: '2024-03-19',
    
    downloads: 1340,
    rating: 4.4,
    reviewCount: 67,
    
    pricingModel: 'free',
    pricingDescription: 'Free for small teams, paid tiers for larger organizations',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Employee data processed locally with privacy protection.',
    
    tags: ['hr', 'employee-onboarding', 'task-management', 'document-collection', 'training'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'performance-review-assistant',
    name: 'performance-review-assistant',
    displayName: 'Performance Review Assistant',
    description: 'Automated performance review preparation with goal tracking and feedback analysis',
    longDescription: 'Assists in performance review processes by tracking employee goals, analyzing performance metrics, and generating review templates. Provides 360-degree feedback compilation, identifies development opportunities, and ensures consistent evaluation criteria across teams.',
    publisher: 'open-agents',
    category: 'analysis-insights',
    subcategory: 'Performance Management',
    
    targetIndustries: ['business'],
    complianceStandards: [],
    dataRequirements: ['database', 'text-only'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise', 'cloud'],
    
    containerImage: 'openagents/performance-review',
    version: '1.4.3',
    size: '520 MB',
    lastUpdated: '2024-03-18',
    
    downloads: 890,
    rating: 4.2,
    reviewCount: 45,
    
    pricingModel: 'free',
    pricingDescription: '$50/month per manager',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Performance data processed locally with confidentiality protection.',
    
    tags: ['hr', 'performance-reviews', 'goal-tracking', 'feedback-analysis', 'employee-development'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  // Finance and Accounting (General Business)
  {
    id: 'invoice-processing-agent',
    name: 'invoice-processing-agent',
    displayName: 'Invoice Processing Agent',
    description: 'Automated invoice processing with approval routing and payment scheduling',
    longDescription: 'Automates invoice processing workflows including data extraction, approval routing, duplicate detection, and payment scheduling. Integrates with accounting systems, validates vendor information, and tracks payment status. Reduces processing time while maintaining financial controls.',
    publisher: 'open-agents',
    category: 'data-processing',
    subcategory: 'Accounts Payable',
    
    targetIndustries: ['business'],
    complianceStandards: [],
    dataRequirements: ['documents', 'images', 'database'],
    modelRequirements: ['multimodal', 'gpt-4'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'openagents/invoice-processor',
    version: '2.1.2',
    size: '920 MB',
    lastUpdated: '2024-03-23',
    
    downloads: 2890,
    rating: 4.5,
    reviewCount: 156,
    
    pricingModel: 'free',
    pricingDescription: '$0.50 per invoice processed',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Invoice data processed locally with financial system integration.',
    
    tags: ['finance', 'invoice-processing', 'accounts-payable', 'workflow-automation', 'approval'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'budget-variance-analyzer',
    name: 'budget-variance-analyzer',
    displayName: 'Budget Variance Analysis Agent',
    description: 'Automated budget variance analysis with forecasting and alert management',
    longDescription: 'Analyzes budget performance by comparing actual vs. planned expenditures, identifying variances, and providing explanatory analysis. Generates variance reports, forecasts year-end performance, and provides early warning alerts for budget overruns.',
    publisher: 'open-agents',
    category: 'analysis-insights',
    subcategory: 'Budget Management',
    
    targetIndustries: ['business'],
    complianceStandards: [],
    dataRequirements: ['database'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise', 'cloud'],
    
    containerImage: 'openagents/budget-analyzer',
    version: '1.5.1',
    size: '560 MB',
    lastUpdated: '2024-03-20',
    
    downloads: 1120,
    rating: 4.2,
    reviewCount: 67,
    
    pricingModel: 'free',
    pricingDescription: '$100/month per finance manager',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Budget data processed locally with forecasting and alerts.',
    
    tags: ['finance', 'budget-analysis', 'variance-reporting', 'forecasting', 'financial-planning'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  }
]