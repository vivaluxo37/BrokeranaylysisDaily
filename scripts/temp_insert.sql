
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
            