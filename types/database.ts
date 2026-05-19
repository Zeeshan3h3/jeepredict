export type Category = 'GEN' | 'OBC-NCL' | 'EWS' | 'SC' | 'ST';

export type RankRange = {
  best: number;
  predicted: number;
  worst: number;
};

export interface RankResult {
  displayRank: number;
  _internal: RankRange;
}

export type Tier = 'dream' | 'realistic' | 'safe';

export interface CollegeMatch {
  id: number;
  institute: string;
  program: string;
  quota: string;
  category: string;
  gender_pool: string;
  opening_rank: number;
  closing_rank: number;
  year: number;
  round?: number | null;
  tier: Tier;
}
