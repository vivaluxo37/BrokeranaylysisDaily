UPDATE articles 
SET author_id = CASE 
    WHEN slug = 'bitcoin-stalls-below-95k-monero-surges-43-chart' THEN 'ab258406-f18d-4b84-a022-9c3b893bacfd'
WHEN slug = 'bitcoin-price-2805-stablecoins-steal-the-spotlight-chart' THEN 'c0870ab6-d417-47b7-9fae-53a25197f573'
WHEN slug = 'forex-today-0505-trump-pushes-powell-to-cut-rates' THEN '3b0f0bb0-6498-4755-a03b-e1f58681725e'
WHEN slug = 'forex-today-markets-expect-us-inflation-unchanged-today' THEN '2b43d904-cafd-4bd2-b260-6fefe30b4583'
WHEN slug = 'forex-today-bitcoin-looks-to-be-heading-to-new-all-time' THEN 'bc1ffac5-0a61-407e-b49e-d223eca56ca9'
WHEN slug = 'forex-today-1106-expect-us-inflation-to-rise-to-25' THEN 'f6309044-c235-4145-b2d5-386156dcc32a'
WHEN slug = 'forex-today-1906-cautious-fed-iran-refusal-weigh-on-risk' THEN 'ab258406-f18d-4b84-a022-9c3b893bacfd'
WHEN slug = 'forex-today-2606-nasdaq-100-hits-new-all-time-high' THEN '2b43d904-cafd-4bd2-b260-6fefe30b4583'
WHEN slug = 'forex-today-3006-us-equities-keep-rising' THEN '1972d21a-84a8-4ad9-a9b0-1defc8732c00'
WHEN slug = 'united-states-federal-reserve-maintains-rates' THEN 'cd73571d-8f37-404e-bfbc-d3f9523bdf0f'
WHEN slug = 'united-states-gdp-declined-05-in-q1-2025' THEN '81dd6558-3345-4b6d-9b06-3f7334304129'
WHEN slug = 'forex-today-0107-us-equities-beat-records-while-usd-drops' THEN '1390995c-17de-4f9e-9d9f-598280375bc3'
WHEN slug = 'forex-today-1072025-bitcoin-makes-new-record-high-price' THEN 'c0870ab6-d417-47b7-9fae-53a25197f573'
WHEN slug = 'forex-today-14-july-2025-bitcoin-breaks-120000-chart' THEN '1972d21a-84a8-4ad9-a9b0-1defc8732c00'
WHEN slug = 'forex-today-15-july-2025-us-inflation-expected-to-increase' THEN 'ef54d377-56f8-4a11-b098-5ee450fdd139'
WHEN slug = 'forex-today-16-july-2025-markets-await-us-ppi-data' THEN 'bc1ffac5-0a61-407e-b49e-d223eca56ca9'
WHEN slug = 'forex-today-2407-sp-500-index-powers-to-new-all-time-high' THEN '8e44030f-679b-4e3b-92ff-d8f8acc9b970'
WHEN slug = 'rbnz-leaves-rates-unchanged-0907' THEN 'c0870ab6-d417-47b7-9fae-53a25197f573'
WHEN slug = 'us-and-canadian-inflation-accelerates-1507' THEN '2b43d904-cafd-4bd2-b260-6fefe30b4583'
WHEN slug = 'us-inflation-unchanged-but-core-cpi-accelerates' THEN 'bc1ffac5-0a61-407e-b49e-d223eca56ca9'
    ELSE author_id 
END
WHERE slug IN ('bitcoin-stalls-below-95k-monero-surges-43-chart', 'bitcoin-price-2805-stablecoins-steal-the-spotlight-chart', 'forex-today-0505-trump-pushes-powell-to-cut-rates', 'forex-today-markets-expect-us-inflation-unchanged-today', 'forex-today-bitcoin-looks-to-be-heading-to-new-all-time', 'forex-today-1106-expect-us-inflation-to-rise-to-25', 'forex-today-1906-cautious-fed-iran-refusal-weigh-on-risk', 'forex-today-2606-nasdaq-100-hits-new-all-time-high', 'forex-today-3006-us-equities-keep-rising', 'united-states-federal-reserve-maintains-rates', 'united-states-gdp-declined-05-in-q1-2025', 'forex-today-0107-us-equities-beat-records-while-usd-drops', 'forex-today-1072025-bitcoin-makes-new-record-high-price', 'forex-today-14-july-2025-bitcoin-breaks-120000-chart', 'forex-today-15-july-2025-us-inflation-expected-to-increase', 'forex-today-16-july-2025-markets-await-us-ppi-data', 'forex-today-2407-sp-500-index-powers-to-new-all-time-high', 'rbnz-leaves-rates-unchanged-0907', 'us-and-canadian-inflation-accelerates-1507', 'us-inflation-unchanged-but-core-cpi-accelerates') AND author_id IS NULL;