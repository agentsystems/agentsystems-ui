/**
 * Personal Productivity and Lifestyle Agents
 * 
 * Agents designed for individual use, personal productivity, and lifestyle management.
 * Demonstrates AgentSystems' appeal beyond enterprise and regulated industries.
 */

import type { MarketplaceAgent } from '../types'

export const PERSONAL_AGENTS: MarketplaceAgent[] = [
  // Personal Productivity
  {
    id: 'personal-task-organizer',
    name: 'personal-task-organizer',
    displayName: 'Personal Task Organizer',
    description: 'AI-powered personal task management with priority optimization and calendar integration',
    longDescription: 'Intelligent personal productivity agent that organizes tasks, sets priorities based on deadlines and importance, and integrates with calendar systems. Provides daily planning recommendations, tracks goal progress, and optimizes schedule for maximum productivity.',
    publisher: 'open-agents',
    category: 'integration-automation',
    subcategory: 'Personal Productivity',
    
    targetIndustries: ['personal'],
    complianceStandards: [],
    dataRequirements: ['text-only', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'openagents/task-organizer',
    version: '1.4.2',
    size: '340 MB',
    lastUpdated: '2024-03-22',
    
    downloads: 8900,
    rating: 4.6,
    reviewCount: 456,
    
    pricingModel: 'free',
    pricingDescription: 'Free for personal use, premium features available',
    
    egressAllowlist: ['https://api.google.com', 'https://api.microsoft.com'],
    requiredPorts: ['8000'],
    securityNotes: 'Personal data processed locally with secure calendar integration.',
    
    tags: ['personal', 'productivity', 'task-management', 'calendar', 'planning'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'personal-finance-advisor',
    name: 'personal-finance-advisor',
    displayName: 'Personal Finance Advisor',
    description: 'Personal financial planning with budgeting, investment analysis, and goal tracking',
    longDescription: 'Comprehensive personal finance management including budget analysis, investment portfolio review, debt optimization, and financial goal tracking. Provides personalized recommendations for savings, spending, and investment strategies based on individual financial situation.',
    publisher: 'open-agents',
    category: 'analysis-insights',
    subcategory: 'Personal Finance',
    
    targetIndustries: ['personal'],
    complianceStandards: [],
    dataRequirements: ['database', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['on-premise', 'cloud'],
    
    containerImage: 'openagents/finance-advisor',
    version: '2.0.1',
    size: '590 MB',
    lastUpdated: '2024-03-21',
    
    downloads: 3400,
    rating: 4.3,
    reviewCount: 189,
    
    pricingModel: 'free',
    pricingDescription: 'Free basic version, premium features for $9.99/month',
    
    egressAllowlist: ['https://api.plaid.com'],
    requiredPorts: ['8000'],
    securityNotes: 'Financial data processed locally with encrypted bank integration.',
    
    tags: ['personal', 'finance', 'budgeting', 'investment-analysis', 'financial-planning'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'meal-planning-nutritionist',
    name: 'meal-planning-nutritionist',
    displayName: 'AI Meal Planning Nutritionist',
    description: 'Personalized meal planning with nutritional analysis and dietary restriction management',
    longDescription: 'Creates personalized meal plans based on dietary preferences, nutritional goals, and health restrictions. Analyzes nutritional content, generates shopping lists, and provides recipe recommendations. Includes calorie tracking and macro nutrient optimization.',
    publisher: 'open-agents',
    category: 'specialized',
    subcategory: 'Health & Nutrition',
    
    targetIndustries: ['personal'],
    complianceStandards: [],
    dataRequirements: ['text-only', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['cloud'],
    
    containerImage: 'openagents/meal-planner',
    version: '1.7.0',
    size: '420 MB',
    lastUpdated: '2024-03-19',
    
    downloads: 5600,
    rating: 4.4,
    reviewCount: 267,
    
    pricingModel: 'free',
    pricingDescription: 'Free with optional premium recipe database',
    
    egressAllowlist: ['https://api.edamam.com', 'https://api.spoonacular.com'],
    requiredPorts: ['8000'],
    securityNotes: 'Dietary data processed locally with recipe database integration.',
    
    tags: ['personal', 'meal-planning', 'nutrition', 'health', 'diet'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'fitness-workout-planner',
    name: 'fitness-workout-planner',
    displayName: 'Personal Fitness Workout Planner',
    description: 'AI-powered fitness planning with personalized workouts and progress tracking',
    longDescription: 'Creates personalized workout plans based on fitness goals, current fitness level, available equipment, and time constraints. Tracks progress, adjusts intensity, and provides form guidance. Includes injury prevention and recovery recommendations.',
    publisher: 'open-agents',
    category: 'specialized',
    subcategory: 'Fitness & Wellness',
    
    targetIndustries: ['personal'],
    complianceStandards: [],
    dataRequirements: ['text-only'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'openagents/fitness-planner',
    version: '1.5.3',
    size: '380 MB',
    lastUpdated: '2024-03-18',
    
    downloads: 4200,
    rating: 4.2,
    reviewCount: 234,
    
    pricingModel: 'free',
    pricingDescription: 'Completely free and open source',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Fitness data processed locally with privacy protection.',
    
    tags: ['personal', 'fitness', 'workout-planning', 'health', 'exercise'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'travel-itinerary-planner',
    name: 'travel-itinerary-planner',
    displayName: 'Travel Itinerary Planning Agent',
    description: 'Comprehensive travel planning with booking optimization and itinerary management',
    longDescription: 'Plans comprehensive travel itineraries including flight bookings, hotel reservations, activity recommendations, and local transportation. Optimizes for budget, preferences, and time constraints while providing real-time updates and alternative options.',
    publisher: 'open-agents',
    category: 'specialized',
    subcategory: 'Travel Planning',
    
    targetIndustries: ['personal'],
    complianceStandards: [],
    dataRequirements: ['api-access', 'text-only'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['cloud'],
    
    containerImage: 'openagents/travel-planner',
    version: '2.1.0',
    size: '650 MB',
    lastUpdated: '2024-03-23',
    
    downloads: 2100,
    rating: 4.1,
    reviewCount: 123,
    
    pricingModel: 'free',
    pricingDescription: 'Free with booking commission model',
    
    egressAllowlist: ['https://api.expedia.com', 'https://api.booking.com'],
    requiredPorts: ['8000'],
    securityNotes: 'Travel preferences processed locally with booking platform integration.',
    
    tags: ['personal', 'travel-planning', 'itinerary', 'booking-optimization', 'vacation'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'personal-learning-assistant',
    name: 'personal-learning-assistant',
    displayName: 'Personal Learning Assistant',
    description: 'Personalized learning path creation with skill assessment and progress tracking',
    longDescription: 'Creates personalized learning paths for skill development including course recommendations, study schedules, and progress tracking. Adapts to learning style, assesses current knowledge, and provides targeted practice exercises and resources.',
    publisher: 'open-agents',
    category: 'specialized',
    subcategory: 'Personal Development',
    
    targetIndustries: ['education'],
    complianceStandards: [],
    dataRequirements: ['text-only', 'api-access'],
    modelRequirements: ['gpt-4', 'claude-3-5-sonnet'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'openagents/learning-assistant',
    version: '1.6.4',
    size: '480 MB',
    lastUpdated: '2024-03-20',
    
    downloads: 3700,
    rating: 4.5,
    reviewCount: 198,
    
    pricingModel: 'free',
    pricingDescription: 'Free with optional premium content access',
    
    egressAllowlist: ['https://api.coursera.org', 'https://api.udemy.com'],
    requiredPorts: ['8000'],
    securityNotes: 'Learning data processed locally with course platform integration.',
    
    tags: ['personal', 'learning', 'skill-development', 'education', 'self-improvement'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  },

  {
    id: 'home-organization-assistant',
    name: 'home-organization-assistant',
    displayName: 'Home Organization Assistant',
    description: 'Smart home organization with inventory tracking and maintenance scheduling',
    longDescription: 'Helps organize home life including household inventory tracking, maintenance scheduling, bill reminders, and family calendar coordination. Provides organization recommendations, tracks expiration dates, and manages household tasks and responsibilities.',
    publisher: 'open-agents',
    category: 'integration-automation',
    subcategory: 'Home Management',
    
    targetIndustries: ['personal'],
    complianceStandards: [],
    dataRequirements: ['text-only', 'images'],
    modelRequirements: ['multimodal', 'gpt-4'],
    deploymentTypes: ['cloud', 'on-premise'],
    
    containerImage: 'openagents/home-organizer',
    version: '1.3.2',
    size: '290 MB',
    lastUpdated: '2024-03-17',
    
    downloads: 1890,
    rating: 4.0,
    reviewCount: 89,
    
    pricingModel: 'free',
    pricingDescription: 'Completely free for personal use',
    
    egressAllowlist: [],
    requiredPorts: ['8000'],
    securityNotes: 'Household data processed locally with privacy protection.',
    
    tags: ['personal', 'home-organization', 'household-management', 'maintenance', 'family'],
    featured: false,
    trending: false,
    new: false,
    
    demoAvailable: true
  }
]