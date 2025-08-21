UPDATE articles 
SET author_id = CASE 
    WHEN slug = 'weekly-forex-forecast-april-20th-april-26th-charts' THEN '7fe3a1fd-9379-4b94-a584-48467130f9a3'
WHEN slug = 'weekly-forex-forecast-april-27th-may-03th-charts' THEN '6e31aeda-af70-4160-b378-f371cb2d3691'
WHEN slug = 'weekly-pairs-in-focus-may-25-may-30-2025-charts' THEN '3b0f0bb0-6498-4755-a03b-e1f58681725e'
WHEN slug = 'weekly-pairs-in-focus-may-11-may-16-2025-charts' THEN '1972d21a-84a8-4ad9-a9b0-1defc8732c00'
WHEN slug = 'weekly-pairs-in-focus-may-18-may-23-2025-charts' THEN 'ef54d377-56f8-4a11-b098-5ee450fdd139'
WHEN slug = 'weekly-pairs-in-focus-may-04-may-10-2025-charts' THEN 'cd73571d-8f37-404e-bfbc-d3f9523bdf0f'
WHEN slug = 'weekly-forex-forecast-may-04th-may-10th-charts' THEN '7fe3a1fd-9379-4b94-a584-48467130f9a3'
WHEN slug = 'weekly-forex-forecast-may-11th-may-16th-charts' THEN 'ef54d377-56f8-4a11-b098-5ee450fdd139'
WHEN slug = 'weekly-forex-forecast-may-18th-may-23th-charts' THEN '85df8fd0-47ee-4bbb-ac2e-259b43d71e48'
WHEN slug = 'weekly-forex-forecast-may-25th-may-30th-charts' THEN '6e31aeda-af70-4160-b378-f371cb2d3691'
WHEN slug = 'bitcoin-price-today-1006-eyes-50-rally-chart' THEN 'b7cb954e-27a1-4895-9b68-6eb9bdb4e897'
WHEN slug = 'crude-oil-monthly-forecast-july-2025-chart' THEN 'f6309044-c235-4145-b2d5-386156dcc32a'
WHEN slug = 'ethereum-analyst-projects-10k-eth-in-2025-heres-why' THEN '3b0f0bb0-6498-4755-a03b-e1f58681725e'
WHEN slug = 'eurusd-analysis-today-266-will-euro-rise-further-chart' THEN 'f6309044-c235-4145-b2d5-386156dcc32a'
WHEN slug = 'eurusd-analysis-today-2606-selling-recommended-chart' THEN 'bc1ffac5-0a61-407e-b49e-d223eca56ca9'
WHEN slug = 'gold-analysis-today-2306-will-xauusd-rise-chart' THEN '2b43d904-cafd-4bd2-b260-6fefe30b4583'
WHEN slug = 'gold-analysis-today-2406-face-profit-taking-chart' THEN '2b43d904-cafd-4bd2-b260-6fefe30b4583'
WHEN slug = 'gold-analysis-when-can-gold-be-bought-again-chart' THEN '3b0f0bb0-6498-4755-a03b-e1f58681725e'
WHEN slug = 'weekly-pairs-in-focus-june-01-june-06-2025-charts' THEN 'cd73571d-8f37-404e-bfbc-d3f9523bdf0f'
WHEN slug = 'weekly-pairs-in-focus-june-08-june-14-2025-charts' THEN '81dd6558-3345-4b6d-9b06-3f7334304129'
    ELSE author_id 
END
WHERE slug IN ('weekly-forex-forecast-april-20th-april-26th-charts', 'weekly-forex-forecast-april-27th-may-03th-charts', 'weekly-pairs-in-focus-may-25-may-30-2025-charts', 'weekly-pairs-in-focus-may-11-may-16-2025-charts', 'weekly-pairs-in-focus-may-18-may-23-2025-charts', 'weekly-pairs-in-focus-may-04-may-10-2025-charts', 'weekly-forex-forecast-may-04th-may-10th-charts', 'weekly-forex-forecast-may-11th-may-16th-charts', 'weekly-forex-forecast-may-18th-may-23th-charts', 'weekly-forex-forecast-may-25th-may-30th-charts', 'bitcoin-price-today-1006-eyes-50-rally-chart', 'crude-oil-monthly-forecast-july-2025-chart', 'ethereum-analyst-projects-10k-eth-in-2025-heres-why', 'eurusd-analysis-today-266-will-euro-rise-further-chart', 'eurusd-analysis-today-2606-selling-recommended-chart', 'gold-analysis-today-2306-will-xauusd-rise-chart', 'gold-analysis-today-2406-face-profit-taking-chart', 'gold-analysis-when-can-gold-be-bought-again-chart', 'weekly-pairs-in-focus-june-01-june-06-2025-charts', 'weekly-pairs-in-focus-june-08-june-14-2025-charts') AND author_id IS NULL;