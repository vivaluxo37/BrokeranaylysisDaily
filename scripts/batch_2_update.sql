UPDATE articles 
SET author_id = CASE 
    WHEN slug = 'momentum-trading-strategies-year' THEN '2b43d904-cafd-4bd2-b260-6fefe30b4583'
WHEN slug = 'do-i-pay-tax-on-forex-trading-in-the-uk-forex-tax-hmrc' THEN '81dd6558-3345-4b6d-9b06-3f7334304129'
WHEN slug = 'forex-easter-holiday-trading-hours-year' THEN 'bc1ffac5-0a61-407e-b49e-d223eca56ca9'
WHEN slug = 'a-long-term-ripple-price-prediction-for-2021-2025-and-2030' THEN 'b7cb954e-27a1-4895-9b68-6eb9bdb4e897'
WHEN slug = 'a-long-term-litecoin-price-prediction-for-2025' THEN 'cd73571d-8f37-404e-bfbc-d3f9523bdf0f'
WHEN slug = 'australia-vs-ic-markets-what-does-it-mean-year-month' THEN '3b0f0bb0-6498-4755-a03b-e1f58681725e'
WHEN slug = 'base-currency-definition-what-investors-should-know' THEN 'c0870ab6-d417-47b7-9fae-53a25197f573'
WHEN slug = 'the-top-crypto-tokens-updated-year' THEN '030695b2-4c96-4c83-b837-bd11434fe982'
WHEN slug = 'bitcoin-drops-to-115k-ahead-of-jerome-powells-jackson-hole' THEN '81dd6558-3345-4b6d-9b06-3f7334304129'
WHEN slug = 'blockchain-in-forex-trading-all-you-need-to-know' THEN '7fe3a1fd-9379-4b94-a584-48467130f9a3'
WHEN slug = 'crypto-vs-stocks-similarities-differences-trading-risks' THEN '3b0f0bb0-6498-4755-a03b-e1f58681725e'
WHEN slug = 'how-to-trade-gold-xauusd-on-mt5-updated-year-month' THEN 'f6309044-c235-4145-b2d5-386156dcc32a'
WHEN slug = 'gold-vs-bitcoin-which-is-better-all-you-need-to-know' THEN 'ef54d377-56f8-4a11-b098-5ee450fdd139'
WHEN slug = 'how-defi-is-disrupting-revolutionizing-the-forex-year' THEN '7fe3a1fd-9379-4b94-a584-48467130f9a3'
WHEN slug = 'how-to-develop-a-day-trading-strategy-for-crypto-year' THEN 'ab258406-f18d-4b84-a022-9c3b893bacfd'
WHEN slug = 'is-forex-trading-legal-in-pakistan-expert-analysis-for-2024' THEN '1972d21a-84a8-4ad9-a9b0-1defc8732c00'
WHEN slug = 'is-retail-forex-dead-all-you-need-to-know-updated-year' THEN '6e31aeda-af70-4160-b378-f371cb2d3691'
WHEN slug = 'nzdusd-eyes-resistance-before-rbnz-rate-cut' THEN 'ab258406-f18d-4b84-a022-9c3b893bacfd'
WHEN slug = 'tax-on-forex-trading-in-south-africa-year' THEN 'bd08ef61-e6c7-4243-af60-3ed5c9f45bb5'
WHEN slug = 'forex-trading-taxes-in-the-us-updated-year' THEN 'bd08ef61-e6c7-4243-af60-3ed5c9f45bb5'
    ELSE author_id 
END
WHERE slug IN ('momentum-trading-strategies-year', 'do-i-pay-tax-on-forex-trading-in-the-uk-forex-tax-hmrc', 'forex-easter-holiday-trading-hours-year', 'a-long-term-ripple-price-prediction-for-2021-2025-and-2030', 'a-long-term-litecoin-price-prediction-for-2025', 'australia-vs-ic-markets-what-does-it-mean-year-month', 'base-currency-definition-what-investors-should-know', 'the-top-crypto-tokens-updated-year', 'bitcoin-drops-to-115k-ahead-of-jerome-powells-jackson-hole', 'blockchain-in-forex-trading-all-you-need-to-know', 'crypto-vs-stocks-similarities-differences-trading-risks', 'how-to-trade-gold-xauusd-on-mt5-updated-year-month', 'gold-vs-bitcoin-which-is-better-all-you-need-to-know', 'how-defi-is-disrupting-revolutionizing-the-forex-year', 'how-to-develop-a-day-trading-strategy-for-crypto-year', 'is-forex-trading-legal-in-pakistan-expert-analysis-for-2024', 'is-retail-forex-dead-all-you-need-to-know-updated-year', 'nzdusd-eyes-resistance-before-rbnz-rate-cut', 'tax-on-forex-trading-in-south-africa-year', 'forex-trading-taxes-in-the-us-updated-year') AND author_id IS NULL;