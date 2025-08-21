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