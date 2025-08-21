// Mock data for broker analysis platform

export const mockBrokers = [
  {
    id: "broker-1",
    name: "TradePro",
    logo: "https://images.unsplash.com/photo-1633544325196-bcf8bf81ead0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwzfHxsb2dvJTIwZmluYW5jaWFsJTIwY29ycG9yYXRlfGVufDB8Mnx8Ymx1ZXwxNzU1NjQ2NjI0fDA&ixlib=rb-4.1.0&q=85",
    rating: 4.8,
    trustScore: 95,
    pros: ["Low spreads", "Advanced charting", "24/7 support"],
    cons: ["High minimum deposit"],
    specialties: ["Forex", "Crypto", "Stocks"],
    featured: true
  },
  {
    id: "broker-2", 
    name: "CryptoEdge",
    logo: "https://images.unsplash.com/photo-1662201966782-395ada85ec09?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw0fHxsb2dvJTIwZmludGVjaCUyMG1vZGVybnxlbnwwfDJ8fGdyZWVufDE3NTU2NDY2MjR8MA&ixlib=rb-4.1.0&q=85",
    rating: 4.6,
    trustScore: 88,
    pros: ["Crypto focus", "Low fees", "Mobile app"],
    cons: ["Limited stocks"],
    specialties: ["Crypto", "DeFi", "NFTs"],
    featured: true
  },
  {
    id: "broker-3",
    name: "GlobalTrade",
    logo: "https://images.unsplash.com/photo-1651071972919-9455fa5392fa?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxsb2dvJTIwZmluYW5jaWFsJTIwY29ycG9yYXRlfGVufDB8Mnx8Ymx1ZXwxNzU1NjQ2NjI0fDA&ixlib=rb-4.1.0&q=85",
    rating: 4.4,
    trustScore: 92,
    pros: ["Global markets", "Research tools", "Education"],
    cons: ["Higher spreads"],
    specialties: ["Stocks", "ETFs", "Options"],
    featured: true
  },
  {
    id: "broker-4",
    name: "FastTrade",
    logo: "https://images.unsplash.com/photo-1643044404519-c49bf2693abf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxsb2dvJTIwZmludGVjaCUyMG1vZGVybnxlbnwwfDJ8fGdyZWVufDE3NTU2NDY2MjR8MA&ixlib=rb-4.1.0&q=85",
    rating: 4.2,
    trustScore: 85,
    pros: ["Fast execution", "API access", "Low costs"],
    cons: ["Basic platform"],
    specialties: ["Forex", "Commodities"],
    featured: false
  }
];

export const mockAIChat = {
  userMessage: "Which broker is best for crypto and low spreads?",
  aiResponse: {
    text: "Based on your criteria, I recommend these top brokers for crypto trading with competitive spreads:",
    recommendations: [
      {
        broker: mockBrokers[1], // CryptoEdge
        reasoning: "Specialized in crypto with industry-leading low fees and comprehensive DeFi support"
      },
      {
        broker: mockBrokers[0], // TradePro
        reasoning: "Excellent for crypto with very low spreads and advanced trading tools"
      }
    ]
  }
};

export const mockValueProps = [
  {
    id: "data-driven",
    title: "Data-Driven Insights",
    description: "Powered by our comprehensive 2GB+ broker dataset with real-time analysis",
    icon: "Database",
    stats: "2GB+ Data"
  },
  {
    id: "ai-powered", 
    title: "AI-Powered Recommendations",
    description: "Personalized broker matching using advanced machine learning algorithms",
    icon: "Bot",
    stats: "95% Accuracy"
  },
  {
    id: "trusted-reviews",
    title: "Trusted Reviews",
    description: "Transparent, unbiased reviews from verified traders and industry experts",
    icon: "ShieldCheck",
    stats: "50K+ Reviews"
  }
];

export const mockBlogArticles = [
  {
    id: "article-1",
    title: "Top 5 Crypto Brokers for 2025",
    excerpt: "Comprehensive analysis of the best cryptocurrency trading platforms with detailed comparisons of fees, features, and security.",
    image: "https://images.unsplash.com/photo-1612966809481-b84cb86ee3f3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw4fHxjcnlwdG9jdXJyZW5jeSUyMGRpZ2l0YWwlMjB0ZWNobm9sb2d5fGVufDB8MHx8b3JhbmdlfDE3NTU2NDY2MjR8MA&ixlib=rb-4.1.0&q=85",
    author: "Sarah Chen",
    date: "2025-01-15",
    readTime: "8 min read",
    category: "Crypto"
  },
  {
    id: "article-2", 
    title: "AI in Trading: How Machine Learning is Changing Broker Selection",
    excerpt: "Explore how artificial intelligence is revolutionizing the way traders choose brokers and optimize their trading strategies.",
    image: "https://images.unsplash.com/photo-1643409471378-cdab0f97d983?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw1fHxBSSUyMG1hY2hpbmUlMjBsZWFybmluZyUyMGRhdGF8ZW58MHwwfHxwdXJwbGV8MTc1NTY0NjYyNHww&ixlib=rb-4.1.0&q=85",
    author: "Michael Rodriguez",
    date: "2025-01-12",
    readTime: "6 min read",
    category: "Technology"
  },
  {
    id: "article-3",
    title: "Understanding Broker Trust Scores: A Complete Guide",
    excerpt: "Learn how our proprietary trust scoring system evaluates broker reliability, regulation, and user satisfaction.",
    image: "https://images.unsplash.com/photo-1660020619062-70b16c44bf0f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxjaGFydHMlMjB0cmFkaW5nJTIwZmluYW5jZXxlbnwwfDB8fGJsdWV8MTc1NTY0NjYyNHww&ixlib=rb-4.1.0&q=85",
    author: "David Kim",
    date: "2025-01-10", 
    readTime: "5 min read",
    category: "Education"
  }
];

export const mockFooterLinks = {
  usefulLinks: [
    { name: "Brokers", href: "/brokers" },
    { name: "Reviews", href: "/reviews" },
    { name: "Tools", href: "/tools" },
    { name: "AI Assistant", href: "/ai-assistant" },
    { name: "Blog", href: "/blog" }
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
    { name: "Sitemap", href: "/sitemap" }
  ],
  social: [
    { name: "LinkedIn", href: "#", icon: "linkedin" },
    { name: "X/Twitter", href: "#", icon: "twitter" },
    { name: "YouTube", href: "#", icon: "youtube" },
    { name: "Telegram", href: "#", icon: "telegram" }
  ]
};