UPDATE articles 
SET author_id = CASE 
    WHEN slug = 'usdzar-monthly-forecast-july-2025-chart' THEN 'bd08ef61-e6c7-4243-af60-3ed5c9f45bb5'
WHEN slug = 'weekly-forex-forecast-july-06th-july-12th-charts' THEN '030695b2-4c96-4c83-b837-bd11434fe982'
WHEN slug = 'weekly-forex-forecast-july-13th-july-19th-charts' THEN '2b43d904-cafd-4bd2-b260-6fefe30b4583'
WHEN slug = 'weekly-forex-forecast-july-20th-july-26th-charts' THEN '8e44030f-679b-4e3b-92ff-d8f8acc9b970'
WHEN slug = 'weekly-forex-forecast-july-27th-august-01th-charts' THEN 'c0870ab6-d417-47b7-9fae-53a25197f573'
WHEN slug = 'bnb-price-today-1408-tests-resistance-chart' THEN '7fe3a1fd-9379-4b94-a584-48467130f9a3'
WHEN slug = 'crypto-bulls-are-back-btc-and-eth-surge-on-spike-chart' THEN '85df8fd0-47ee-4bbb-ac2e-259b43d71e48'
WHEN slug = 'eurusd-analysis-1108-trading-in-narrow-ranges-chart' THEN 'c0870ab6-d417-47b7-9fae-53a25197f573'
WHEN slug = 'eurusd-analysis-1308-euro-attempts-a-recovery-chart' THEN 'ab258406-f18d-4b84-a022-9c3b893bacfd'
WHEN slug = 'eurusd-analysis-today-1408-holds-near-117-chart' THEN 'bd08ef61-e6c7-4243-af60-3ed5c9f45bb5'
WHEN slug = 'eurusd-analysis-1808-euro-eyes-gains-chart' THEN '4a384f4a-5ec5-4535-9fbb-c4adec76007b'
WHEN slug = 'gbpusd-forecast-today-1408-looking-strong-videochart' THEN 'bc1ffac5-0a61-407e-b49e-d223eca56ca9'
WHEN slug = 'gold-analysis-1408-trading-attracts-buyers-chart' THEN '1390995c-17de-4f9e-9d9f-598280375bc3'
WHEN slug = 'gold-analysis-1808-recovers-from-recent-losses-chart' THEN 'bc1ffac5-0a61-407e-b49e-d223eca56ca9'
WHEN slug = 'weekly-pairs-in-focus-august-03-august-08-2025-charts' THEN 'cd73571d-8f37-404e-bfbc-d3f9523bdf0f'
WHEN slug = 'the-best-war-stocks-to-buy-now-chart' THEN '1972d21a-84a8-4ad9-a9b0-1defc8732c00'
WHEN slug = 'usdbrl-analysis-today-1308-long-term-lows-chart' THEN '1972d21a-84a8-4ad9-a9b0-1defc8732c00'
WHEN slug = 'weekly-forex-forecast-august-03th-august-08th-charts' THEN '85df8fd0-47ee-4bbb-ac2e-259b43d71e48'
WHEN slug = 'webinar-advanced-fx-trading-strategies-march-12-2024' THEN '1972d21a-84a8-4ad9-a9b0-1defc8732c00'
WHEN slug = 'webinar-alternative-indicator-strategy-march-6-2024' THEN '2b43d904-cafd-4bd2-b260-6fefe30b4583'
    ELSE author_id 
END
WHERE slug IN ('usdzar-monthly-forecast-july-2025-chart', 'weekly-forex-forecast-july-06th-july-12th-charts', 'weekly-forex-forecast-july-13th-july-19th-charts', 'weekly-forex-forecast-july-20th-july-26th-charts', 'weekly-forex-forecast-july-27th-august-01th-charts', 'bnb-price-today-1408-tests-resistance-chart', 'crypto-bulls-are-back-btc-and-eth-surge-on-spike-chart', 'eurusd-analysis-1108-trading-in-narrow-ranges-chart', 'eurusd-analysis-1308-euro-attempts-a-recovery-chart', 'eurusd-analysis-today-1408-holds-near-117-chart', 'eurusd-analysis-1808-euro-eyes-gains-chart', 'gbpusd-forecast-today-1408-looking-strong-videochart', 'gold-analysis-1408-trading-attracts-buyers-chart', 'gold-analysis-1808-recovers-from-recent-losses-chart', 'weekly-pairs-in-focus-august-03-august-08-2025-charts', 'the-best-war-stocks-to-buy-now-chart', 'usdbrl-analysis-today-1308-long-term-lows-chart', 'weekly-forex-forecast-august-03th-august-08th-charts', 'webinar-advanced-fx-trading-strategies-march-12-2024', 'webinar-alternative-indicator-strategy-march-6-2024') AND author_id IS NULL;