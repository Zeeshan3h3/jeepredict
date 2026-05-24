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

import round1 from './round1.json';
import round2 from './round2.json';
import round3 from './round3.json';
import round4 from './round4.json';
import round5 from './round5.json';
import round6 from './round6.json';

export type RoundNumber = 1 | 2 | 3 | 4 | 5 | 6;

export const josaaData: Record<RoundNumber, IITCutoffRow[]> = {
  1: round1 as IITCutoffRow[],
  2: round2 as IITCutoffRow[],
  3: round3 as IITCutoffRow[],
  4: round4 as IITCutoffRow[],
  5: round5 as IITCutoffRow[],
  6: round6 as IITCutoffRow[],
};
