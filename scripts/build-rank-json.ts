import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const DATA_DIR = path.join(process.cwd(), 'data', 'raw');
const OUTPUT_FILE = path.join(process.cwd(), 'data', 'marks-to-rank.json');

const CATEGORY_FILES: Record<string, string> = {
  'GEN': 'marks_vs_rank_2026.csv',
  'OBC-NCL': 'marks_vs_rank_OBC_NCL_2026.csv',
  'EWS': 'marks_vs_rank_EWS_2026.csv',
  'SC': 'marks_vs_rank_SC_2026.csv',
  'ST': 'marks_vs_rank_ST_2026.csv'
};

type RankData = {
  rank: number;
  marks: number;
};

function main() {
  const result: Record<string, RankData[]> = {};

  for (const [category, filename] of Object.entries(CATEGORY_FILES)) {
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      result[category] = [];
      continue;
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const parsedData: RankData[] = records.map((record: any) => ({
      rank: parseInt(record['Rank'], 10),
      marks: parseInt(record['Marks'], 10)
    }));

    // Sort ascending by rank
    parsedData.sort((a, b) => a.rank - b.rank);

    result[category] = parsedData;
  }

  // Ensure output directory exists
  const outDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2), 'utf-8');
  console.log(`Successfully built ${OUTPUT_FILE}`);
}

main();
