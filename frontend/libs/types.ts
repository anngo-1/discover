// lib/types.ts
export type ResearchType = 'paper' | 'dataset' | 'book' | 'thesis';

export interface Research {
  id: string;
  title: string;
  author: string;
  type: ResearchType;
  date: string;
  citations: number;
  department?: string;
  abstract?: string;
  keywords?: string[];
}

export interface FilterState {
  dateRange?: [Date | null, Date | null];
  types?: ResearchType[];
  searchTerm?: string;
  department?: string;
}

export interface ResearchMetric {
  totalPapers: number;
  totalDatasets: number;
  paperGrowth: number;
  datasetGrowth: number;
  researchPeak: string;
}

export interface Researcher {
  id: string;
  name: string;
  department: string;
  publications: number;
  citations: number;
  hIndex: number;
}

export interface Journal {
  id: string;
  name: string;
  publisher: string;
  impactFactor: number;
  publications: number;
}

export interface Topic {
  id: string;
  name: string;
  count: number;
  relatedTopics: string[];
  trending: boolean;
}

export interface FundingSource {
  id: string;
  name: string;
  amount: number;
  startDate: string;
  endDate: string;
  department: string;
  status: 'active' | 'completed' | 'pending';
}