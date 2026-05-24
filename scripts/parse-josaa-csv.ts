import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

const OUTPUT_DIR = path.join(process.cwd(), "data", "josaa", "iit");

const COLUMN_MAP = {
  institute: "Institute",
  program: "Academic Program Name",
  quota: "Quota",
  category: "Seat Type",
  pool: "Gender",
  openingRank: "Opening Rank",
  closingRank: "Closing Rank"
};

const CATEGORY_MAP: Record<string, string> = {
  "OPEN": "GEN",
  "OBC-NCL": "OBC-NCL",
  "EWS": "EWS",
  "SC": "SC",
  "ST": "ST",
  "OPEN (PwD)": "GEN-PwD",
  "OBC-NCL (PwD)": "OBC-NCL-PwD",
  "EWS (PwD)": "EWS-PwD",
  "SC (PwD)": "SC-PwD",
  "ST (PwD)": "ST-PwD"
};

const POOL_MAP: Record<string, string> = {
  "Gender-Neutral": "Gender-Neutral",
  "Female-only (including Supernumerary)": "Female-Only"
};

const ROUND_FILES = [
  { round: 1, file: "assets/iit_admission_cutoffs.csv" },
  { round: 2, file: "assets/College_list_iits_round2.csv" },
  { round: 3, file: "assets/College_list_iits_round3.csv" },
  { round: 4, file: "assets/College_list_iits_round4.csv" },
  { round: 5, file: "assets/College_list_iits_round5.csv" },
  { round: 6, file: "assets/College_list_iits_round6.csv" }
];

export interface IITCutoffRow {
  institute: string;
  program: string;
  quota: string;
  category: string;
  gender_pool: string;
  opening_rank: number;
  closing_rank: number;
  round: number;
}

function run() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const results: Record<number, IITCutoffRow[]> = {};
  const stats = { skipped: 0, institutes: new Set<string>(), programs: new Set<string>() };

  for (const { round, file } of ROUND_FILES) {
    results[round] = [];
    const filePath = path.join(process.cwd(), file);
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${file}`);
      // Still write an empty array to never skip a round
      fs.writeFileSync(path.join(OUTPUT_DIR, `round${round}.json`), "[]");
      continue;
    }
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const records = parse(fileContent, { columns: true, skip_empty_lines: true });

    for (const row of records as Record<string, string>[]) {
      const institute = row[COLUMN_MAP.institute];
      if (!institute || !institute.startsWith("Indian Institute of Technology")) {
        stats.skipped++;
        continue;
      }

      const rawCategory = row[COLUMN_MAP.category];
      const category = CATEGORY_MAP[rawCategory] || rawCategory;
      const rawPool = row[COLUMN_MAP.pool];
      const gender_pool = POOL_MAP[rawPool] || rawPool;

      const openingRankText = row[COLUMN_MAP.openingRank]?.replace(/[pP]$/g, '')?.replace(/,/g, '');
      const closingRankText = row[COLUMN_MAP.closingRank]?.replace(/[pP]$/g, '')?.replace(/,/g, '');
      
      const opening_rank = parseInt(openingRankText, 10);
      const closing_rank = parseInt(closingRankText, 10);

      if (isNaN(opening_rank) || isNaN(closing_rank)) {
        stats.skipped++;
        continue;
      }

      stats.institutes.add(institute);
      stats.programs.add(row[COLUMN_MAP.program]);

      results[round].push({
        institute,
        program: row[COLUMN_MAP.program],
        quota: row[COLUMN_MAP.quota],
        category,
        gender_pool,
        opening_rank,
        closing_rank,
        round
      });
    }
    
    fs.writeFileSync(
      path.join(OUTPUT_DIR, `round${round}.json`),
      JSON.stringify(results[round], null, 2)
    );
    console.log(`Round ${round}: ${results[round].length} rows`);
  }
  
  console.log(`Unique IITs: ${stats.institutes.size}`);
  console.log(`Unique Programs: ${stats.programs.size}`);
  console.log(`Skipped Rows: ${stats.skipped}`);
}

run();
