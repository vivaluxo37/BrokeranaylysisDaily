'use client';

import { useState } from 'react';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Briefcase, 
  GraduationCap,
  Heart,
  Coffee,
  Laptop,
  Globe,
  TrendingUp,
  Shield,
  Award,
  Target,
  Zap,
  ChevronRight,
  ExternalLink,
  Filter,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const jobOpenings = [
  {
    id: 1,
    title: 'Senior Full Stack Developer',
    department: 'Engineering',
    location: 'Remote (US)',
    type: 'Full-time',
    salary: '$120,000 - $160,000',
    experience: '5+ years',
    description: 'Build and maintain our AI-powered broker recommendation platform using Next.js, React, and Node.js.',
    requirements: [
      'Expert knowledge of React, Next.js, and TypeScript',
      'Experience with financial APIs and real-time data',
      'Strong understanding of database design and optimization',
      'Experience with AI/ML integration preferred'
    ],
    posted: '2 days ago',
    urgent: true
  },
  {
    id: 2,
    title: 'AI/ML Engineer',
    department: 'Data Science',
    location: 'Remote (Global)',
    type: 'Full-time',
    salary: '$130,000 - $180,000',
    experience: '4+ years',
    description: 'Develop and improve our AI recommendation algorithms and natural language processing systems.',
    requirements: [
      'PhD or Masters in Computer Science, AI, or related field',
      'Experience with Python, TensorFlow, and PyTorch',
      'Knowledge of NLP and recommendation systems',
      'Experience with financial data analysis preferred'
    ],
    posted: '1 week ago',
    urgent: false
  },
  {
    id: 3,
    title: 'Financial Data Analyst',
    department: 'Research',
    location: 'Sheridan, WY / Remote',
    type: 'Full-time',
    salary: '$80,000 - $110,000',
    experience: '3+ years',
    description: 'Analyze broker data, market trends, and develop trust score methodologies for our platform.',
    requirements: [
      'Bachelor\'s degree in Finance, Economics, or related field',
      'CFA or FRM certification preferred',
      'Experience with financial markets and broker analysis',
      'Strong analytical and statistical skills'
    ],
    posted: '3 days ago',
    urgent: false
  },
  {
    id: 4,
    title: 'Product Manager',
    department: 'Product',
    location: 'Remote (US)',
    type: 'Full-time',
    salary: '$110,000 - $140,000',
    experience: '4+ years',
    description: 'Lead product strategy and development for our broker recommendation and comparison tools.',
    requirements: [
      'Experience in fintech or financial services',
      'Strong understanding of user experience design',
      'Data-driven decision making skills',
      'Experience with agile development methodologies'
    ],
    posted: '5 days ago',
    urgent: false
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Remote (Global)',
    type: 'Full-time',
    salary: '$100,000 - $130,000',
    experience: '3+ years',
    description: 'Manage our cloud infrastructure, CI/CD pipelines, and ensure platform reliability and security.',
    requirements: [
      'Experience with AWS, Docker, and Kubernetes',
      'Knowledge of infrastructure as code (Terraform)',
      'Experience with monitoring and logging systems',
      'Security best practices in financial applications'
    ],
    posted: '1 week ago',
    urgent: false
  },
  {
    id: 6,
    title: 'Content Marketing Manager',
    department: 'Marketing',
    location: 'Remote (US)',
    type: 'Full-time',
    salary: '$70,000 - $95,000',
    experience: '3+ years',
    description: 'Create and manage content strategy for our blog, guides, and educational materials.',
    requirements: [
      'Experience in financial content creation',
      'Strong writing and editing skills',
      'SEO and content marketing expertise',
      'Understanding of trading and investment concepts'
    ],
    posted: '4 days ago',
    urgent: false
  }
];

const benefits = [
  {
    icon: Heart,
    title: 'Health & Wellness',
    description: 'Comprehensive health, dental, and vision insurance with 100% premium coverage for employees.'
  },
  {
    icon: Coffee,
    title: 'Flexible Work',
    description: 'Remote-first culture with flexible hours and unlimited PTO policy.'
  },
  {
    icon: Laptop,
    title: 'Equipment & Setup',
    description: 'Top-tier equipment, home office stipend, and co-working space allowance.'
  },
  {
    icon: GraduationCap,
    title: 'Learning & Development',
    description: '$2,000 annual learning budget for courses, conferences, and certifications.'
  },
  {
    icon: DollarSign,
    title: 'Equity & Bonuses',
    description: 'Competitive equity package and performance-based bonuses.'
  },
  {
    icon: Globe,
    title: 'Global Team',
    description: 'Work with talented professionals from around the world in a diverse, inclusive environment.'
  }
];

const cultureValues = [
  {
    icon: Target,
    title: 'Mission-Driven',
    description: 'We\'re passionate about helping traders make informed decisions and democratizing access to financial markets.'
  },
  {
    icon: TrendingUp,
    title: 'Growth Mindset',
    description: 'We embrace challenges, learn from failures, and continuously improve our skills and products.'
  },
  {
    icon: Shield,
    title: 'Transparency',
    description: 'We believe in open communication, honest feedback, and transparent business practices.'
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'We work together across teams and time zones to achieve our common goals.'
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'We leverage cutting-edge technology to solve complex problems in the financial industry.'
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We strive for the highest quality in everything we do, from code to customer service.'
  }
];

const departments = [
  { name: 'All Departments', value: 'all' },
  { name: 'Engineering', value: 'engineering' },
  { name: 'Data Science', value: 'data-science' },
  { name: 'Research', value: 'research' },
  { name: 'Product', value: 'product' },
  { name: 'Marketing', value: 'marketing' },
  { name: 'Operations', value: 'operations' }
];

const locations = [
  { name: 'All Locations', value: 'all' },
  { name: 'Remote (US)', value: 'remote-us' },
  { name: 'Remote (Global)', value: 'remote-global' },
  { name: 'Sheridan, WY', value: 'sheridan-wy' },
  { name: 'Hybrid', value: 'hybrid' }
];

export default function CareersPageClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [activeTab, setActiveTab] = useState('jobs');

  const filteredJobs = jobOpenings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || 
                             job.department.toLowerCase().replace(' ', '-') === selectedDepartment;
    const matchesLocation = selectedLocation === 'all' || 
                           job.location.toLowerCase().includes(selectedLocation.replace('-', ' '));
    
    return matchesSearch && matchesDepartment && matchesLocation;
  });

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Build the Future of <span className="text-yellow-400">Finance</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto mb-8">
              Join our mission to democratize access to financial markets through AI-powered 
              broker recommendations and transparent analysis.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-yellow-400 text-blue-900 hover:bg-yellow-300">
                View Open Positions
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900">
                Learn About Our Culture
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Team Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">15+</div>
              <div className="text-gray-600">Countries</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-gray-600">Remote-First</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">$2M+</div>
              <div className="text-gray-600">Series A Funding</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-12">
              <TabsTrigger value="jobs">Open Positions</TabsTrigger>
              <TabsTrigger value="culture">Our Culture</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="process">Hiring Process</TabsTrigger>
            </TabsList>

            {/* Jobs Tab */}
            <TabsContent value="jobs" className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Open Positions</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  We're looking for talented individuals who share our passion for financial technology 
                  and want to make a real impact in the trading community.
                </p>
              </div>

              {/* Filters */}
              <Card className="p-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search positions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.value} value={dept.value}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.value} value={location.value}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </Card>

              {/* Job Listings */}
              <div className="space-y-6">
                {filteredJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl">{job.title}</CardTitle>
                            {job.urgent && (
                              <Badge variant="destructive" className="text-xs">
                                Urgent
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-base">
                            {job.description}
                          </CardDescription>
                        </div>
                        <Button className="ml-4">
                          Apply Now
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="flex items-center text-sm text-gray-600">
                          <Briefcase className="w-4 h-4 mr-2" />
                          {job.department}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {job.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          {job.type}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign className="w-4 h-4 mr-2" />
                          {job.salary}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Key Requirements:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {job.requirements.slice(0, 2).map((req, index) => (
                            <li key={index} className="flex items-start">
                              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Posted {job.posted}</span>
                        <span>{job.experience} experience</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredJobs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No positions match your current filters.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedDepartment('all');
                      setSelectedLocation('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Culture Tab */}
            <TabsContent value="culture" className="space-y-12">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Culture & Values</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  We're building more than just a product – we're creating a culture of innovation, 
                  transparency, and continuous learning.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cultureValues.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <Card key={index} className="text-center">
                      <CardHeader>
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icon className="w-8 h-8 text-blue-600" />
                        </div>
                        <CardTitle className="text-xl">{value.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{value.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Team Testimonials */}
              <div className="bg-white rounded-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">What Our Team Says</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="text-gray-700 mb-4 italic">
                      "Working at Brokeranalysis has been incredible. The team is supportive, 
                      the technology is cutting-edge, and I feel like I'm making a real impact 
                      in the financial industry."
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                        S
                      </div>
                      <div>
                        <p className="font-semibold">Sarah Chen</p>
                        <p className="text-sm text-gray-600">Senior AI Engineer</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="text-gray-700 mb-4 italic">
                      "The remote-first culture and flexible hours allow me to do my best work 
                      while maintaining a healthy work-life balance. Plus, the learning budget 
                      has helped me grow tremendously."
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                        M
                      </div>
                      <div>
                        <p className="font-semibold">Marcus Rodriguez</p>
                        <p className="text-sm text-gray-600">Product Manager</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Benefits Tab */}
            <TabsContent value="benefits" className="space-y-12">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Benefits & Perks</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  We believe in taking care of our team with comprehensive benefits and perks 
                  that support both professional and personal growth.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icon className="w-8 h-8 text-blue-600" />
                        </div>
                        <CardTitle className="text-xl">{benefit.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{benefit.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Additional Benefits */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Additional Perks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Professional Development</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Conference attendance and speaking opportunities</li>
                        <li>• Mentorship programs and career coaching</li>
                        <li>• Internal tech talks and knowledge sharing</li>
                        <li>• Open source contribution time</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Work-Life Balance</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Flexible working hours across time zones</li>
                        <li>• Mental health and wellness support</li>
                        <li>• Team retreats and virtual social events</li>
                        <li>• Sabbatical opportunities for long-term employees</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Process Tab */}
            <TabsContent value="process" className="space-y-12">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Hiring Process</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  We've designed our hiring process to be transparent, efficient, and focused on 
                  finding the right cultural and technical fit.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Application Review</h3>
                    <p className="text-gray-600 mb-2">
                      Our team reviews your application and resume. We look for relevant experience, 
                      passion for fintech, and alignment with our values.
                    </p>
                    <p className="text-sm text-gray-500">Timeline: 3-5 business days</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Initial Screening</h3>
                    <p className="text-gray-600 mb-2">
                      A 30-minute video call with our talent team to discuss your background, 
                      interests, and learn more about the role and company.
                    </p>
                    <p className="text-sm text-gray-500">Timeline: 30 minutes</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Technical Assessment</h3>
                    <p className="text-gray-600 mb-2">
                      Role-specific technical evaluation. For engineers, this includes coding challenges. 
                      For other roles, we'll have relevant case studies or portfolio reviews.
                    </p>
                    <p className="text-sm text-gray-500">Timeline: 1-2 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Interviews</h3>
                    <p className="text-gray-600 mb-2">
                      Meet with team members you'll be working with directly. We focus on collaboration, 
                      problem-solving, and cultural fit.
                    </p>
                    <p className="text-sm text-gray-500">Timeline: 2-3 hours (split across multiple sessions)</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                    5
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Final Interview</h3>
                    <p className="text-gray-600 mb-2">
                      A conversation with our leadership team about your vision, goals, and how you 
                      can contribute to Brokeranalysis's mission.
                    </p>
                    <p className="text-sm text-gray-500">Timeline: 45 minutes</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Offer & Onboarding</h3>
                    <p className="text-gray-600 mb-2">
                      We'll extend an offer and work with you on start date, equipment setup, and 
                      comprehensive onboarding to set you up for success.
                    </p>
                    <p className="text-sm text-gray-500">Timeline: 1-2 weeks</p>
                  </div>
                </div>
              </div>

              <Card className="bg-blue-50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Interview Tips</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Research our company, products, and recent news</li>
                    <li>• Prepare specific examples of your work and impact</li>
                    <li>• Think about how your skills align with our mission</li>
                    <li>• Come with questions about the role and team</li>
                    <li>• Be yourself – we value authenticity and diverse perspectives</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Join Our Team?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Don't see a perfect fit? We're always interested in hearing from talented individuals 
            who are passionate about financial technology.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-yellow-400 text-blue-900 hover:bg-yellow-300">
              View All Positions
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900">
              Send Us Your Resume
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}