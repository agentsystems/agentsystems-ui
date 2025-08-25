/**
 * Professional Healthcare Industry Agents
 * 
 * Comprehensive healthcare workflow automation agents for clinical, administrative,
 * and regulatory functions. Each agent addresses specific healthcare job functions
 * with HIPAA compliance and measurable clinical/operational value.
 */

import type { MarketplaceAgent } from '../types'

export const HEALTHCARE_AGENTS: MarketplaceAgent[] = [
  // Clinical Decision Support Agents
  {
    id: 'clinical-decision-support-primary-care',
    name: 'clinical-decision-support-primary-care',
    displayName: 'Primary Care Clinical Decision Support',
    description: 'Evidence-based diagnostic and treatment recommendations for primary care physicians',
    longDescription: 'Provides evidence-based clinical decision support specifically designed for primary care settings. Analyzes patient symptoms, medical history, and diagnostic test results against current medical literature and clinical guidelines. Offers differential diagnosis suggestions, treatment recommendations, and referral guidance while maintaining physician oversight for all clinical decisions. Reduces diagnostic time by 30-40% while improving care consistency.',
    publisher: 'healthtech-ai',
    category: 'analysis-insights',
    subcategory: 'Primary Care Decision Support',
    
    targetIndustries: ['healthcare'],
    complianceStandards: ['HIPAA', 'FDA Medical Device'],
    dataRequirements: ['text-only', 'documents'],
    modelRequirements: ['claude-3-5-sonnet', 'gpt-4'],
    deploymentTypes: ['on-premise', 'air-gapped'],
    
    containerImage: 'healthtech-ai/primary-care-cds',
    version: '3.2.1',
    size: '2.3 GB',
    lastUpdated: '2024-03-25',
    
    downloads: 892,
    rating: 4.9,
    reviewCount: 67,
    
    pricingModel: 'subscription',
    pricingDescription: '$400/month per physician + usage fees',
    
    egressAllowlist: ['https://api.nih.gov', 'https://api.uptodate.com'],
    requiredPorts: ['8000'],
    securityNotes: 'PHI processed locally with evidence-based medical database integration.',
    
    tags: ['healthcare', 'primary-care', 'clinical-decision-support', 'diagnosis', 'treatment-planning'],
    featured: true,
    trending: true,
    new: false,
    
    demoAvailable: false
  },

  {
    id: 'emergency-medicine-triage-assistant',
    name: 'emergency-medicine-triage-assistant',
    displayName: 'Emergency Medicine Triage Assistant',
    description: 'AI-powered emergency department triage with acuity scoring and resource allocation',
    longDescription: 'Advanced triage assistant for emergency departments that analyzes patient presentations, vital signs, and chief complaints to provide evidence-based acuity scoring and resource allocation recommendations. Integrates with emergency department workflows to prioritize patients, predict resource needs, and identify potential deterioration risks requiring immediate attention.',
    publisher: 'healthtech-ai',
    category: 'analysis-insights',
    subcategory: 'Emergency Medicine',
    
    targetIndustries: ['healthcare'],
    complianceStandards: ['HIPAA', 'EMTALA'],
    dataRequirements: ['text-only', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'healthtech-ai/ed-triage-assistant',
    version: '2.1.4',
    size: '1.8 GB',
    lastUpdated: '2024-03-24',
    
    downloads: 445,
    rating: 4.8,
    reviewCount: 28,
    
    pricingModel: 'subscription',
    pricingDescription: '$800/month per emergency department',
    
    egressAllowlist: ['https://api.acep.org'],
    requiredPorts: ['8000', '8080'],
    securityNotes: 'Patient triage data processed locally with clinical guideline integration.',
    
    tags: ['healthcare', 'emergency-medicine', 'triage', 'acuity-scoring', 'patient-prioritization'],
    featured: true,
    trending: false,
    new: true,
    
    demoAvailable: false
  },

  {
    id: 'radiology-report-structured-analyzer',
    name: 'radiology-report-structured-analyzer',
    displayName: 'Radiology Report Structured Data Extractor',
    description: 'Converts radiology reports into structured data with critical finding extraction',
    longDescription: 'Analyzes radiology reports to extract structured data including measurements, findings, impressions, and recommendations. Automatically identifies critical findings requiring urgent attention, standardizes terminology using RadLex ontology, and generates structured reports for integration with EMR systems. Reduces radiologist documentation time while improving report consistency.',
    publisher: 'healthtech-ai',
    category: 'data-processing',
    subcategory: 'Medical Imaging',
    
    targetIndustries: ['healthcare'],
    complianceStandards: ['HIPAA', 'DICOM Standards'],
    dataRequirements: ['text-only', 'documents'],
    modelRequirements: ['claude-3-5-sonnet', 'multimodal'],
    deploymentTypes: ['on-premise', 'air-gapped'],
    
    containerImage: 'healthtech-ai/radiology-structured-analyzer',
    version: '2.4.0',
    size: '1.9 GB',
    lastUpdated: '2024-03-22',
    
    downloads: 356,
    rating: 4.7,
    reviewCount: 21,
    
    pricingModel: 'usage-based',
    pricingDescription: '$3 per radiology report processed',
    
    egressAllowlist: ['https://api.rsna.org'],
    requiredPorts: ['8000'],
    securityNotes: 'Radiology data processed locally with RadLex terminology integration.',
    
    tags: ['healthcare', 'radiology', 'structured-reporting', 'critical-findings', 'dicom'],
    featured: false,
    trending: true,
    new: false,
    
    demoAvailable: true
  },

  // Medical Coding and Revenue Cycle
  {
    id: 'medical-coding-quality-assurance',
    name: 'medical-coding-quality-assurance',
    displayName: 'Medical Coding Quality Assurance Agent',
    description: 'Automated quality assurance for ICD-10, CPT, and DRG coding accuracy',
    longDescription: 'Performs comprehensive quality assurance on medical coding assignments including ICD-10 diagnosis codes, CPT procedure codes, and DRG assignments. Identifies coding errors, missed diagnoses, upcoding/downcoding issues, and ensures compliance with CMS coding guidelines. Improves coding accuracy by 25-40% while reducing audit preparation time.',
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
    
    downloads: 1450,
    rating: 4.7,
    reviewCount: 89,
    
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
    id: 'clinical-documentation-improvement',
    name: 'clinical-documentation-improvement',
    displayName: 'Clinical Documentation Improvement Agent',
    description: 'Automated CDI review to improve clinical documentation and coding accuracy',
    longDescription: 'Reviews clinical documentation to identify opportunities for improvement in specificity, clarity, and completeness. Analyzes physician notes, nursing documentation, and diagnostic reports to suggest clarifications that support accurate coding and quality metrics. Queries physicians for additional documentation when clinical indicators suggest higher acuity than documented.',
    publisher: 'healthtech-ai',
    category: 'data-processing',
    subcategory: 'Clinical Documentation',
    
    targetIndustries: ['healthcare'],
    complianceStandards: ['HIPAA', 'CMS Documentation Guidelines'],
    dataRequirements: ['text-only', 'documents'],
    modelRequirements: ['claude-3-5-sonnet', 'gpt-4'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'healthtech-ai/cdi-agent',
    version: '1.9.2',
    size: '1.1 GB',
    lastUpdated: '2024-03-21',
    
    downloads: 678,
    rating: 4.6,
    reviewCount: 34,
    
    pricingModel: 'subscription',
    pricingDescription: '$250/month per CDI specialist',
    
    egressAllowlist: ['https://api.cms.gov'],
    requiredPorts: ['8000'],
    securityNotes: 'Clinical documentation analyzed locally with CMS guideline validation.',
    
    tags: ['healthcare', 'clinical-documentation', 'cdi', 'quality-improvement', 'physician-queries'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'insurance-claims-denial-analyst',
    name: 'insurance-claims-denial-analyst',
    displayName: 'Insurance Claims Denial Analysis Agent',
    description: 'Analyzes insurance claim denials and generates appeal documentation',
    longDescription: 'Analyzes insurance claim denials to identify appeal opportunities and generates comprehensive appeal documentation with clinical justification. Reviews denial reasons against medical necessity criteria, identifies documentation gaps, and creates evidence-based appeal letters with supporting medical literature citations.',
    publisher: 'healthtech-ai',
    category: 'integration-automation',
    subcategory: 'Revenue Cycle Management',
    
    targetIndustries: ['healthcare'],
    complianceStandards: ['HIPAA', 'Insurance Regulations'],
    dataRequirements: ['documents', 'text-only', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise', 'cloud'],
    
    containerImage: 'healthtech-ai/claims-denial-analyst',
    version: '2.0.1',
    size: '920 MB',
    lastUpdated: '2024-03-20',
    
    downloads: 567,
    rating: 4.5,
    reviewCount: 27,
    
    pricingModel: 'usage-based',
    pricingDescription: '$12 per denial analysis + appeal generation',
    
    egressAllowlist: ['https://api.cms.gov', 'https://api.availity.com'],
    requiredPorts: ['8000'],
    securityNotes: 'Claims data processed locally with encrypted payer system integration.',
    
    tags: ['healthcare', 'insurance-claims', 'denial-management', 'appeals', 'revenue-cycle'],
    featured: false,
    trending: true,
    new: false,
    
    demoAvailable: true
  },

  // Pharmacy and Medication Management
  {
    id: 'pharmacy-drug-interaction-checker',
    name: 'pharmacy-drug-interaction-checker',
    displayName: 'Pharmacy Drug Interaction Checker',
    description: 'Real-time drug interaction and contraindication screening for pharmacy operations',
    longDescription: 'Provides real-time screening of prescription orders for drug-drug interactions, drug-allergy contraindications, duplicate therapy issues, and dosing concerns. Integrates with pharmacy management systems to flag potential safety issues requiring pharmacist review before dispensing. Includes pediatric and geriatric dosing validation.',
    publisher: 'healthtech-ai',
    category: 'security-compliance',
    subcategory: 'Pharmacy Safety',
    
    targetIndustries: ['healthcare'],
    complianceStandards: ['HIPAA', 'FDA Drug Safety'],
    dataRequirements: ['database', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'healthtech-ai/drug-interaction-checker',
    version: '3.1.0',
    size: '1.7 GB',
    lastUpdated: '2024-03-25',
    
    downloads: 1240,
    rating: 4.8,
    reviewCount: 78,
    
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
    id: 'medication-reconciliation-agent',
    name: 'medication-reconciliation-agent',
    displayName: 'Medication Reconciliation Agent',
    description: 'Automated medication reconciliation across care transitions and admissions',
    longDescription: 'Performs comprehensive medication reconciliation during patient transitions including hospital admissions, transfers, and discharges. Compares home medications with inpatient orders, identifies discrepancies, suggests reconciliation actions, and generates medication lists for patient education. Reduces medication errors by 60-80% while streamlining pharmacist workflow.',
    publisher: 'healthtech-ai',
    category: 'security-compliance',
    subcategory: 'Medication Safety',
    
    targetIndustries: ['healthcare'],
    complianceStandards: ['HIPAA', 'Joint Commission'],
    dataRequirements: ['database', 'text-only'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'healthtech-ai/med-reconciliation',
    version: '2.0.3',
    size: '980 MB',
    lastUpdated: '2024-03-23',
    
    downloads: 567,
    rating: 4.7,
    reviewCount: 31,
    
    pricingModel: 'subscription',
    pricingDescription: '$500/month per 100 beds',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Medication data processed locally with no external pharmaceutical database access.',
    
    tags: ['healthcare', 'medication-reconciliation', 'patient-safety', 'care-transitions', 'pharmacy'],
    featured: false,
    trending: true,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'pediatric-dosing-calculator',
    name: 'pediatric-dosing-calculator',
    displayName: 'Pediatric Dosing Safety Calculator',
    description: 'Weight-based pediatric medication dosing with safety validation and alerts',
    longDescription: 'Specialized pediatric dosing calculator that validates medication orders for pediatric patients based on weight, age, and clinical condition. Calculates appropriate dosing ranges, identifies potential overdosing risks, checks for age-appropriate formulations, and provides safety alerts for high-risk medications requiring additional verification.',
    publisher: 'healthtech-ai',
    category: 'security-compliance',
    subcategory: 'Pediatric Safety',
    
    targetIndustries: ['healthcare'],
    complianceStandards: ['HIPAA', 'Pediatric Safety Standards'],
    dataRequirements: ['database'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise', 'air-gapped'],
    
    containerImage: 'healthtech-ai/pediatric-dosing',
    version: '1.7.2',
    size: '750 MB',
    lastUpdated: '2024-03-19',
    
    downloads: 234,
    rating: 4.9,
    reviewCount: 15,
    
    pricingModel: 'subscription',
    pricingDescription: '$400/month per pediatric unit',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Pediatric dosing calculations performed locally with safety database validation.',
    
    tags: ['healthcare', 'pediatric-dosing', 'medication-safety', 'weight-based-dosing', 'pediatrics'],
    featured: false,
    trending: false,
    new: true,
    
    demoAvailable: false
  },

  // Insurance and Prior Authorization
  {
    id: 'insurance-prior-authorization-specialist',
    name: 'insurance-prior-authorization-specialist',
    displayName: 'Insurance Prior Authorization Specialist',
    description: 'Automated prior authorization processing with approval prediction and documentation',
    longDescription: 'Streamlines insurance prior authorization requests by analyzing patient medical history, proposed treatments, and insurance coverage criteria. Predicts approval likelihood, identifies required documentation, generates pre-authorization requests with supporting clinical justification, and tracks approval status. Reduces prior auth processing time by 60-70%.',
    publisher: 'healthtech-ai',
    category: 'integration-automation',
    subcategory: 'Insurance Processing',
    
    targetIndustries: ['healthcare'],
    complianceStandards: ['HIPAA', 'Insurance Regulations'],
    dataRequirements: ['text-only', 'documents', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise', 'cloud'],
    
    containerImage: 'healthtech-ai/prior-auth-specialist',
    version: '2.1.4',
    size: '1.1 GB',
    lastUpdated: '2024-03-24',
    
    downloads: 1780,
    rating: 4.4,
    reviewCount: 127,
    
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

  {
    id: 'insurance-eligibility-verifier',
    name: 'insurance-eligibility-verifier',
    displayName: 'Insurance Eligibility Verification Agent',
    description: 'Real-time insurance eligibility and benefits verification for patient registration',
    longDescription: 'Automates insurance eligibility verification and benefits checking for patient registrations and appointments. Verifies active coverage, identifies copay and deductible requirements, checks prior authorization needs, and flags coverage limitations. Integrates with major insurance clearinghouses to provide real-time verification.',
    publisher: 'healthtech-ai',
    category: 'integration-automation',
    subcategory: 'Patient Registration',
    
    targetIndustries: ['healthcare'],
    complianceStandards: ['HIPAA', 'Insurance Verification Standards'],
    dataRequirements: ['api-access', 'database'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'healthtech-ai/eligibility-verifier',
    version: '1.8.3',
    size: '680 MB',
    lastUpdated: '2024-03-21',
    
    downloads: 2340,
    rating: 4.3,
    reviewCount: 156,
    
    pricingModel: 'usage-based',
    pricingDescription: '$0.50 per eligibility verification',
    
    egressAllowlist: ['https://api.availity.com', 'https://api.change.com'],
    requiredPorts: ['8000'],
    securityNotes: 'Patient data transmitted securely to insurance clearinghouses.',
    
    tags: ['healthcare', 'insurance-verification', 'eligibility-checking', 'patient-registration', 'benefits'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  // Quality Assurance and Safety
  {
    id: 'clinical-quality-measure-calculator',
    name: 'clinical-quality-measure-calculator',
    displayName: 'Clinical Quality Measures Calculator',
    description: 'Automated calculation of CMS quality measures for value-based care reporting',
    longDescription: 'Calculates clinical quality measures required for CMS value-based care programs including MIPS, Hospital Quality Reporting, and Medicare Advantage Star Ratings. Analyzes patient data to determine measure eligibility, calculates performance rates, and identifies improvement opportunities. Automates quality reporting workflows while ensuring accuracy.',
    publisher: 'healthtech-ai',
    category: 'analysis-insights',
    subcategory: 'Quality Reporting',
    
    targetIndustries: ['healthcare'],
    complianceStandards: ['HIPAA', 'CMS Quality Measures'],
    dataRequirements: ['database', 'text-only'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'healthtech-ai/quality-measures',
    version: '2.2.1',
    size: '1.0 GB',
    lastUpdated: '2024-03-22',
    
    downloads: 445,
    rating: 4.8,
    reviewCount: 23,
    
    pricingModel: 'subscription',
    pricingDescription: '$600/month per quality analyst',
    
    egressAllowlist: ['https://api.cms.gov'],
    requiredPorts: ['8000'],
    securityNotes: 'Patient quality data processed locally with CMS measure validation.',
    
    tags: ['healthcare', 'quality-measures', 'cms', 'value-based-care', 'mips'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'infection-control-surveillance',
    name: 'infection-control-surveillance',
    displayName: 'Infection Control Surveillance Agent',
    description: 'Automated healthcare-associated infection surveillance and outbreak detection',
    longDescription: 'Monitors patient data for healthcare-associated infections (HAIs) and potential outbreaks. Analyzes lab results, culture data, and patient movements to identify infection patterns, calculates infection rates, and generates surveillance reports. Provides early warning alerts for potential outbreaks requiring immediate infection control intervention.',
    publisher: 'healthtech-ai',
    category: 'security-compliance',
    subcategory: 'Infection Control',
    
    targetIndustries: ['healthcare'],
    complianceStandards: ['HIPAA', 'CDC Surveillance Standards'],
    dataRequirements: ['database', 'text-only'],
    modelRequirements: ['gpt-4', 'claude-3-opus'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'healthtech-ai/infection-surveillance',
    version: '1.6.1',
    size: '890 MB',
    lastUpdated: '2024-03-18',
    
    downloads: 178,
    rating: 4.9,
    reviewCount: 12,
    
    pricingModel: 'subscription',
    pricingDescription: '$400/month per infection preventionist',
    
    egressAllowlist: ['https://api.cdc.gov'],
    requiredPorts: ['8000'],
    securityNotes: 'Infection data processed locally with CDC surveillance database integration.',
    
    tags: ['healthcare', 'infection-control', 'surveillance', 'outbreak-detection', 'patient-safety'],
    featured: false,
    trending: false,
    new: true,
    
    demoAvailable: false
  },

  // Clinical Research and Trials
  {
    id: 'clinical-trial-patient-screener',
    name: 'clinical-trial-patient-screener',
    displayName: 'Clinical Trial Patient Screening Agent',
    description: 'Automated patient screening for clinical trial eligibility with inclusion/exclusion analysis',
    longDescription: 'Automated clinical trial matching system that analyzes patient medical records against trial inclusion/exclusion criteria. Identifies potential participants, calculates eligibility scores, generates referral reports for research coordinators, and tracks patient consent and enrollment status. Improves trial recruitment efficiency by 40-60%.',
    publisher: 'healthtech-ai',
    category: 'analysis-insights',
    subcategory: 'Clinical Research',
    
    targetIndustries: ['healthcare'],
    complianceStandards: ['HIPAA', 'GCP', 'FDA Clinical Trial Regulations'],
    dataRequirements: ['text-only', 'database'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'healthtech-ai/trial-screener',
    version: '1.4.2',
    size: '1.2 GB',
    lastUpdated: '2024-03-20',
    
    downloads: 234,
    rating: 4.6,
    reviewCount: 14,
    
    pricingModel: 'subscription',
    pricingDescription: '$500/month per research site',
    
    egressAllowlist: ['https://clinicaltrials.gov'],
    requiredPorts: ['8000'],
    securityNotes: 'Patient data processed locally with clinical trial database integration.',
    
    tags: ['healthcare', 'clinical-trials', 'patient-screening', 'research', 'enrollment'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'adverse-event-reporter',
    name: 'adverse-event-reporter',
    displayName: 'Adverse Event Reporting Agent',
    description: 'Automated detection and reporting of adverse drug events and device malfunctions',
    longDescription: 'Monitors patient records for adverse drug events, device malfunctions, and other safety incidents requiring FDA reporting. Analyzes clinical notes, lab results, and medication administration records to identify potential adverse events, assesses causality relationships, and generates FDA MedWatch reports with supporting documentation.',
    publisher: 'healthtech-ai',
    category: 'security-compliance',
    subcategory: 'Safety Reporting',
    
    targetIndustries: ['healthcare'],
    complianceStandards: ['HIPAA', 'FDA MedWatch', 'Pharmacovigilance'],
    dataRequirements: ['text-only', 'database'],
    modelRequirements: ['gpt-4', 'claude-3-opus'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'healthtech-ai/adverse-event-reporter',
    version: '1.3.1',
    size: '820 MB',
    lastUpdated: '2024-03-17',
    
    downloads: 123,
    rating: 4.7,
    reviewCount: 8,
    
    pricingModel: 'subscription',
    pricingDescription: '$300/month per safety officer',
    
    egressAllowlist: ['https://api.fda.gov'],
    requiredPorts: ['8000'],
    securityNotes: 'Adverse event data processed locally with secure FDA reporting integration.',
    
    tags: ['healthcare', 'adverse-events', 'fda-reporting', 'pharmacovigilance', 'patient-safety'],
    featured: false,
    trending: false,
    new: true,
    
    demoAvailable: false
  },

  // Specialized Clinical Workflows
  {
    id: 'sepsis-early-warning-system',
    name: 'sepsis-early-warning-system',
    displayName: 'Sepsis Early Warning System',
    description: 'AI-powered early sepsis detection with real-time patient monitoring and alerts',
    longDescription: 'Advanced sepsis detection system that continuously monitors patient vital signs, laboratory values, and clinical indicators to identify early signs of sepsis. Uses validated sepsis criteria (qSOFA, SIRS) combined with machine learning models to provide real-time risk scoring and automated alerts to clinical teams for immediate intervention.',
    publisher: 'healthtech-ai',
    category: 'analysis-insights',
    subcategory: 'Critical Care Monitoring',
    
    targetIndustries: ['healthcare'],
    complianceStandards: ['HIPAA', 'CMS Sepsis Measures'],
    dataRequirements: ['database', 'api-access'],
    modelRequirements: ['gpt-4', 'local-llm'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'healthtech-ai/sepsis-early-warning',
    version: '2.3.0',
    size: '1.4 GB',
    lastUpdated: '2024-03-25',
    
    downloads: 156,
    rating: 4.9,
    reviewCount: 9,
    
    pricingModel: 'subscription',
    pricingDescription: '$1000/month per ICU + $200 per monitored bed',
    
    egressAllowlist: [],
    requiredPorts: ['8000', '8080'],
    securityNotes: 'Real-time patient monitoring with local processing and secure alert delivery.',
    
    tags: ['healthcare', 'sepsis-detection', 'early-warning', 'critical-care', 'patient-monitoring'],
    featured: true,
    trending: true,
    new: false,
    
    demoAvailable: false
  },

  {
    id: 'discharge-planning-coordinator',
    name: 'discharge-planning-coordinator',
    displayName: 'Discharge Planning Coordination Agent',
    description: 'Automated discharge planning with care coordination and readmission risk assessment',
    longDescription: 'Comprehensive discharge planning agent that analyzes patient condition, social determinants, medication requirements, and follow-up needs to create optimal discharge plans. Identifies patients at high risk for readmission, coordinates post-acute care services, and generates patient education materials. Reduces readmission rates by 15-25%.',
    publisher: 'healthtech-ai',
    category: 'integration-automation',
    subcategory: 'Care Coordination',
    
    targetIndustries: ['healthcare'],
    complianceStandards: ['HIPAA', 'CMS Readmission Measures'],
    dataRequirements: ['text-only', 'database', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'healthtech-ai/discharge-coordinator',
    version: '1.5.2',
    size: '950 MB',
    lastUpdated: '2024-03-19',
    
    downloads: 334,
    rating: 4.6,
    reviewCount: 18,
    
    pricingModel: 'subscription',
    pricingDescription: '$300/month per discharge planner',
    
    egressAllowlist: ['https://api.cms.gov'],
    requiredPorts: ['8000'],
    securityNotes: 'Patient discharge data processed locally with care coordination integration.',
    
    tags: ['healthcare', 'discharge-planning', 'readmission-prevention', 'care-coordination', 'case-management'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  // Nursing and Patient Care
  {
    id: 'nursing-documentation-assistant',
    name: 'nursing-documentation-assistant',
    displayName: 'Nursing Documentation Assistant',
    description: 'AI-powered nursing note generation and clinical documentation support',
    longDescription: 'Assists nurses with clinical documentation by analyzing patient assessments, care interventions, and outcomes to generate structured nursing notes. Ensures documentation completeness, suggests appropriate nursing diagnoses, and identifies care plan updates. Reduces nursing documentation time by 30-50% while improving note quality.',
    publisher: 'healthtech-ai',
    category: 'content-generation',
    subcategory: 'Nursing Documentation',
    
    targetIndustries: ['healthcare'],
    complianceStandards: ['HIPAA', 'Joint Commission Documentation'],
    dataRequirements: ['text-only'],
    modelRequirements: ['claude-3-5-sonnet', 'gpt-4'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'healthtech-ai/nursing-documentation',
    version: '1.7.1',
    size: '780 MB',
    lastUpdated: '2024-03-20',
    
    downloads: 890,
    rating: 4.5,
    reviewCount: 45,
    
    pricingModel: 'subscription',
    pricingDescription: '$150/month per nurse',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Nursing documentation generated locally with no external data access.',
    
    tags: ['healthcare', 'nursing-documentation', 'clinical-notes', 'care-planning', 'nursing'],
    featured: false,
    trending: true,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'fall-risk-assessment-agent',
    name: 'fall-risk-assessment-agent',
    displayName: 'Fall Risk Assessment Agent',
    description: 'Continuous fall risk assessment with intervention recommendations for hospitalized patients',
    longDescription: 'Continuously assesses fall risk for hospitalized patients using validated fall risk assessment tools (Morse Fall Scale, Hendrich II). Analyzes patient mobility, medications, cognitive status, and environmental factors to provide dynamic risk scoring and automated intervention recommendations. Integrates with nurse call systems for real-time alerts.',
    publisher: 'healthtech-ai',
    category: 'analysis-insights',
    subcategory: 'Patient Safety',
    
    targetIndustries: ['healthcare'],
    complianceStandards: ['HIPAA', 'Joint Commission Patient Safety'],
    dataRequirements: ['database'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'healthtech-ai/fall-risk-assessor',
    version: '1.4.3',
    size: '620 MB',
    lastUpdated: '2024-03-18',
    
    downloads: 267,
    rating: 4.7,
    reviewCount: 16,
    
    pricingModel: 'subscription',
    pricingDescription: '$200/month per nursing unit',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Patient risk data processed locally with secure alert system integration.',
    
    tags: ['healthcare', 'fall-risk', 'patient-safety', 'risk-assessment', 'nursing'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  // Laboratory and Diagnostics
  {
    id: 'lab-critical-value-monitor',
    name: 'lab-critical-value-monitor',
    displayName: 'Laboratory Critical Value Monitor',
    description: 'Automated detection and notification of critical laboratory values requiring immediate action',
    longDescription: 'Monitors laboratory results in real-time to identify critical values requiring immediate physician notification. Analyzes lab results against established critical value thresholds, tracks notification attempts, and ensures timely communication of life-threatening results. Includes delta checking for significant result changes.',
    publisher: 'healthtech-ai',
    category: 'security-compliance',
    subcategory: 'Laboratory Safety',
    
    targetIndustries: ['healthcare'],
    complianceStandards: ['HIPAA', 'CLIA', 'CAP Standards'],
    dataRequirements: ['database', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'healthtech-ai/lab-critical-monitor',
    version: '2.1.0',
    size: '750 MB',
    lastUpdated: '2024-03-23',
    
    downloads: 445,
    rating: 4.8,
    reviewCount: 22,
    
    pricingModel: 'subscription',
    pricingDescription: '$400/month per laboratory',
    
    egressAllowlist: [],
    requiredPorts: ['8000', '8443'],
    securityNotes: 'Lab data processed locally with secure physician notification system.',
    
    tags: ['healthcare', 'laboratory', 'critical-values', 'patient-safety', 'lab-monitoring'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'pathology-report-structured-extractor',
    name: 'pathology-report-structured-extractor',
    displayName: 'Pathology Report Structured Data Extractor',
    description: 'Converts pathology reports into structured data for cancer registries and research',
    longDescription: 'Extracts structured data from pathology reports including tumor staging, histology, biomarkers, and treatment recommendations. Standardizes pathology terminology using SNOMED-CT, formats data for cancer registry submission, and identifies actionable molecular findings for precision medicine. Supports both surgical and cytology specimens.',
    publisher: 'healthtech-ai',
    category: 'data-processing',
    subcategory: 'Pathology Data',
    
    targetIndustries: ['healthcare'],
    complianceStandards: ['HIPAA', 'CAP Standards'],
    dataRequirements: ['text-only', 'documents'],
    modelRequirements: ['claude-3-5-sonnet', 'gpt-4'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'healthtech-ai/pathology-extractor',
    version: '1.8.1',
    size: '1.1 GB',
    lastUpdated: '2024-03-21',
    
    downloads: 156,
    rating: 4.7,
    reviewCount: 11,
    
    pricingModel: 'usage-based',
    pricingDescription: '$5 per pathology report processed',
    
    egressAllowlist: ['https://api.naaccr.org'],
    requiredPorts: ['8000'],
    securityNotes: 'Pathology data processed locally with cancer registry format validation.',
    
    tags: ['healthcare', 'pathology', 'cancer-registry', 'structured-data', 'molecular-findings'],
    featured: false,
    trending: false,
    new: true,
    
    demoAvailable: true
  },

  // Home Health and Long-term Care
  {
    id: 'home-health-visit-optimizer',
    name: 'home-health-visit-optimizer',
    displayName: 'Home Health Visit Optimization Agent',
    description: 'Optimizes home health visit scheduling and care plan management',
    longDescription: 'Optimizes home health visit scheduling based on patient acuity, care requirements, geographic efficiency, and clinician capabilities. Analyzes patient conditions to recommend visit frequency, identifies patients requiring urgent visits, and coordinates care team schedules for maximum efficiency while ensuring quality care delivery.',
    publisher: 'healthtech-ai',
    category: 'integration-automation',
    subcategory: 'Home Health Management',
    
    targetIndustries: ['healthcare'],
    complianceStandards: ['HIPAA', 'CMS Home Health'],
    dataRequirements: ['database', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'healthtech-ai/home-health-optimizer',
    version: '1.6.0',
    size: '840 MB',
    lastUpdated: '2024-03-19',
    
    downloads: 178,
    rating: 4.4,
    reviewCount: 12,
    
    pricingModel: 'subscription',
    pricingDescription: '$250/month per care coordinator',
    
    egressAllowlist: ['https://api.cms.gov'],
    requiredPorts: ['8000'],
    securityNotes: 'Patient scheduling data processed locally with CMS compliance validation.',
    
    tags: ['healthcare', 'home-health', 'visit-optimization', 'care-coordination', 'scheduling'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'nursing-home-assessment-agent',
    name: 'nursing-home-assessment-agent',
    displayName: 'Nursing Home Assessment Agent',
    description: 'Automated MDS assessments and quality measure calculations for long-term care',
    longDescription: 'Automates Minimum Data Set (MDS) assessments for nursing home residents by analyzing clinical documentation, functional assessments, and care plans. Calculates quality measures, identifies assessment triggers, and ensures compliance with CMS assessment requirements. Reduces assessment time while improving accuracy and consistency.',
    publisher: 'healthtech-ai',
    category: 'data-processing',
    subcategory: 'Long-term Care',
    
    targetIndustries: ['healthcare'],
    complianceStandards: ['HIPAA', 'CMS MDS Requirements'],
    dataRequirements: ['database', 'text-only'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'healthtech-ai/nursing-home-assessor',
    version: '2.0.2',
    size: '950 MB',
    lastUpdated: '2024-03-22',
    
    downloads: 89,
    rating: 4.6,
    reviewCount: 6,
    
    pricingModel: 'subscription',
    pricingDescription: '$300/month per nursing facility',
    
    egressAllowlist: ['https://api.cms.gov'],
    requiredPorts: ['8000'],
    securityNotes: 'Resident assessment data processed locally with CMS MDS validation.',
    
    tags: ['healthcare', 'nursing-home', 'mds-assessment', 'long-term-care', 'quality-measures'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  // Mental Health and Behavioral Health
  {
    id: 'suicide-risk-assessment-agent',
    name: 'suicide-risk-assessment-agent',
    displayName: 'Suicide Risk Assessment Agent',
    description: 'Evidence-based suicide risk screening with safety planning and intervention alerts',
    longDescription: 'Conducts evidence-based suicide risk assessments using validated screening tools (PHQ-9, Columbia Scale) and clinical indicators. Analyzes patient responses, medical history, and behavioral patterns to identify suicide risk levels and generate safety planning recommendations. Provides real-time alerts for high-risk patients requiring immediate intervention.',
    publisher: 'healthtech-ai',
    category: 'analysis-insights',
    subcategory: 'Behavioral Health',
    
    targetIndustries: ['healthcare'],
    complianceStandards: ['HIPAA', 'Joint Commission Suicide Prevention'],
    dataRequirements: ['text-only', 'database'],
    modelRequirements: ['claude-3-5-sonnet', 'gpt-4'],
    deploymentTypes: ['on-premise', 'air-gapped'],
    
    containerImage: 'healthtech-ai/suicide-risk-assessor',
    version: '1.3.1',
    size: '680 MB',
    lastUpdated: '2024-03-16',
    
    downloads: 234,
    rating: 4.8,
    reviewCount: 15,
    
    pricingModel: 'subscription',
    pricingDescription: '$350/month per behavioral health unit',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Mental health data processed locally with crisis intervention protocols.',
    
    tags: ['healthcare', 'suicide-risk', 'behavioral-health', 'safety-planning', 'crisis-intervention'],
    featured: false,
    trending: false,
    new: true,
    
    demoAvailable: false
  },

  {
    id: 'substance-abuse-screening-agent',
    name: 'substance-abuse-screening-agent',
    displayName: 'Substance Abuse Screening Agent',
    description: 'Automated substance abuse screening with intervention recommendations and treatment planning',
    longDescription: 'Conducts comprehensive substance abuse screening using validated assessment tools (AUDIT, DAST-10, CAGE) and behavioral indicators. Identifies patients with substance use disorders, assesses severity levels, and provides treatment recommendations including referral options and medication-assisted treatment considerations.',
    publisher: 'healthtech-ai',
    category: 'analysis-insights',
    subcategory: 'Addiction Medicine',
    
    targetIndustries: ['healthcare'],
    complianceStandards: ['HIPAA', '42 CFR Part 2'],
    dataRequirements: ['text-only', 'database'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise', 'air-gapped'],
    
    containerImage: 'healthtech-ai/substance-abuse-screener',
    version: '1.4.0',
    size: '720 MB',
    lastUpdated: '2024-03-17',
    
    downloads: 167,
    rating: 4.5,
    reviewCount: 12,
    
    pricingModel: 'subscription',
    pricingDescription: '$250/month per addiction counselor',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Substance abuse data processed with enhanced confidentiality protections.',
    
    tags: ['healthcare', 'substance-abuse', 'addiction-screening', 'behavioral-health', 'treatment-planning'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  // Regulatory Compliance and Quality
  {
    id: 'hipaa-audit-preparedness-agent',
    name: 'hipaa-audit-preparedness-agent',
    displayName: 'HIPAA Audit Preparedness Agent',
    description: 'Comprehensive HIPAA compliance auditing with risk assessment and remediation planning',
    longDescription: 'Conducts comprehensive HIPAA compliance audits by analyzing policies, procedures, employee training records, and system access logs. Identifies potential compliance gaps, assesses breach risks, and generates remediation plans with priority recommendations. Prepares organizations for OCR audits and investigations.',
    publisher: 'healthtech-ai',
    category: 'security-compliance',
    subcategory: 'HIPAA Compliance',
    
    targetIndustries: ['healthcare'],
    complianceStandards: ['HIPAA', 'HITECH Act'],
    dataRequirements: ['documents', 'database'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise', 'air-gapped'],
    
    containerImage: 'healthtech-ai/hipaa-audit-prep',
    version: '2.1.2',
    size: '890 MB',
    lastUpdated: '2024-03-24',
    
    downloads: 334,
    rating: 4.9,
    reviewCount: 19,
    
    pricingModel: 'subscription',
    pricingDescription: '$500/month per compliance officer',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'HIPAA compliance data analyzed locally with audit trail generation.',
    
    tags: ['healthcare', 'hipaa-compliance', 'audit-preparation', 'risk-assessment', 'privacy'],
    featured: true,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'medical-device-adverse-event-tracker',
    name: 'medical-device-adverse-event-tracker',
    displayName: 'Medical Device Adverse Event Tracker',
    description: 'Automated tracking and reporting of medical device malfunctions and adverse events',
    longDescription: 'Monitors medical device usage and patient outcomes to identify device malfunctions, user errors, and adverse events requiring FDA reporting. Analyzes incident reports, maintenance records, and patient outcomes to assess device safety patterns and generate MDR (Medical Device Report) submissions.',
    publisher: 'healthtech-ai',
    category: 'security-compliance',
    subcategory: 'Medical Device Safety',
    
    targetIndustries: ['healthcare'],
    complianceStandards: ['HIPAA', 'FDA MDR', 'Medical Device Regulations'],
    dataRequirements: ['database', 'text-only'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise'],
    
    containerImage: 'healthtech-ai/device-event-tracker',
    version: '1.5.1',
    size: '780 MB',
    lastUpdated: '2024-03-18',
    
    downloads: 123,
    rating: 4.6,
    reviewCount: 8,
    
    pricingModel: 'subscription',
    pricingDescription: '$350/month per biomedical engineer',
    
    egressAllowlist: ['https://api.fda.gov'],
    requiredPorts: ['8000'],
    securityNotes: 'Device incident data processed locally with secure FDA reporting.',
    
    tags: ['healthcare', 'medical-devices', 'adverse-events', 'fda-reporting', 'device-safety'],
    featured: false,
    trending: false,
    new: true,
    
    demoAvailable: false
  }
]