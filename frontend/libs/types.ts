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

export type FilterState = {
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  search_query: string;
  type: string[];
  fields: string[];
  excludeFields: string[];
  citationCount: {
    min: number;
    max: number | null;
  };
  openAccess: boolean;
  has_doi: boolean;
  sort: string[];
  subject: string;
};

export interface MetricsData {
  totalPapers: number;
  totalCitations: number;
  averageCitations: number;
  timeSeriesData: Array<{
    year: any;
    period: string;
    total_results: number;
    total_citations: number;
  }>;
  stackedData: Array<{
    year: any;
    period: string;
    articles: number;
    preprints: number;
    datasets: number;
    other: number;
  }>;
  publishers: Array<{
    name: string;
    count: number;
  }>;
  funders: Array<{
    name: string;
    count: number;
  }>;
  openAccess: Array<{
    name: string;
    count: number;
  }>;
}