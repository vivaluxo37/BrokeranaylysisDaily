-- News Articles Migration SQL

-- Article 1

            INSERT INTO news_articles (
                title, content, summary, slug, category, published_date, status,
                meta_description, canonical_url, og_title, og_description, og_image,
                source_file, tags
            ) VALUES (
                'Forex Today - 05/08: Risk Assets Hit; Yen & Franc Surge',
                'This article was migrated from BrokerAnalysis. Original title: Forex Today - 05/08: Risk Assets Hit; Yen & Franc Surge

Summary: Forex Market Today: Global markets tumble as stocks, crypto, and AUD plunge. Yen, Swiss Franc soar on safe-haven demand amid US-Iran tensions and economic woes.

Content extraction from the original obfuscated HTML file is pending manual review.',
                'Forex Market Today: Global markets tumble as stocks, crypto, and AUD plunge. Yen, Swiss Franc soar on safe-haven demand amid US-Iran tensions and economic woes.',
                'forex-today-0508-risk-assets-hit-yen-franc-surge',
                'forex',
                '2025-08-21T12:23:42.918291',
                'draft',
                'Forex Market Today: Global markets tumble as stocks, crypto, and AUD plunge. Yen, Swiss Franc soar on safe-haven demand amid US-Iran tensions and economic woes.',
                '215822.html',
                'Forex Today - 05/08: Risk Assets Hit; Yen & Franc Surge',
                'Forex Market Today: Global markets tumble as stocks, crypto, and AUD plunge. Yen, Swiss Franc soar on safe-haven demand amid US-Iran tensions and economic woes.',
                'https://dailyforex.com/files/stockphotos1/general_trading/640x360_handonmouse.jpeg',
                'C:\Users\LENOVO\Desktop\BrokeranalysisDaily\daily forex\www.dailyforex.com\forex-news\2024\08\forex-today-5-august-2024\215822.html',
                ARRAY['forex']
            ) RETURNING id, title;
            

-- Article 2

            INSERT INTO news_articles (
                title, content, summary, slug, category, published_date, status,
                meta_description, canonical_url, og_title, og_description, og_image,
                source_file, tags
            ) VALUES (
                'Bitcoin Stalls Below $95K, Monero Surges 43% (Chart)',
                'This article was migrated from BrokerAnalysis. Original title: Bitcoin Stalls Below $95K, Monero Surges 43% (Chart)

Summary: Bitcoin stalls below $95K as hot capital surges; Monero spikes 43% amid laundering of $330M in stolen BTC, signaling fragile yet volatile market setup.

Content extraction from the original obfuscated HTML file is pending manual review.',
                'Bitcoin stalls below $95K as hot capital surges; Monero spikes 43% amid laundering of $330M in stolen BTC, signaling fragile yet volatile market setup.',
                'bitcoin-stalls-below-95k-monero-surges-43-chart',
                'forex',
                '2025-08-21T12:23:43.351900',
                'draft',
                'Bitcoin stalls below $95K as hot capital surges; Monero spikes 43% amid laundering of $330M in stolen BTC, signaling fragile yet volatile market setup.',
                '227687.html',
                'Bitcoin Stalls Below $95K, Monero Surges 43% (Chart)',
                'Bitcoin stalls below $95K as hot capital surges; Monero spikes 43% amid laundering of $330M in stolen BTC, signaling fragile yet volatile market setup.',
                'https://dailyforex.com/files/stockphotos1/currencies/cryptocurrency/640x360_btcusd_7.jpeg',
                'C:\Users\LENOVO\Desktop\BrokeranalysisDaily\daily forex\www.dailyforex.com\forex-news\2025\04\bitcoin-stalls-below-95k\227687.html',
                ARRAY['bitcoin']
            ) RETURNING id, title;
            

-- Article 3

            INSERT INTO news_articles (
                title, content, summary, slug, category, published_date, status,
                meta_description, canonical_url, og_title, og_description, og_image,
                source_file, tags
            ) VALUES (
                'Bitcoin Price 28/05: Stablecoins Steal the Spotlight (Chart)',
                'This article was migrated from BrokerAnalysis. Original title: Bitcoin Price 28/05: Stablecoins Steal the Spotlight (Chart)

Summary: Bitcoin hits $112K amid bond market turmoil and safe-haven demand, while Circle’s IPO and launch of its Payments Network mark a major leap for stablecoins.

Content extraction from the original obfuscated HTML file is pending manual review.',
                'Bitcoin hits $112K amid bond market turmoil and safe-haven demand, while Circle’s IPO and launch of its Payments Network mark a major leap for stablecoins.',
                'bitcoin-price-2805-stablecoins-steal-the-spotlight-chart',
                'forex',
                '2025-08-21T12:23:43.501189',
                'draft',
                'Bitcoin hits $112K amid bond market turmoil and safe-haven demand, while Circle’s IPO and launch of its Payments Network mark a major leap for stablecoins.',
                '228891.html',
                'Bitcoin Price 28/05: Stablecoins Steal the Spotlight (Chart)',
                'Bitcoin hits $112K amid bond market turmoil and safe-haven demand, while Circle’s IPO and launch of its Payments Network mark a major leap for stablecoins.',
                'https://dailyforex.com/files/stockphotos1/currencies/btcusd/5.jpeg',
                'C:\Users\LENOVO\Desktop\BrokeranalysisDaily\daily forex\www.dailyforex.com\forex-news\2025\05\btcusd-price-28-may-2025\228891.html',
                ARRAY['bitcoin']
            ) RETURNING id, title;
            

-- Article 4

            INSERT INTO news_articles (
                title, content, summary, slug, category, published_date, status,
                meta_description, canonical_url, og_title, og_description, og_image,
                source_file, tags
            ) VALUES (
                'United States Federal Reserve Maintains Rates',
                'This article was migrated from BrokerAnalysis. Original title: United States Federal Reserve Maintains Rates

Summary: The Federal Reserve keeps interest rates at 4.25%-4.5% and warns that US tariffs may trigger stagflation. Powell pushes back on Trump’s rate-cut pressure.

Content extraction from the original obfuscated HTML file is pending manual review.',
                'The Federal Reserve keeps interest rates at 4.25%-4.5% and warns that US tariffs may trigger stagflation. Powell pushes back on Trump’s rate-cut pressure.',
                'united-states-federal-reserve-maintains-rates',
                'forex',
                '2025-08-21T12:23:43.703921',
                'draft',
                'The Federal Reserve keeps interest rates at 4.25%-4.5% and warns that US tariffs may trigger stagflation. Powell pushes back on Trump’s rate-cut pressure.',
                '228032.html',
                'United States Federal Reserve Maintains Rates',
                'The Federal Reserve keeps interest rates at 4.25%-4.5% and warns that US tariffs may trigger stagflation. Powell pushes back on Trump’s rate-cut pressure.',
                'https://dailyforex.com/files/stockphotos1/general_trading/640x360-tariffs2.jpeg',
                'C:\Users\LENOVO\Desktop\BrokeranalysisDaily\daily forex\www.dailyforex.com\forex-news\2025\05\fed-holds-rates-warns-tariffs-raise-stagflation-risks\228032.html',
                ARRAY['federal-reserve','interest-rates']
            ) RETURNING id, title;
            

-- Article 5

            INSERT INTO news_articles (
                title, content, summary, slug, category, published_date, status,
                meta_description, canonical_url, og_title, og_description, og_image,
                source_file, tags
            ) VALUES (
                'Forex Today 05/05: Trump Pushes Powell to Cut Rates',
                'This article was migrated from BrokerAnalysis. Original title: Forex Today 05/05: Trump Pushes Powell to Cut Rates

Summary: President Trump has been publicly stating that the Fed should be cutting rates faster after Friday''s strong jobs data.

Content extraction from the original obfuscated HTML file is pending manual review.',
                'President Trump has been publicly stating that the Fed should be cutting rates faster after Friday''s strong jobs data.',
                'forex-today-0505-trump-pushes-powell-to-cut-rates',
                'forex',
                '2025-08-21T12:23:43.850073',
                'draft',
                'President Trump has been publicly stating that the Fed should be cutting rates faster after Friday''s strong jobs data.',
                '227830.html',
                'Forex Today 05/05: Trump Pushes Powell to Cut Rates',
                'President Trump has been publicly stating that the Fed should be cutting rates faster after Friday''s strong jobs data.',
                'https://dailyforex.com/files/stockphotos1/forex today trump pushes powell to cut rates.webp',
                'C:\Users\LENOVO\Desktop\BrokeranalysisDaily\daily forex\www.dailyforex.com\forex-news\2025\05\forex-today-05-may-2025\227830.html',
                ARRAY['forex','federal-reserve','interest-rates']
            ) RETURNING id, title;
            

-- Article 6

            INSERT INTO news_articles (
                title, content, summary, slug, category, published_date, status,
                meta_description, canonical_url, og_title, og_description, og_image,
                source_file, tags
            ) VALUES (
                'Forex Today 12/05: Trump Lauds China Trade Talks',
                'This article was migrated from BrokerAnalysis. Original title: Forex Today 12/05: Trump Lauds China Trade Talks

Summary: Trump''s praise of China trade talks boosts US stocks and risk sentiment; USD/JPY and Bitcoin surge, while gold drops and AUD/JPY gains on risk-on momentum.

Content extraction from the original obfuscated HTML file is pending manual review.',
                'Trump''s praise of China trade talks boosts US stocks and risk sentiment; USD/JPY and Bitcoin surge, while gold drops and AUD/JPY gains on risk-on momentum.',
                'forex-today-1205-trump-lauds-china-trade-talks',
                'forex',
                '2025-08-21T12:23:43.986071',
                'draft',
                'Trump''s praise of China trade talks boosts US stocks and risk sentiment; USD/JPY and Bitcoin surge, while gold drops and AUD/JPY gains on risk-on momentum.',
                '228139.html',
                'Forex Today 12/05: Trump Lauds China Trade Talks',
                'Trump''s praise of China trade talks boosts US stocks and risk sentiment; USD/JPY and Bitcoin surge, while gold drops and AUD/JPY gains on risk-on momentum.',
                'https://dailyforex.com/files/stockphotos1/news/640x360_news_12.jpeg',
                'C:\Users\LENOVO\Desktop\BrokeranalysisDaily\daily forex\www.dailyforex.com\forex-news\2025\05\forex-today-12-may-2025\228139.html',
                ARRAY['bitcoin','forex']
            ) RETURNING id, title;
            

-- Article 7

            INSERT INTO news_articles (
                title, content, summary, slug, category, published_date, status,
                meta_description, canonical_url, og_title, og_description, og_image,
                source_file, tags
            ) VALUES (
                'Forex Today: Markets Expect US Inflation Unchanged Today',
                'This article was migrated from BrokerAnalysis. Original title: Forex Today: Markets Expect US Inflation Unchanged Today

Summary: Markets are closely watching today''s US CPI release while a new US-China trade deal boosts global stock markets and dampens rate cut expectations.

Content extraction from the original obfuscated HTML file is pending manual review.',
                'Markets are closely watching today''s US CPI release while a new US-China trade deal boosts global stock markets and dampens rate cut expectations.',
                'forex-today-markets-expect-us-inflation-unchanged-today',
                'forex',
                '2025-08-21T12:23:44.154409',
                'draft',
                'Markets are closely watching today''s US CPI release while a new US-China trade deal boosts global stock markets and dampens rate cut expectations.',
                '228184.html',
                'Forex Today: Markets Expect US Inflation Unchanged Today',
                'Markets are closely watching today''s US CPI release while a new US-China trade deal boosts global stock markets and dampens rate cut expectations.',
                'https://dailyforex.com/files/stockphotos1/interest_rates/640x360-inflation.jpeg',
                'C:\Users\LENOVO\Desktop\BrokeranalysisDaily\daily forex\www.dailyforex.com\forex-news\2025\05\forex-today-13-may-2025\228184.html',
                ARRAY['forex','inflation']
            ) RETURNING id, title;
            

-- Article 8

            INSERT INTO news_articles (
                title, content, summary, slug, category, published_date, status,
                meta_description, canonical_url, og_title, og_description, og_image,
                source_file, tags
            ) VALUES (
                'Forex Today: US Inflation Lower at 2.3%, Boosting Stocks',
                'This article was migrated from BrokerAnalysis. Original title: Forex Today: US Inflation Lower at 2.3%, Boosting Stocks

Summary: US CPI dips to 2.3%, boosting stocks and risk appetite; Trump secures $142B Saudi deal; Aussie up on hot wage data; quiet Forex moves in Asia.

Content extraction from the original obfuscated HTML file is pending manual review.',
                'US CPI dips to 2.3%, boosting stocks and risk appetite; Trump secures $142B Saudi deal; Aussie up on hot wage data; quiet Forex moves in Asia.',
                'forex-today-us-inflation-lower-at-23-boosting-stocks',
                'forex',
                '2025-08-21T12:23:44.330749',
                'draft',
                'US CPI dips to 2.3%, boosting stocks and risk appetite; Trump secures $142B Saudi deal; Aussie up on hot wage data; quiet Forex moves in Asia.',
                '228251.html',
                'Forex Today: US Inflation Lower at 2.3%, Boosting Stocks',
                'US CPI dips to 2.3%, boosting stocks and risk appetite; Trump secures $142B Saudi deal; Aussie up on hot wage data; quiet Forex moves in Asia.',
                'https://dailyforex.com/files/stockphotos1/interest_rates/640x360-coins-1098167723.jpeg',
                'C:\Users\LENOVO\Desktop\BrokeranalysisDaily\daily forex\www.dailyforex.com\forex-news\2025\05\forex-today-14-may-2025\228251.html',
                ARRAY['forex','inflation']
            ) RETURNING id, title;
            

-- Article 9

            INSERT INTO news_articles (
                title, content, summary, slug, category, published_date, status,
                meta_description, canonical_url, og_title, og_description, og_image,
                source_file, tags
            ) VALUES (
                'Forex Today 15/05: Markets Drifting Ahead of Key US Data',
                'This article was migrated from BrokerAnalysis. Original title: Forex Today 15/05: Markets Drifting Ahead of Key US Data

Summary: With US-China trade de-escalation and cooling inflation, the USD is rebounding, and traders on PrimeXBT are watching to see if it can sustain gains

Content extraction from the original obfuscated HTML file is pending manual review.',
                'With US-China trade de-escalation and cooling inflation, the USD is rebounding, and traders on PrimeXBT are watching to see if it can sustain gains',
                'forex-today-1505-markets-drifting-ahead-of-key-us-data',
                'forex',
                '2025-08-21T12:23:44.660343',
                'draft',
                'With US-China trade de-escalation and cooling inflation, the USD is rebounding, and traders on PrimeXBT are watching to see if it can sustain gains',
                '228341.html',
                'Forex Today 15/05: Markets Drifting Ahead of Key US Data',
                'With US-China trade de-escalation and cooling inflation, the USD is rebounding, and traders on PrimeXBT are watching to see if it can sustain gains',
                'https://dailyforex.com/files/stockphotos1/news/640x360_news_usd.jpeg',
                'C:\Users\LENOVO\Desktop\BrokeranalysisDaily\daily forex\www.dailyforex.com\forex-news\2025\05\forex-today-15-may-2025\228341.html',
                ARRAY['forex','inflation']
            ) RETURNING id, title;
            

-- Article 10

            INSERT INTO news_articles (
                title, content, summary, slug, category, published_date, status,
                meta_description, canonical_url, og_title, og_description, og_image,
                source_file, tags
            ) VALUES (
                'Forex Today 19/05: US Stocks Lower on Credit Downgrade',
                'This article was migrated from BrokerAnalysis. Original title: Forex Today 19/05: US Stocks Lower on Credit Downgrade

Summary: Markets remain calm ahead of key US economic data, with the Euro gaining and the Canadian Dollar weakening. Bitcoin forms a bearish outside bar near recent high

Content extraction from the original obfuscated HTML file is pending manual review.',
                'Markets remain calm ahead of key US economic data, with the Euro gaining and the Canadian Dollar weakening. Bitcoin forms a bearish outside bar near recent high',
                'forex-today-1905-us-stocks-lower-on-credit-downgrade',
                'forex',
                '2025-08-21T12:23:44.812687',
                'draft',
                'Markets remain calm ahead of key US economic data, with the Euro gaining and the Canadian Dollar weakening. Bitcoin forms a bearish outside bar near recent high',
                '228471.html',
                'Forex Today 19/05: US Stocks Lower on Credit Downgrade',
                'Markets remain calm ahead of key US economic data, with the Euro gaining and the Canadian Dollar weakening. Bitcoin forms a bearish outside bar near recent high',
                'https://dailyforex.com/files/stockphotos1/news/640x360_news_10.jpeg',
                'C:\Users\LENOVO\Desktop\BrokeranalysisDaily\daily forex\www.dailyforex.com\forex-news\2025\05\forex-today-19-may-2025\228471.html',
                ARRAY['bitcoin','forex']
            ) RETURNING id, title;
            

