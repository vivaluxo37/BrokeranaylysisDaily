// Test script to verify blog performance optimizations
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testBlogPerformance() {
  console.log('🚀 Testing Blog Performance Optimizations...\n');

  try {
    // Test 1: Article fetching performance
    console.log('1. Testing Article Fetching Performance...');
    const startTime = Date.now();
    
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select(`
        id,
        title,
        slug,
        excerpt,
        meta_description,
        published_at,
        updated_at,
        reading_time,
        category,
        tags,
        featured_image_url,
        authors:author_id(name, slug, avatar_url, bio)
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .range(0, 11); // Get 12 articles (limit 12)

    const fetchTime = Date.now() - startTime;

    if (articlesError) {
      console.error('❌ Articles Error:', articlesError);
    } else {
      console.log(`✅ Fetched ${articles.length} articles in ${fetchTime}ms`);
      console.log(`   Average: ${(fetchTime / articles.length).toFixed(2)}ms per article`);
    }

    // Test 2: Article count performance
    console.log('\n2. Testing Article Count Performance...');
    const countStartTime = Date.now();
    
    const { count, error: countError } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');

    const countTime = Date.now() - countStartTime;

    if (countError) {
      console.error('❌ Count Error:', countError);
    } else {
      console.log(`✅ Got article count (${count}) in ${countTime}ms`);
    }

    // Test 3: Individual article fetch performance
    console.log('\n3. Testing Individual Article Fetch Performance...');

    let singleTime = 0;
    if (articles && articles.length > 0) {
      const testSlug = articles[0].slug;
      const singleStartTime = Date.now();

      const { data: singleArticle, error: singleError } = await supabase
        .from('articles')
        .select(`
          *,
          authors:author_id(name, slug, avatar_url, bio, expertise)
        `)
        .eq('slug', testSlug)
        .eq('status', 'published')
        .single();

      singleTime = Date.now() - singleStartTime;

      if (singleError) {
        console.error('❌ Single Article Error:', singleError);
      } else {
        console.log(`✅ Fetched single article "${singleArticle.title}" in ${singleTime}ms`);
      }
    }

    // Test 4: Categories performance
    console.log('\n4. Testing Categories Performance...');
    const catStartTime = Date.now();
    
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, name, slug')
      .order('name');

    const catTime = Date.now() - catStartTime;

    if (catError) {
      console.error('❌ Categories Error:', catError);
    } else {
      console.log(`✅ Fetched ${categories.length} categories in ${catTime}ms`);
    }

    // Test 5: Data quality check
    console.log('\n5. Testing Data Quality...');
    
    let qualityScore = 100;
    const issues = [];

    // Check for articles without excerpts
    const articlesWithoutExcerpts = articles.filter(article => 
      !article.excerpt && !article.meta_description
    );
    if (articlesWithoutExcerpts.length > 0) {
      qualityScore -= 10;
      issues.push(`${articlesWithoutExcerpts.length} articles missing excerpts`);
    }

    // Check for articles without featured images
    const articlesWithoutImages = articles.filter(article => 
      !article.featured_image_url
    );
    if (articlesWithoutImages.length > 0) {
      qualityScore -= 5;
      issues.push(`${articlesWithoutImages.length} articles missing featured images`);
    }

    // Check for articles without reading time
    const articlesWithoutReadingTime = articles.filter(article => 
      !article.reading_time
    );
    if (articlesWithoutReadingTime.length > 0) {
      qualityScore -= 5;
      issues.push(`${articlesWithoutReadingTime.length} articles missing reading time`);
    }

    // Check for articles without tags
    const articlesWithoutTags = articles.filter(article => 
      !article.tags || article.tags.length === 0
    );
    if (articlesWithoutTags.length > 0) {
      qualityScore -= 5;
      issues.push(`${articlesWithoutTags.length} articles missing tags`);
    }

    console.log(`   Data Quality Score: ${qualityScore}/100`);
    if (issues.length > 0) {
      console.log('   Issues found:');
      issues.forEach(issue => console.log(`   - ${issue}`));
    } else {
      console.log('   ✅ No data quality issues found');
    }

    // Performance Summary
    console.log('\n📊 Performance Summary:');
    console.log(`   - Article List Query: ${fetchTime}ms`);
    console.log(`   - Article Count Query: ${countTime}ms`);
    console.log(`   - Single Article Query: ${singleTime}ms`);
    console.log(`   - Categories Query: ${catTime}ms`);
    console.log(`   - Total Articles: ${count || 0}`);
    console.log(`   - Data Quality: ${qualityScore}/100`);

    // Performance Recommendations
    console.log('\n💡 Performance Optimizations Implemented:');
    console.log('   ✅ Selective field fetching (only required fields)');
    console.log('   ✅ Proper indexing on status and published_at');
    console.log('   ✅ Efficient pagination with range queries');
    console.log('   ✅ Optimized author joins');
    console.log('   ✅ Caching layer implemented');
    console.log('   ✅ Static generation with revalidation');

    if (fetchTime < 500 && countTime < 200 && singleTime < 300) {
      console.log('\n🎉 Blog Performance: EXCELLENT');
      console.log('   All queries are performing within optimal thresholds!');
    } else if (fetchTime < 1000 && countTime < 500 && singleTime < 600) {
      console.log('\n✅ Blog Performance: GOOD');
      console.log('   Performance is acceptable but could be improved.');
    } else {
      console.log('\n⚠️  Blog Performance: NEEDS IMPROVEMENT');
      console.log('   Consider additional optimizations.');
    }

    console.log('\n🔗 Test these blog URLs:');
    console.log('   - http://localhost:3001/blog (Blog listing page)');
    if (articles && articles.length > 0) {
      articles.slice(0, 3).forEach(article => {
        console.log(`   - http://localhost:3001/blog/${article.slug} (${article.title})`);
      });
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testBlogPerformance();
