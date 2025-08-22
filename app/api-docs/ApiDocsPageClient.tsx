'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Code, 
  Play, 
  Copy, 
  Check, 
  Search, 
  Book, 
  Key, 
  Shield, 
  Zap,
  Database,
  Globe,
  ArrowRight,
  ExternalLink,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  title: string;
  description: string;
  category: string;
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses: Response[];
  example: {
    request?: string;
    response: string;
  };
  rateLimit?: string;
  authentication: boolean;
}

interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string;
}

interface RequestBody {
  type: string;
  description: string;
  example: string;
}

interface Response {
  status: number;
  description: string;
  example: string;
}

const apiEndpoints: ApiEndpoint[] = [
  {
    id: 'get-brokers',
    method: 'GET',
    path: '/api/v1/brokers',
    title: 'Get All Brokers',
    description: 'Retrieve a list of all brokers with optional filtering and pagination.',
    category: 'Brokers',
    parameters: [
      { name: 'page', type: 'integer', required: false, description: 'Page number for pagination', example: '1' },
      { name: 'limit', type: 'integer', required: false, description: 'Number of results per page (max 100)', example: '20' },
      { name: 'country', type: 'string', required: false, description: 'Filter by country code', example: 'US' },
      { name: 'regulation', type: 'string', required: false, description: 'Filter by regulatory body', example: 'FCA' },
      { name: 'min_trust_score', type: 'integer', required: false, description: 'Minimum trust score (0-100)', example: '80' }
    ],
    responses: [
      {
        status: 200,
        description: 'Successful response',
        example: JSON.stringify({
          data: [
            {
              id: 'ic-markets',
              name: 'IC Markets',
              trust_score: 95,
              regulation: ['ASIC', 'CySEC'],
              country: 'AU',
              founded: 2007,
              min_deposit: 200,
              spreads_from: 0.0,
              leverage_max: '1:500'
            }
          ],
          pagination: {
            page: 1,
            limit: 20,
            total: 150,
            pages: 8
          }
        }, null, 2)
      }
    ],
    example: {
      response: JSON.stringify({
        data: [
          {
            id: 'ic-markets',
            name: 'IC Markets',
            trust_score: 95,
            regulation: ['ASIC', 'CySEC'],
            country: 'AU'
          }
        ]
      }, null, 2)
    },
    rateLimit: '100 requests per minute',
    authentication: false
  },
  {
    id: 'get-broker',
    method: 'GET',
    path: '/api/v1/brokers/{id}',
    title: 'Get Broker Details',
    description: 'Retrieve detailed information about a specific broker.',
    category: 'Brokers',
    parameters: [
      { name: 'id', type: 'string', required: true, description: 'Broker ID or slug', example: 'ic-markets' }
    ],
    responses: [
      {
        status: 200,
        description: 'Successful response',
        example: JSON.stringify({
          id: 'ic-markets',
          name: 'IC Markets',
          trust_score: 95,
          regulation: ['ASIC', 'CySEC'],
          country: 'AU',
          founded: 2007,
          website: 'https://icmarkets.com',
          trading_platforms: ['MetaTrader 4', 'MetaTrader 5', 'cTrader'],
          account_types: [
            {
              name: 'Standard',
              min_deposit: 200,
              spreads_from: 1.0,
              commission: 0
            }
          ]
        }, null, 2)
      },
      {
        status: 404,
        description: 'Broker not found',
        example: JSON.stringify({
          error: 'Broker not found',
          message: 'The requested broker does not exist'
        }, null, 2)
      }
    ],
    example: {
      response: JSON.stringify({
        id: 'ic-markets',
        name: 'IC Markets',
        trust_score: 95,
        regulation: ['ASIC', 'CySEC']
      }, null, 2)
    },
    rateLimit: '100 requests per minute',
    authentication: false
  },
  {
    id: 'compare-brokers',
    method: 'POST',
    path: '/api/v1/brokers/compare',
    title: 'Compare Brokers',
    description: 'Compare multiple brokers side by side.',
    category: 'Comparisons',
    requestBody: {
      type: 'application/json',
      description: 'Array of broker IDs to compare',
      example: JSON.stringify({
        broker_ids: ['ic-markets', 'pepperstone', 'fp-markets']
      }, null, 2)
    },
    responses: [
      {
        status: 200,
        description: 'Successful comparison',
        example: JSON.stringify({
          comparison: {
            brokers: [
              {
                id: 'ic-markets',
                name: 'IC Markets',
                trust_score: 95,
                min_deposit: 200,
                spreads_from: 0.0
              }
            ],
            summary: {
              best_trust_score: 'ic-markets',
              lowest_spreads: 'ic-markets',
              lowest_deposit: 'pepperstone'
            }
          }
        }, null, 2)
      }
    ],
    example: {
      request: JSON.stringify({
        broker_ids: ['ic-markets', 'pepperstone']
      }, null, 2),
      response: JSON.stringify({
        comparison: {
          brokers: [/* broker data */],
          summary: {/* comparison summary */}
        }
      }, null, 2)
    },
    rateLimit: '50 requests per minute',
    authentication: true
  },
  {
    id: 'get-recommendations',
    method: 'POST',
    path: '/api/v1/recommendations',
    title: 'Get AI Recommendations',
    description: 'Get personalized broker recommendations based on trading preferences.',
    category: 'AI & Recommendations',
    requestBody: {
      type: 'application/json',
      description: 'Trading preferences and requirements',
      example: JSON.stringify({
        trading_style: 'scalping',
        capital: 5000,
        experience_level: 'intermediate',
        preferred_platforms: ['MetaTrader 5'],
        country: 'US',
        instruments: ['forex', 'indices']
      }, null, 2)
    },
    responses: [
      {
        status: 200,
        description: 'Personalized recommendations',
        example: JSON.stringify({
          recommendations: [
            {
              broker_id: 'ic-markets',
              match_score: 95,
              reasons: [
                'Excellent for scalping with low spreads',
                'Strong regulation and trust score',
                'Supports MetaTrader 5'
              ]
            }
          ],
          total_analyzed: 150
        }, null, 2)
      }
    ],
    example: {
      request: JSON.stringify({
        trading_style: 'scalping',
        capital: 5000,
        country: 'US'
      }, null, 2),
      response: JSON.stringify({
        recommendations: [{
          broker_id: 'ic-markets',
          match_score: 95,
          reasons: ['Low spreads', 'Strong regulation']
        }]
      }, null, 2)
    },
    rateLimit: '20 requests per minute',
    authentication: true
  }
];

const categories = ['All', 'Brokers', 'Comparisons', 'AI & Recommendations', 'Analytics'];

export default function ApiDocsPageClient() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [testResponse, setTestResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState('');

  const filteredEndpoints = apiEndpoints.filter(endpoint => {
    const matchesCategory = selectedCategory === 'All' || endpoint.category === selectedCategory;
    const matchesSearch = endpoint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         endpoint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         endpoint.path.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800';
      case 'POST': return 'bg-blue-100 text-blue-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const testEndpoint = async (endpoint: ApiEndpoint) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setTestResponse(endpoint.example.response);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          API Documentation
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Integrate Brokeranalysis data into your applications with our comprehensive RESTful API. 
          Access broker information, trust scores, comparisons, and AI-powered recommendations.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Badge className="px-4 py-2 text-blue-600 bg-blue-100">
            <Database className="w-4 h-4 mr-2" />
            150+ Brokers
          </Badge>
          <Badge className="px-4 py-2 text-green-600 bg-green-100">
            <Zap className="w-4 h-4 mr-2" />
            Real-time Data
          </Badge>
          <Badge className="px-4 py-2 text-purple-600 bg-purple-100">
            <Shield className="w-4 h-4 mr-2" />
            Secure & Reliable
          </Badge>
        </div>
      </div>

      {/* Quick Start */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="w-5 h-5" />
            Quick Start Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">1. Get API Key</h3>
              <p className="text-sm text-gray-600">Sign up for a free account to get your API key and start making requests.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">2. Make Requests</h3>
              <p className="text-sm text-gray-600">Use our RESTful endpoints to access broker data, comparisons, and recommendations.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">3. Build & Scale</h3>
              <p className="text-sm text-gray-600">Integrate our data into your applications and scale with our robust infrastructure.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search endpoints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Endpoints List */}
          <div>
            <h3 className="font-semibold mb-3">Endpoints</h3>
            <div className="space-y-2">
              {filteredEndpoints.map(endpoint => (
                <button
                  key={endpoint.id}
                  onClick={() => setSelectedEndpoint(endpoint)}
                  className={`w-full text-left p-3 rounded-md border transition-colors ${
                    selectedEndpoint?.id === endpoint.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={`text-xs ${getMethodColor(endpoint.method)}`}>
                      {endpoint.method}
                    </Badge>
                    {endpoint.authentication && (
                      <Shield className="w-3 h-3 text-gray-400" />
                    )}
                  </div>
                  <div className="font-medium text-sm">{endpoint.title}</div>
                  <div className="text-xs text-gray-600 font-mono">{endpoint.path}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {selectedEndpoint ? (
            <div className="space-y-6">
              {/* Endpoint Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className={`${getMethodColor(selectedEndpoint.method)}`}>
                      {selectedEndpoint.method}
                    </Badge>
                    <code className="text-lg font-mono">{selectedEndpoint.path}</code>
                    {selectedEndpoint.authentication && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Shield className="w-3 h-3 mr-1" />
                        Auth Required
                      </Badge>
                    )}
                  </div>
                  <CardTitle>{selectedEndpoint.title}</CardTitle>
                  <p className="text-gray-600">{selectedEndpoint.description}</p>
                  {selectedEndpoint.rateLimit && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <AlertCircle className="w-4 h-4" />
                      Rate limit: {selectedEndpoint.rateLimit}
                    </div>
                  )}
                </CardHeader>
              </Card>

              {/* Parameters */}
              {selectedEndpoint.parameters && selectedEndpoint.parameters.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Parameters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedEndpoint.parameters.map(param => (
                        <div key={param.name} className="border-b border-gray-200 pb-4 last:border-b-0">
                          <div className="flex items-center gap-2 mb-2">
                            <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                              {param.name}
                            </code>
                            <Badge className={param.required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}>
                              {param.required ? 'Required' : 'Optional'}
                            </Badge>
                            <span className="text-sm text-gray-600">{param.type}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{param.description}</p>
                          {param.example && (
                            <div className="text-sm">
                              <span className="text-gray-500">Example: </span>
                              <code className="bg-gray-100 px-1 rounded">{param.example}</code>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Request Body */}
              {selectedEndpoint.requestBody && (
                <Card>
                  <CardHeader>
                    <CardTitle>Request Body</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{selectedEndpoint.requestBody.description}</p>
                    <div className="relative">
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{selectedEndpoint.requestBody.example}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(selectedEndpoint.requestBody!.example, 'request-body')}
                      >
                        {copiedCode === 'request-body' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Responses */}
              <Card>
                <CardHeader>
                  <CardTitle>Responses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedEndpoint.responses.map((response, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={response.status === 200 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {response.status}
                          </Badge>
                          <span className="text-sm font-medium">{response.description}</span>
                        </div>
                        <div className="relative">
                          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                            <code>{response.example}</code>
                          </pre>
                          <Button
                            size="sm"
                            variant="outline"
                            className="absolute top-2 right-2"
                            onClick={() => copyToClipboard(response.example, `response-${index}`)}
                          >
                            {copiedCode === `response-${index}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Try It Out */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Try It Out
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedEndpoint.authentication && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">API Key</label>
                      <Input
                        type="password"
                        placeholder="Enter your API key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                      />
                    </div>
                  )}
                  
                  <Button
                    onClick={() => testEndpoint(selectedEndpoint)}
                    disabled={isLoading || (selectedEndpoint.authentication && !apiKey)}
                    className="mb-4"
                  >
                    {isLoading ? 'Testing...' : 'Send Request'}
                    <Play className="w-4 h-4 ml-2" />
                  </Button>
                  
                  {testResponse && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Response</label>
                      <div className="relative">
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm max-h-96">
                          <code>{testResponse}</code>
                        </pre>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(testResponse, 'test-response')}
                        >
                          {copiedCode === 'test-response' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="h-96 flex items-center justify-center">
              <div className="text-center">
                <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Endpoint</h3>
                <p className="text-gray-600">Choose an endpoint from the sidebar to view its documentation and try it out.</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mt-12">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Sign up for a free API key and start integrating Brokeranalysis data into your applications today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Get Free API Key
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                View Examples
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}