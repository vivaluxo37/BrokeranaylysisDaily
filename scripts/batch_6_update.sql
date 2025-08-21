UPDATE articles 
SET author_id = CASE 
    WHEN slug = 'weekly-pairs-in-focus-june-15-june-21-2025-charts' THEN 'cd73571d-8f37-404e-bfbc-d3f9523bdf0f'
WHEN slug = 'weekly-pairs-in-focus-june-22-june-28-2025-charts' THEN '6e31aeda-af70-4160-b378-f371cb2d3691'
WHEN slug = 'weekly-pairs-in-focus-june-29-july-05-2025-charts' THEN 'bd08ef61-e6c7-4243-af60-3ed5c9f45bb5'
WHEN slug = 'usdmxn-monthly-forecast-july-2025-chart' THEN 'bc1ffac5-0a61-407e-b49e-d223eca56ca9'
WHEN slug = 'weekly-forex-forecast-june-01th-june-06th-charts' THEN 'f6309044-c235-4145-b2d5-386156dcc32a'
WHEN slug = 'weekly-forex-forecast-june-08th-june-14th-charts' THEN '8e44030f-679b-4e3b-92ff-d8f8acc9b970'
WHEN slug = 'weekly-forex-forecast-june-16th-june-20th-charts' THEN '85df8fd0-47ee-4bbb-ac2e-259b43d71e48'
WHEN slug = 'weekly-forex-forecast-june-22th-june-28th-charts' THEN '1972d21a-84a8-4ad9-a9b0-1defc8732c00'
WHEN slug = 'weekly-forex-forecast-june-29th-july-05th-charts' THEN '1390995c-17de-4f9e-9d9f-598280375bc3'
WHEN slug = 'bitcoin-pauses-while-solana-rallies-275-in-a-week-chart' THEN 'ab258406-f18d-4b84-a022-9c3b893bacfd'
WHEN slug = 'btcusd-monthly-forecast-august-2025-chart' THEN 'f6309044-c235-4145-b2d5-386156dcc32a'
WHEN slug = 'crude-oil-monthly-forecast-august-2025-chart' THEN '030695b2-4c96-4c83-b837-bd11434fe982'
WHEN slug = 'ethereum-price-rallies-30-during-crypto-week' THEN '81dd6558-3345-4b6d-9b06-3f7334304129'
WHEN slug = 'ethusd-monthly-forecast-august-2025-chart' THEN '1972d21a-84a8-4ad9-a9b0-1defc8732c00'
WHEN slug = 'eurusd-analysis-today-017-strong-until-key-events-chart' THEN '6e31aeda-af70-4160-b378-f371cb2d3691'
WHEN slug = 'eurusd-analysis-1507-us-inflation-figures-lower-chart' THEN '6e31aeda-af70-4160-b378-f371cb2d3691'
WHEN slug = 'eurusd-analysis-today-0207-continues-strong-gains-chart' THEN 'b7cb954e-27a1-4895-9b68-6eb9bdb4e897'
WHEN slug = 'eurusd-analysis-2207-traders-await-powell-chart' THEN '8e44030f-679b-4e3b-92ff-d8f8acc9b970'
WHEN slug = 'eurusd-analysis-investor-optimism-boosts-gains-chart' THEN '3b0f0bb0-6498-4755-a03b-e1f58681725e'
WHEN slug = 'eurusd-analysis-0307-bullish-stability-continues-chart' THEN '2b43d904-cafd-4bd2-b260-6fefe30b4583'
    ELSE author_id 
END
WHERE slug IN ('weekly-pairs-in-focus-june-15-june-21-2025-charts', 'weekly-pairs-in-focus-june-22-june-28-2025-charts', 'weekly-pairs-in-focus-june-29-july-05-2025-charts', 'usdmxn-monthly-forecast-july-2025-chart', 'weekly-forex-forecast-june-01th-june-06th-charts', 'weekly-forex-forecast-june-08th-june-14th-charts', 'weekly-forex-forecast-june-16th-june-20th-charts', 'weekly-forex-forecast-june-22th-june-28th-charts', 'weekly-forex-forecast-june-29th-july-05th-charts', 'bitcoin-pauses-while-solana-rallies-275-in-a-week-chart', 'btcusd-monthly-forecast-august-2025-chart', 'crude-oil-monthly-forecast-august-2025-chart', 'ethereum-price-rallies-30-during-crypto-week', 'ethusd-monthly-forecast-august-2025-chart', 'eurusd-analysis-today-017-strong-until-key-events-chart', 'eurusd-analysis-1507-us-inflation-figures-lower-chart', 'eurusd-analysis-today-0207-continues-strong-gains-chart', 'eurusd-analysis-2207-traders-await-powell-chart', 'eurusd-analysis-investor-optimism-boosts-gains-chart', 'eurusd-analysis-0307-bullish-stability-continues-chart') AND author_id IS NULL;