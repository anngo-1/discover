// lib/types.ts
export interface Research {
  id: string;
  title: string;
  author: string;
  type: string;
  date: string;
  citations: number;
  department?: string;
  abstract?: string;
  keywords?: string[];
}



export type WorksFilterState = {
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


export interface QuickMetric {
  title: string;
  value: string | number;
  description: string;
}

export interface WorksMetricsState {
  quickMetrics: {
    totalPapers: number;
    totalCitations: number;
    averageCitations: number;
  };
  visualizationData: {
    timeSeriesData: Array<{
      year: number;
      total_results: number;
      total_citations: number;
    }>;
    stackedData: Array<{
      year: number;
      articles: number;
      preprints: number;
      datasets: number;
    }>;
  };
  groupingsData: {
    funders: Record<string, number>;
    publishers: Record<string, number>;
    openAccess: Record<string, number>;
  };
}