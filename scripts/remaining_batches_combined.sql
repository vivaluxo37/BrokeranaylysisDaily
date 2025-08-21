
-- batch_4_update.sql
UPDATE articles 
SET author_id = CASE 
    WHEN slug = 'understanding-trading-costs-how-primexbt-stands-out' THEN '3b0f0bb0-6498-4755-a03b-e1f58681725e'
WHEN slug = 'xm-arabia-successfully-concludes-regional-sponsorship' THEN 'b7cb954e-27a1-4895-9b68-6eb9bdb4e897'
WHEN slug = 'xm-gives-unlimited-trading-cashback-for-15-year-anniversary' THEN 'bd08ef61-e6c7-4243-af60-3ed5c9f45bb5'
WHEN slug = 'alpari-launches-redesigned-trading-platform' THEN '030695b2-4c96-4c83-b837-bd11434fe982'
WHEN slug = 'cfi-financial-appoints-omar-khaled-as-global-cmo' THEN 'bd08ef61-e6c7-4243-af60-3ed5c9f45bb5'
WHEN slug = 'doo-prime-reveals-new-identity-to-lead-the-future-of-fintech' THEN 'bd08ef61-e6c7-4243-af60-3ed5c9f45bb5'
WHEN slug = 'fpfx-tech-celebrates-five-years-of-fintech-innovation' THEN 'ef54d377-56f8-4a11-b098-5ee450fdd139'
WHEN slug = 'ironfx-celebrates-15-years-of-global-trading-excellence' THEN '3b0f0bb0-6498-4755-a03b-e1f58681725e'
WHEN slug = 'pu-prime-copy-earn-where-copying-means-cash' THEN '1972d21a-84a8-4ad9-a9b0-1defc8732c00'
WHEN slug = 'wikifx-releases-2025-malaysia-skyline-guide' THEN '030695b2-4c96-4c83-b837-bd11434fe982'
WHEN slug = 'usdtry-forecast-today-2511-lira-stable-chart' THEN '030695b2-4c96-4c83-b837-bd11434fe982'
WHEN slug = 'usdtry-forecast-today-0411-inflation-falls-chart' THEN 'b7cb954e-27a1-4895-9b68-6eb9bdb4e897'
WHEN slug = 'usdtry-forecast-0601-lira-stabilizes-on-support-chart' THEN '6e31aeda-af70-4160-b378-f371cb2d3691'
WHEN slug = 'usdtry-forecast-today-0201-all-time-low-chart' THEN '3b0f0bb0-6498-4755-a03b-e1f58681725e'
WHEN slug = 'usdtry-forecast-today-2301-euro-rallies-in-thin-liquid' THEN '2b43d904-cafd-4bd2-b260-6fefe30b4583'
WHEN slug = 'usdtry-forecast-today-0901-lira-soars-in-2024-chart' THEN 'bc1ffac5-0a61-407e-b49e-d223eca56ca9'
WHEN slug = 'usdtry-forecast-today-2402-weak-as-hits-new-highs-chart' THEN '7fe3a1fd-9379-4b94-a584-48467130f9a3'
WHEN slug = 'weekly-pairs-in-focus-april-20-april-26-2025-charts' THEN '1390995c-17de-4f9e-9d9f-598280375bc3'
WHEN slug = 'weekly-pairs-in-focus-april-27-may-03-2025-charts' THEN 'bc1ffac5-0a61-407e-b49e-d223eca56ca9'
WHEN slug = 'usdtry-today-1004-support-the-lira-with-over-42-b-chart' THEN '1390995c-17de-4f9e-9d9f-598280375bc3'
    ELSE author_id 
END
WHERE slug IN ('understanding-trading-costs-how-primexbt-stands-out', 'xm-arabia-successfully-concludes-regional-sponsorship', 'xm-gives-unlimited-trading-cashback-for-15-year-anniversary', 'alpari-launches-redesigned-trading-platform', 'cfi-financial-appoints-omar-khaled-as-global-cmo', 'doo-prime-reveals-new-identity-to-lead-the-future-of-fintech', 'fpfx-tech-celebrates-five-years-of-fintech-innovation', 'ironfx-celebrates-15-years-of-global-trading-excellence', 'pu-prime-copy-earn-where-copying-means-cash', 'wikifx-releases-2025-malaysia-skyline-guide', 'usdtry-forecast-today-2511-lira-stable-chart', 'usdtry-forecast-today-0411-inflation-falls-chart', 'usdtry-forecast-0601-lira-stabilizes-on-support-chart', 'usdtry-forecast-today-0201-all-time-low-chart', 'usdtry-forecast-today-2301-euro-rallies-in-thin-liquid', 'usdtry-forecast-today-0901-lira-soars-in-2024-chart', 'usdtry-forecast-today-2402-weak-as-hits-new-highs-chart', 'weekly-pairs-in-focus-april-20-april-26-2025-charts', 'weekly-pairs-in-focus-april-27-may-03-2025-charts', 'usdtry-today-1004-support-the-lira-with-over-42-b-chart') AND author_id IS NULL;


-- batch_5_update.sql
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


-- batch_6_update.sql
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


-- batch_7_update.sql
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


-- batch_8_update.sql
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


-- batch_9_update.sql
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

