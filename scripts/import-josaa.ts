import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { supabaseAdmin } from '../lib/supabase-admin';

const DATA_FILE = path.join(process.cwd(), 'data', 'raw', 'iit_admission_cutoffs.csv');
const BATCH_SIZE = 500;

function cleanString(str: string): string {
  if (!str) return '';
  return str.replace(/^["'\s]+|["'\s]+$/g, '').trim();
}

async function main() {
  if (!fs.existsSync(DATA_FILE)) {
    console.error(`File not found: ${DATA_FILE}`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
  const records: Record<string, string>[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  const rowsToInsert: any[] = [];

  for (const record of records) {
    const seatType = record['Seat Type'] || '';
    if (seatType.includes('(PwD)')) {
      continue;
    }

    let category = '';
    if (seatType === 'OPEN') category = 'GEN';
    else if (seatType === 'OBC-NCL') category = 'OBC-NCL';
    else if (seatType === 'EWS') category = 'EWS';
    else if (seatType === 'SC') category = 'SC';
    else if (seatType === 'ST') category = 'ST';
    else category = seatType;

    let genderPool = '';
    const rawGender = record['Gender'] || '';
    if (rawGender === 'Gender-Neutral') genderPool = 'Gender-Neutral';
    else if (rawGender === 'Female-only (including Supernumerary)') genderPool = 'Female-Only';
    else genderPool = rawGender;

    rowsToInsert.push({
      institute: cleanString(record['Institute']),
      program: cleanString(record['Academic Program Name']),
      quota: record['Quota'],
      category: category,
      gender_pool: genderPool,
      opening_rank: parseInt(record['Opening Rank'], 10) || 0,
      closing_rank: parseInt(record['Closing Rank'], 10) || 0,
      year: 2025
    });
  }

  console.log(`Total rows to process: ${rowsToInsert.length}`);

  let successCount = 0;

  for (let i = 0; i < rowsToInsert.length; i += BATCH_SIZE) {
    const batch = rowsToInsert.slice(i, i + BATCH_SIZE);
    console.log(`Importing rows ${i + 1}–${Math.min(i + BATCH_SIZE, rowsToInsert.length)}...`);

    const { error } = await supabaseAdmin
      .from('josaa_cutoffs')
      .upsert(batch, {
        onConflict: 'institute, program, quota, category, gender_pool, year'
      });

    if (error) {
      console.error(`Error importing batch ${i + 1}–${Math.min(i + BATCH_SIZE, rowsToInsert.length)}:`, error);
    } else {
      successCount += batch.length;
    }
  }

  console.log(`Done. ${successCount} rows imported successfully.`);
}

main().catch(console.error);
