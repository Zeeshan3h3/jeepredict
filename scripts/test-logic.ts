import { getRankRange } from '../lib/rank-lookup';
import { supabaseAdmin } from '../lib/supabase-admin';

async function runTests() {
  const testMarks = 121;
  const testCategory = 'GEN';

  console.log('====================================');
  console.log(`1. Testing Rank Prediction for ${testMarks} marks (${testCategory})`);
  console.log('====================================');
  
  const rankResult = getRankRange(testMarks, testCategory as any);
  console.log(JSON.stringify(rankResult, null, 2));

  if (!rankResult) {
    console.log('Result: Below Cutoff');
    return;
  }

  console.log('\n====================================');
  console.log('2. Testing Supabase College Matches Query');
  console.log('====================================');

  const { best, worst } = rankResult._internal;
  
  const { count, error: countError } = await supabaseAdmin
    .from('josaa_cutoffs')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('❌ Supabase Count Error:', countError.message);
  } else {
    console.log(`📊 Total rows in josaa_cutoffs table: ${count}`);
    if (count === 0) {
      console.log('⚠️ The database is completely EMPTY! You need to run: npm run import:josaa');
      return;
    }
  }

  const { data: colleges, error } = await supabaseAdmin
    .from('josaa_cutoffs')
    .select('institute, program, category, closing_rank')
    .eq('category', testCategory)
    .in('gender_pool', ['Gender-Neutral'])
    .gte('closing_rank', Math.round(best * 0.7))
    .lte('closing_rank', Math.max(Math.round(worst * 1.5), worst + 200))
    .eq('year', 2025)
    .order('closing_rank', { ascending: true })
    .limit(5);

  if (error) {
    console.error('❌ Supabase Error:', error.message);
  } else if (colleges && colleges.length > 0) {
    console.log(`✅ Success! Found matches. Here are the top 5:\n`);
    console.table(colleges);
  } else {
    console.log('✅ Query succeeded, but no colleges were found in that specific rank range.');
  }
}

runTests();
