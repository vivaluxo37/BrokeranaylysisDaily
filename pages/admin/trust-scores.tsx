import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UpdateResult {
  id: string;
  name: string;
  trust_score: number;
}

interface UpdateResponse {
  success: boolean;
  message: string;
  updated_count: number;
  error_count: number;
  total_brokers: number;
  results: UpdateResult[];
}

const TrustScoreAdmin: NextPage = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateResult, setUpdateResult] = useState<UpdateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateTrustScores = async () => {
    setIsUpdating(true);
    setError(null);
    setUpdateResult(null);

    try {
      const response = await fetch('/api/update-trust-scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update trust scores');
      }

      setUpdateResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 70) return 'bg-blue-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTrustScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Poor';
  };

  return (
    <>
      <Head>
        <title>Trust Score Management - Broker Analysis Admin</title>
        <meta name="description" content="Manage and update broker trust scores" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Trust Score Management
            </h1>
            <p className="text-gray-600">
              Update and manage broker trust scores using our evidence-based algorithm
            </p>
          </div>

          {/* Update Controls */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trust Score Updates
              </CardTitle>
              <CardDescription>
                Recalculate trust scores for all brokers using the latest algorithm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleUpdateTrustScores}
                  disabled={isUpdating}
                  className="flex items-center gap-2"
                >
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  {isUpdating ? 'Updating...' : 'Update All Trust Scores'}
                </Button>
                
                {updateResult && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Last updated: {new Date().toLocaleString()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Alert className="mb-8 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Update Results */}
          {updateResult && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-green-700">Update Complete</CardTitle>
                <CardDescription>
                  {updateResult.message}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700">
                      {updateResult.total_brokers}
                    </div>
                    <div className="text-sm text-blue-600">Total Brokers</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">
                      {updateResult.updated_count}
                    </div>
                    <div className="text-sm text-green-600">Successfully Updated</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-red-700">
                      {updateResult.error_count}
                    </div>
                    <div className="text-sm text-red-600">Errors</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-700">
                      {Math.round((updateResult.updated_count / updateResult.total_brokers) * 100)}%
                    </div>
                    <div className="text-sm text-purple-600">Success Rate</div>
                  </div>
                </div>

                {/* Sample Results */}
                {updateResult.results && updateResult.results.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Sample Updated Brokers</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {updateResult.results.map((result) => (
                        <div
                          key={result.id}
                          className="border rounded-lg p-4 bg-white shadow-sm"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 truncate">
                              {result.name}
                            </h4>
                            <Badge
                              className={`text-white ${getTrustScoreColor(result.trust_score)}`}
                            >
                              {result.trust_score.toFixed(1)}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            {getTrustScoreLabel(result.trust_score)} Trust Score
                          </div>
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getTrustScoreColor(result.trust_score)}`}
                                style={{ width: `${result.trust_score}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Algorithm Information */}
          <Card>
            <CardHeader>
              <CardTitle>Trust Score Algorithm</CardTitle>
              <CardDescription>
                Our evidence-based scoring methodology
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700 mb-1">30%</div>
                  <div className="text-sm font-medium text-blue-600">Regulation</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Licensing & compliance
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700 mb-1">25%</div>
                  <div className="text-sm font-medium text-green-600">Financial Stability</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Capital & insurance
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-700 mb-1">20%</div>
                  <div className="text-sm font-medium text-purple-600">User Feedback</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Reviews & ratings
                  </div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-700 mb-1">15%</div>
                  <div className="text-sm font-medium text-yellow-600">Transparency</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Disclosure & clarity
                  </div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-700 mb-1">10%</div>
                  <div className="text-sm font-medium text-red-600">Platform Reliability</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Uptime & execution
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Scoring Methodology</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Each component is scored 0-100 based on objective criteria</li>
                  <li>• Weighted average produces final trust score</li>
                  <li>• Regular updates ensure accuracy and relevance</li>
                  <li>• Evidence-based approach minimizes bias</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default TrustScoreAdmin;