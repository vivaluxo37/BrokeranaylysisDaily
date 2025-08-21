-- Individual article migration 189
INSERT INTO articles (title, slug, content, excerpt, category, subcategory, author_id, published_at, meta_description, meta_keywords, featured_image_url, status, view_count, tags, language) 
VALUES ('Webinar: Trading Basics - March 13, 2024', 'webinar-trading-basics---march-13-2024', 'Trading BasicsJoin today’s webinar where our analyst, Michalis, will be covering the “basics” of trading including:Trading TermsAnalysis basicsStrategies & ordersDon''''t miss the opportunity, register now to improve your trading skills!'',
    ''This Webinar is led by HFM for Beginner Traders. Author: Michalis Efthymiou HFM’s Analyst. Enter to learn more information and register!'',
    ''webinar-trading-basics-march-13-2024'',
    ''General'',
    ''Broker Analysis'',
    NULL,
    ''published'',
    ''2025-08-21T13:04:34.516759'',
    ''2025-08-21T13:04:34.516770'',
    ''C:\Users\LENOVO\Desktop\BrokeranalysisDaily\daily forex\www.dailyforex.com\forex-webinars\2024\03\trading-basics-march-13-2024\208989.html'',
    ''This Webinar is led by HFM for Beginner Traders. Author: Michalis Efthymiou HFM’s Analyst. Enter to learn more information and register!', 'Trading BasicsJoin today’s webinar where our analyst, Michalis, will be covering the “basics” of trading including:Trading TermsAnalysis basicsStrategies & ordersDon''''t miss the opportunity, register ...', 'Forex', NULL, (SELECT id FROM authors WHERE name = 'Broker Analysis' LIMIT 1), '2025-06-01 10:00:00+00', 'Trading BasicsJoin today’s webinar where our analyst, Michalis, will be covering the “basics” of trading including:Trading TermsAnalysis basicsStrategies & ordersDon''''t miss the opportunity, register ...', 'forex, currency analysis', NULL, 'published', 0, ARRAY['forex', 'currency analysis'], 'en');