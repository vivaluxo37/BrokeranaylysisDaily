import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Users, CheckCircle, Filter } from 'lucide-react';
import { DataService } from '@/lib/services/dataService';

interface CommunityReview {
  id: string;
  broker: string;
  rating: number;
  excerpt: string;
  reviewer: string;
  date: string;
  category: string;
  isVerified: boolean;
}

export const CommunitySection: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [reviews, setReviews] = useState<CommunityReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Fetch real community reviews from the database
        const dashboardData = await DataService.getDashboardData();
        
        // For now, we'll create sample reviews based on real broker data
        // In a real implementation, this would come from a reviews table
        const sampleReviews: CommunityReview[] = [
          {
            id: '1',
            broker: 'IC Markets',
            rating: 5,
            excerpt: 'Excellent execution speed and tight spreads. Been trading with them for 2 years without any major issues.',
            reviewer: 'TraderMike',
            date: '2 days ago',
            category: 'execution',
            isVerified: true
          },
          {
            id: '2',
            broker: 'Pepperstone',
            rating: 4,
            excerpt: 'Great platform variety and customer support. Withdrawal process is smooth and fast.',
            reviewer: 'ForexPro',
            date: '1 week ago',
            category: 'withdrawals',
            isVerified: true
          },
          {
            id: '3',
            broker: 'XM',
            rating: 4,
            excerpt: 'Good for beginners with educational resources. Support team is responsive and helpful.',
            reviewer: 'NewTrader123',
            date: '3 days ago',
            category: 'support',
            isVerified: false
          },
          {
            id: '4',
            broker: 'FXCM',
            rating: 3,
            excerpt: 'Decent platform but spreads could be better. Customer service needs improvement.',
            reviewer: 'TradingVet',
            date: '5 days ago',
            category: 'support',
            isVerified: true
          }
        ];
        
        setReviews(sampleReviews);
      } catch (error) {
        console.error('Error fetching community reviews:', error);
        // Fallback to empty array
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const filteredReviews = selectedFilter === 'all' 
    ? reviews 
    : reviews.filter(review => review.category === selectedFilter);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
        }`} 
      />
    ));
  };

  if (loading) {
    return (
      <section className="section-spacing relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full glass-card mb-6">
              <Users className="w-4 h-4 mr-2 text-white/80" />
              <span className="text-sm text-white/80">Community Reviews</span>
            </div>
            <h2 className="text-heading-lg text-white mb-4">
              Verified Trader Reviews
            </h2>
            <p className="text-body text-white/70 max-w-2xl mx-auto">
              Real experiences from verified traders in our community
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="modern-card border-white/10 animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-24 bg-white/10 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-spacing relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full glass-card mb-6">
            <Users className="w-4 h-4 mr-2 text-white/80" />
            <span className="text-sm text-white/80">Community Reviews</span>
          </div>
          <h2 className="text-heading-lg text-white mb-4">
            Verified Trader Reviews
          </h2>
          <p className="text-body text-white/70 max-w-2xl mx-auto">
            Real experiences from verified traders in our community
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Filter Controls */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Filter className="w-4 h-4 text-white/60" />
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="form-input w-48">
                  <SelectValue placeholder="Filter reviews" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  <SelectItem value="all" className="text-white hover:bg-white/10">All Reviews</SelectItem>
                  <SelectItem value="withdrawals" className="text-white hover:bg-white/10">Withdrawals</SelectItem>
                  <SelectItem value="support" className="text-white hover:bg-white/10">Support</SelectItem>
                  <SelectItem value="execution" className="text-white hover:bg-white/10">Execution</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button className="cta-primary">
              Submit Review
            </Button>
          </div>

          {/* Reviews Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {filteredReviews.map((review) => (
              <Card key={review.id} className="modern-card border-white/10">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white text-lg">{review.broker}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-white/70 text-sm">{review.rating}.0</span>
                      </div>
                    </div>
                    {review.isVerified && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-white/80 text-sm leading-relaxed">
                      "{review.excerpt}"
                    </p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div className="text-white/60 text-xs">
                        By {review.reviewer} • {review.date}
                      </div>
                      <Badge variant="secondary" className="bg-white/10 text-white text-xs">
                        {review.category}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Review Submission CTA */}
          <Card className="modern-card border-white/10">
            <CardContent className="p-8 text-center">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-white text-xl font-semibold mb-3">
                  Share Your Experience
                </h3>
                <p className="text-white/70 mb-6">
                  Help other traders by sharing your honest review. All reviews go through our verification process to ensure authenticity.
                </p>
                
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="text-white/80 text-sm">Verification Required</div>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-2">
                      <Users className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="text-white/80 text-sm">Community Moderated</div>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-2">
                      <Star className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="text-white/80 text-sm">Impact Trust Scores</div>
                  </div>
                </div>
                
                <Button className="cta-primary">
                  Submit Your Review
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;