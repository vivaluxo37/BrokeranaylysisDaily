UPDATE articles 
SET author_id = CASE 
    WHEN slug = 'forex-payment-gateways-guide-updated-year' THEN '3b0f0bb0-6498-4755-a03b-e1f58681725e'
WHEN slug = 'us-tariffs-trumps-tariffs-and-the-markets-year-month' THEN '1390995c-17de-4f9e-9d9f-598280375bc3'
WHEN slug = 'how-to-count-pips-on-us30-experts-us30-pip-calculator-guide' THEN 'b7cb954e-27a1-4895-9b68-6eb9bdb4e897'
WHEN slug = 'why-every-country-is-racing-to-launch-a-central-bank-digital' THEN '2b43d904-cafd-4bd2-b260-6fefe30b4583'
WHEN slug = 'ifx-expo-a-tour-around-the-world' THEN 'ab258406-f18d-4b84-a022-9c3b893bacfd'
WHEN slug = 't4trade-trading-platform-for-purpose-driven-traders' THEN '6e31aeda-af70-4160-b378-f371cb2d3691'
WHEN slug = 'last-chance-to-nominate-your-candidate-for-the-industrys' THEN '1972d21a-84a8-4ad9-a9b0-1defc8732c00'
WHEN slug = 'pu-prime-clinches-two-prestigious-awards-at-forex-sports' THEN '2b43d904-cafd-4bd2-b260-6fefe30b4583'
WHEN slug = 'unlock-limitless-possibilities-at-ifx-expo-international' THEN '4a384f4a-5ec5-4535-9fbb-c4adec76007b'
WHEN slug = 'wiki-finance-expo-cyprus-2025' THEN 'bd08ef61-e6c7-4243-af60-3ed5c9f45bb5'
WHEN slug = 'cfi-financial-appoints-ziad-melhem-as-group-ceo' THEN 'cd73571d-8f37-404e-bfbc-d3f9523bdf0f'
WHEN slug = 'how-market-volatility-affects-execution' THEN 'ef54d377-56f8-4a11-b098-5ee450fdd139'
WHEN slug = 'trade-w-officially-launches-new-logo' THEN '1972d21a-84a8-4ad9-a9b0-1defc8732c00'
WHEN slug = 'cfi-becomes-official-online-trading-partner-of-etihad-arena' THEN '1390995c-17de-4f9e-9d9f-598280375bc3'
WHEN slug = 'cfi-welcomes-maria-sharapova-as-global-brand-ambassador' THEN 'bc1ffac5-0a61-407e-b49e-d223eca56ca9'
WHEN slug = 'ifx-expo-asia-2025-returns-to-hong-kong' THEN '4a384f4a-5ec5-4535-9fbb-c4adec76007b'
WHEN slug = 'ifx-expo-international-2025-sets-new-global-benchmark' THEN '1972d21a-84a8-4ad9-a9b0-1defc8732c00'
WHEN slug = 'libertex-powers-up-monaco-gp-weekend' THEN 'bc1ffac5-0a61-407e-b49e-d223eca56ca9'
WHEN slug = 'pu-prime-and-argentina-football-association-celebrate' THEN 'ab258406-f18d-4b84-a022-9c3b893bacfd'
WHEN slug = 'pu-prime-named-best-copy-trading-platform-of-2025-by-wikifx' THEN '6e31aeda-af70-4160-b378-f371cb2d3691'
    ELSE author_id 
END
WHERE slug IN ('forex-payment-gateways-guide-updated-year', 'us-tariffs-trumps-tariffs-and-the-markets-year-month', 'how-to-count-pips-on-us30-experts-us30-pip-calculator-guide', 'why-every-country-is-racing-to-launch-a-central-bank-digital', 'ifx-expo-a-tour-around-the-world', 't4trade-trading-platform-for-purpose-driven-traders', 'last-chance-to-nominate-your-candidate-for-the-industrys', 'pu-prime-clinches-two-prestigious-awards-at-forex-sports', 'unlock-limitless-possibilities-at-ifx-expo-international', 'wiki-finance-expo-cyprus-2025', 'cfi-financial-appoints-ziad-melhem-as-group-ceo', 'how-market-volatility-affects-execution', 'trade-w-officially-launches-new-logo', 'cfi-becomes-official-online-trading-partner-of-etihad-arena', 'cfi-welcomes-maria-sharapova-as-global-brand-ambassador', 'ifx-expo-asia-2025-returns-to-hong-kong', 'ifx-expo-international-2025-sets-new-global-benchmark', 'libertex-powers-up-monaco-gp-weekend', 'pu-prime-and-argentina-football-association-celebrate', 'pu-prime-named-best-copy-trading-platform-of-2025-by-wikifx') AND author_id IS NULL;