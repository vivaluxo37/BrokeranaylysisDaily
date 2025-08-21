UPDATE articles 
SET author_id = CASE 
    WHEN slug = 'webinar-chart-like-a-pro-on-tradingview-march-13-2024' THEN 'f6309044-c235-4145-b2d5-386156dcc32a'
WHEN slug = 'webinar-indicator-crossovers-march-28-2024' THEN 'f6309044-c235-4145-b2d5-386156dcc32a'
WHEN slug = 'webinar-enhance-crossovers-breakouts-march-27-2024' THEN '85df8fd0-47ee-4bbb-ac2e-259b43d71e48'
WHEN slug = 'webinar-fundamental-analysis-mastery-march-20-2024' THEN '2b43d904-cafd-4bd2-b260-6fefe30b4583'
WHEN slug = 'webinar-parabolic-sar-adx-march-14-2024' THEN '030695b2-4c96-4c83-b837-bd11434fe982'
WHEN slug = 'webinar-scalpers-trade-management-rules-march-26-2024' THEN '3b0f0bb0-6498-4755-a03b-e1f58681725e'
WHEN slug = 'webinar-gold-history-trading-strategies-march-7-2024' THEN '8e44030f-679b-4e3b-92ff-d8f8acc9b970'
WHEN slug = 'webinar-what-is-a-strategy-march-21-2024' THEN '81dd6558-3345-4b6d-9b06-3f7334304129'
    ELSE author_id 
END
WHERE slug IN ('webinar-chart-like-a-pro-on-tradingview-march-13-2024', 'webinar-indicator-crossovers-march-28-2024', 'webinar-enhance-crossovers-breakouts-march-27-2024', 'webinar-fundamental-analysis-mastery-march-20-2024', 'webinar-parabolic-sar-adx-march-14-2024', 'webinar-scalpers-trade-management-rules-march-26-2024', 'webinar-gold-history-trading-strategies-march-7-2024', 'webinar-what-is-a-strategy-march-21-2024') AND author_id IS NULL;