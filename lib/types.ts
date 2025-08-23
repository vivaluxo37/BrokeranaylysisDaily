// Type definitions for mega menu navigation data
import { NavigationSection } from './enums';

export interface CountryData {
  name: string;
  code: string;
  brokerCount: number;
}

export interface PlatformData {
  name: string;
  brokerCount: number;
}

export interface AccountTypeData {
  name: string;
  brokerCount: number;
}

export interface BrokerData {
  name: string;
  rating: number;
  trustScore: number;
}

export interface AnalysisData {
  title: string;
  timestamp: string;
  category: string;
}

export interface EducationResourceData {
  title: string;
  type: string;
  readTime?: string;
  pages?: number;
}

export interface PropFirmData {
  name: string;
  rating: number;
  fundingAmount: string;
}

export interface ComparisonData {
  broker1: string;
  broker2: string;
  views: number;
}

// Props types
export interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  section: NavigationSection;
  countries: CountryData[];
  platforms: PlatformData[];
  accountTypes: AccountTypeData[];
  topBrokers: BrokerData[];
  recentAnalysis: AnalysisData[];
  educationResources: EducationResourceData[];
  propFirms: PropFirmData[];
  popularComparisons: ComparisonData[];
}

export interface HeaderProps {
  currentPath: string;
  isAuthenticated: boolean;
  searchQuery: string;
  activeSection: NavigationSection | null;
  isMobileMenuOpen: boolean;
  searchSuggestions: string[];
  isSearching: boolean;
  onSectionChange: (section: NavigationSection | null) => void;
  onMobileMenuToggle: (open: boolean) => void;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (query: string) => void;
  onSignIn: () => void;
  onSignOut: () => void;
  onGetAIMatch: () => void;
}

// Query types
export interface NavigationQueryData {
  countries: CountryData[];
  platforms: PlatformData[];
  accountTypes: AccountTypeData[];
  topBrokers: BrokerData[];
  recentAnalysis: AnalysisData[];
  educationResources: EducationResourceData[];
  propFirms: PropFirmData[];
  popularComparisons: ComparisonData[];
}

// AI Service Integration Types
export enum AIProvider {
  GROQ = 'groq',
  OPENROUTER = 'openrouter',
  OPENAI = 'openai'
}

export enum AIModelType {
  CHAT = 'chat',
  EMBEDDING = 'embedding',
  COMPLETION = 'completion'
}

export enum PromptTemplate {
  CHAT = 'chat',
  RECOMMENDATION = 'recommendation',
  SUMMARIZATION = 'summarization',
  RAG = 'rag',
  BROKER_ANALYSIS = 'broker_analysis'
}

export interface AIModel {
  id: string;
  name: string;
  provider: AIProvider;
  type: AIModelType;
  maxTokens: number;
  costPerToken: {
    input: number;
    output: number;
  };
  contextWindow: number;
  isAvailable: boolean;
  priority: number; // Lower number = higher priority for failover
  capabilities: string[];
  rateLimit: {
    requestsPerMinute: number;
    tokensPerMinute: number;
  };
}

export interface AIProviderConfig {
  provider: AIProvider;
  apiKey: string;
  baseUrl: string;
  defaultModel: string;
  timeout: number;
  retryAttempts: number;
  rateLimits: {
    requestsPerMinute: number;
    tokensPerMinute: number;
  };
}

export interface AIRequest {
  prompt: string;
  template: PromptTemplate;
  context?: Record<string, any>;
  model?: string;
  provider?: AIProvider;
  maxTokens?: number;
  temperature?: number;
  conversationId?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface AIResponse {
  content: string;
  model: string;
  provider: AIProvider;
  responseTime: number;
  tokensUsed: {
    input: number;
    output: number;
    total: number;
  };
  cost: number;
  conversationId?: string;
  requestId: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface TokenUsage {
  requestId: string;
  provider: AIProvider;
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cost: number;
  timestamp: Date;
  userId?: string;
  conversationId?: string;
}

export interface RateLimitStatus {
  provider: AIProvider;
  requestsRemaining: number;
  tokensRemaining: number;
  resetTime: Date;
  isLimited: boolean;
}

export interface AIServiceError {
  code: string;
  message: string;
  provider: AIProvider;
  model?: string;
  retryable: boolean;
  timestamp: Date;
  requestId?: string;
}

export interface PromptTemplateConfig {
  template: PromptTemplate;
  systemPrompt: string;
  userPromptTemplate: string;
  variables: string[];
  maxTokens: number;
  temperature: number;
  preferredModels: string[];
}

export interface ModelRouterConfig {
  models: AIModel[];
  fallbackChain: string[];
  loadBalancing: {
    enabled: boolean;
    strategy: 'round_robin' | 'least_loaded' | 'random';
  };
  healthCheck: {
    enabled: boolean;
    intervalMs: number;
    timeoutMs: number;
  };
}

export interface AIServiceConfig {
  providers: AIProviderConfig[];
  models: AIModel[];
  promptTemplates: PromptTemplateConfig[];
  router: ModelRouterConfig;
  monitoring: {
    enabled: boolean;
    logRequests: boolean;
    trackCosts: boolean;
    alertThresholds: {
      costPerHour: number;
      errorRate: number;
      responseTime: number;
    };
  };
}

export interface ConversationContext {
  conversationId: string;
  userId?: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    metadata?: Record<string, any>;
  }>;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIServiceMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  totalTokensUsed: number;
  totalCost: number;
  providerStats: Record<AIProvider, {
    requests: number;
    errors: number;
    avgResponseTime: number;
    tokensUsed: number;
    cost: number;
  }>;
  modelStats: Record<string, {
    requests: number;
    errors: number;
    avgResponseTime: number;
    tokensUsed: number;
    cost: number;
  }>;
}