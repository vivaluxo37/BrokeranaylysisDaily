UPDATE articles 
SET author_id = CASE 
    WHEN slug = 'eurusd-analysis-3007-increase-selling-pressure-chart' THEN 'c0870ab6-d417-47b7-9fae-53a25197f573'
WHEN slug = 'eurusd-analysis-today-0807-euro-trading-hinges-chart' THEN 'ab258406-f18d-4b84-a022-9c3b893bacfd'
WHEN slug = 'eurusd-monthly-forecast-august-2025-chart' THEN '2b43d904-cafd-4bd2-b260-6fefe30b4583'
WHEN slug = 'eurusd-monthly-forecast-july-2025-chart' THEN '3b0f0bb0-6498-4755-a03b-e1f58681725e'
WHEN slug = 'gold-analysis-today-0107-prices-attempt-to-recover-chart' THEN '7fe3a1fd-9379-4b94-a584-48467130f9a3'
WHEN slug = 'gold-analysis-today-2107-gold-prices-may-rise-chart' THEN 'ab258406-f18d-4b84-a022-9c3b893bacfd'
WHEN slug = 'gold-analysis-2407-profit-taking-sales-chart' THEN '4a384f4a-5ec5-4535-9fbb-c4adec76007b'
WHEN slug = 'gold-analysis-2807-is-now-a-good-time-to-buy-gold-chart' THEN '81dd6558-3345-4b6d-9b06-3f7334304129'
WHEN slug = 'gold-monthly-forecast-august-2025-chart' THEN '030695b2-4c96-4c83-b837-bd11434fe982'
WHEN slug = 'nasdaq-monthly-forecast-august-2025-chart' THEN 'b7cb954e-27a1-4895-9b68-6eb9bdb4e897'
WHEN slug = 'weekly-pairs-in-focus-july-06-july-12-2025-charts' THEN 'c0870ab6-d417-47b7-9fae-53a25197f573'
WHEN slug = 'weekly-pairs-in-focus-july-13-july-19-2025-charts' THEN '3b0f0bb0-6498-4755-a03b-e1f58681725e'
WHEN slug = 'weekly-pairs-in-focus-july-20-july-26-2025-charts' THEN '8e44030f-679b-4e3b-92ff-d8f8acc9b970'
WHEN slug = 'weekly-pairs-in-focus-july-27-august-01-2025-charts' THEN '030695b2-4c96-4c83-b837-bd11434fe982'
WHEN slug = 'solana-price-2807-etf-approval-seen-certain-graph' THEN '8e44030f-679b-4e3b-92ff-d8f8acc9b970'
WHEN slug = 'sp-500-monthly-forecast-august-2025-chart' THEN 'ab258406-f18d-4b84-a022-9c3b893bacfd'
WHEN slug = 'usdinr-monthly-forecast-august-2025-chart' THEN '4a384f4a-5ec5-4535-9fbb-c4adec76007b'
WHEN slug = 'usdinr-monthly-forecast-july-2025-chart' THEN '8e44030f-679b-4e3b-92ff-d8f8acc9b970'
WHEN slug = 'usdmxn-monthly-forecast-august-2025-chart' THEN 'ef54d377-56f8-4a11-b098-5ee450fdd139'
WHEN slug = 'usdzar-monthly-forecast-august-2025-chart' THEN 'f6309044-c235-4145-b2d5-386156dcc32a'
    ELSE author_id 
END
WHERE slug IN ('eurusd-analysis-3007-increase-selling-pressure-chart', 'eurusd-analysis-today-0807-euro-trading-hinges-chart', 'eurusd-monthly-forecast-august-2025-chart', 'eurusd-monthly-forecast-july-2025-chart', 'gold-analysis-today-0107-prices-attempt-to-recover-chart', 'gold-analysis-today-2107-gold-prices-may-rise-chart', 'gold-analysis-2407-profit-taking-sales-chart', 'gold-analysis-2807-is-now-a-good-time-to-buy-gold-chart', 'gold-monthly-forecast-august-2025-chart', 'nasdaq-monthly-forecast-august-2025-chart', 'weekly-pairs-in-focus-july-06-july-12-2025-charts', 'weekly-pairs-in-focus-july-13-july-19-2025-charts', 'weekly-pairs-in-focus-july-20-july-26-2025-charts', 'weekly-pairs-in-focus-july-27-august-01-2025-charts', 'solana-price-2807-etf-approval-seen-certain-graph', 'sp-500-monthly-forecast-august-2025-chart', 'usdinr-monthly-forecast-august-2025-chart', 'usdinr-monthly-forecast-july-2025-chart', 'usdmxn-monthly-forecast-august-2025-chart', 'usdzar-monthly-forecast-august-2025-chart') AND author_id IS NULL;