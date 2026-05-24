import { predictAdvancedRank, getRankRange } from './lib/rank-lookup';

console.log("=== Rank Prediction Test ===");
console.log("150 (Test 1) ->", predictAdvancedRank(150));
console.log("150 (Test 2) ->", predictAdvancedRank(150));
console.log("149 (Test 1) ->", predictAdvancedRank(149));
console.log("132 (Test 1) ->", predictAdvancedRank(132));
console.log("200 (Test 1) ->", predictAdvancedRank(200));

console.log("Range Object for 150 ->", getRankRange(150, "GEN")?._internal);
