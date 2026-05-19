import { Category, RankResult } from '../types/database';
import rankDataRaw from '../data/marks-to-rank.json';

type RankDataPoint = {
  rank: number;
  marks: number;
};

const rankData = rankDataRaw as Record<string, RankDataPoint[]>;

export function getRankRange(marks: number, category: Category): RankResult | null {
  const data = rankData[category as string];
  if (!data || data.length === 0) return null;

  if (marks > data[0].marks) {
    return {
      displayRank: 1,
      _internal: { best: 1, predicted: 1, worst: 5 }
    };
  }

  if (marks < data[data.length - 1].marks) {
    return null;
  }

  for (let i = 0; i < data.length - 1; i++) {
    const high = data[i];     // Higher marks, lower rank
    const low = data[i + 1];  // Lower marks, higher rank

    if (marks <= high.marks && marks >= low.marks) {
      let predicted: number;
      
      if (high.marks === low.marks) {
        predicted = Math.round((high.rank + low.rank) / 2);
      } else {
        const position = (high.marks - marks) / (high.marks - low.marks);
        predicted = Math.round(high.rank + position * (low.rank - high.rank));
      }
      
      const best = Math.max(1, Math.round(predicted * 0.85));
      const worst = Math.round(predicted * 1.18);
      
      return {
        displayRank: predicted,
        _internal: { best, predicted, worst },
      };
    }
  }

  if (marks === data[data.length - 1].marks) {
    const predicted = data[data.length - 1].rank;
    const best = Math.max(1, Math.round(predicted * 0.85));
    const worst = Math.round(predicted * 1.18);
    return {
      displayRank: predicted,
      _internal: { best, predicted, worst },
    };
  }

  return null;
}
