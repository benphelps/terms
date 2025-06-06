interface AudioTerm {
  term: string;
  sentiment: number;
  primaryCategory: 'positive' | 'negative' | 'neutral';
  subCategories: string[];
  summary: string;
  shortExplanation: string;
  detailedDescription: string;
  relatedTerms: string[];
  oppositeTerms?: string[];
  tags: string[];
  technicalRange: string;
}

interface HarmanCurvePoint {
  frequency: number;
  db: number;
}

interface FrequencyMapping {
  [termName: string]: {
    frequency: number;
    relevance: number;
    range: [number, number];
  };
}

type FilterType = 'all' | 'positive' | 'negative' | 'neutral';

export type { AudioTerm, HarmanCurvePoint, FrequencyMapping, FilterType };