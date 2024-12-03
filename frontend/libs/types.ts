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


export type LogicOperator = 'AND' | 'OR' | 'NOT'

export type FilterGroup<T> = {
  operator: LogicOperator;
  values: T[];
};

export type WorksFilterState = {
  [x: string]: any;

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


  researchCategories?: {
    operator?: LogicOperator;
    bra?: FilterGroup<string>;
    hra?: FilterGroup<string>;
    hrcs?: {
      operator: LogicOperator;
      hc?: FilterGroup<string>;
      rac?: FilterGroup<string>;
    };
    icrp?: {
      operator: LogicOperator;
      cso?: FilterGroup<string>;
      ct?: FilterGroup<string>;
    };
    rcdc?: FilterGroup<string>;
    sdg?: FilterGroup<string>;
    uoa?: FilterGroup<string>;
  };

 
  authors: {
    name: string;
    strict: boolean;
    operator?: LogicOperator;
    affiliationLogic?: LogicOperator;
  }[];

  
  metrics: {
    fieldCitationRatio: {
      min: number | null;
      max: number | null;
    };
    relativeCitationRatio: {
      min: number | null;
      max: number | null;
    };
    altmetricScore?: {
      min: number | null;
      max: number | null;
    };
    recentCitations?: {
      min: number | null;
      max: number | null;
    };
  };

  
  organizations: {
    research: string[];
    funding: string[];
    operator?: LogicOperator;
  };

  countries: {
    research: string[];
    funding: string[];
    operator?: LogicOperator;
    cities?: string[];
    states?: string[];
  };


  publicationIds: {
    doi?: string;
    pmid?: string;
    pmcid?: string;
    arxivId?: string;
    isbn?: string;
    eisbn?: string;
  };

  hasFullText: boolean;
  documentType: {
    classification?: string;
    isCitable?: boolean;
  };
  journalLists?: string[];

  concepts?: {
    terms: string[];
    minRelevance: number;
    operator: LogicOperator;
    matchType: 'exact' | 'partial' | 'semantic';
  };

  contentFilters?: {
    hasAcknowledgements?: boolean;
    hasAbstract?: boolean;
    hasFundingSection?: boolean;
    hasPatentIds?: boolean;
    hasClinicalTrialIds?: boolean;
    meshTerms?: FilterGroup<string>;
    meshHeadings?: FilterGroup<string>;
    publicationType?: FilterGroup<string>;
  };

  sourceFilters?: {
    journalIds?: string[];
    publisherIds?: string[];
    issn?: string[];
    eissn?: string[];
    volume?: string;
    issue?: string;
    operator?: LogicOperator;
  };


  pubmedFilters?: {
    meshTerms?: FilterGroup<string>;
    meshHeadings?: FilterGroup<string>;
    publicationTypes?: FilterGroup<string>;
    keywords?: FilterGroup<string>;
    operator?: LogicOperator;
  };
};

export type SortOption = {
  field: string;
  direction: 'asc' | 'desc';
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
      year: string; 
      totalPublications: number;
      avgCitations: number;
      openAccessRatio: number; 
    }>;
    publicationTypesData: Array<{
      year: string;
      articles: number;
      preprints: number;
      clinical: number;
      reviews: number;
    }>;
  };
}

interface YearlyData {
  arxiv_preprint_count: number;
  avg_authors_per_paper: number;
  avg_citations: number;
  avg_field_citation_ratio: number;
  avg_relative_citation_ratio: number;
  chapter_count: number;
  citable_output_count: number;
  citable_ratio: number;
  citation_impact_change: number | null;
  clinical_trial_count: number;
  clinical_trial_ratio: number;
  conference_paper_count: number;
  conference_paper_ratio: number;
  data_sharing_count: number;
  data_sharing_ratio: number;
  editorial_count: number;
  max_authors: number;
  online_published_count: number;
  online_published_ratio: number;
  open_access_count: number;
  open_access_ratio: number;
  open_access_ratio_change: number | null;
  patent_count: number;
  patent_ratio: number;
  pmc_count: number;
  print_published_count: number;
  print_published_ratio: number;
  publication_growth_rate: number | null;
  pubmed_indexed_count: number;
  pubmed_indexed_ratio: number;
  reference_work_count: number;
  research_article_count: number;
  research_article_ratio: number;
  review_article_count: number;
  review_article_ratio: number;
  total_publications: number;
  unclassified_count: number;
}

interface DimensionsStats {
  data: {
    [year: string]: YearlyData;
  };
  metadata: {
    filters_applied: {
      citationCount: {
        max: number | null;
        min: number;
      };
      dateRange: {
        from: string;
        to: string;
      };
    };
  };
  status: string;
  summary: {
    total_years: number;
    year_range: {
      earliest: number;
      latest: number;
    };
  };
}


interface LoadingState {
  dimensions: boolean;
  works: boolean;
  groups: boolean;
}

interface AggregatedMetrics {
  totalPublications: number;
  totalResearchArticles: number;
  totalClinicalTrials: number;
  avgCitations: number;
  dataSharingRatio: number;
}

interface PublicationType {
  name: string;
  value: number;
}

interface PublicationRatio {
  year: string;
  'Research Articles': number;
  'Clinical Trials': number;
  'Conference Papers': number;
  'Review Articles': number;
}

export type {
  YearlyData,
  DimensionsStats,
  LoadingState,
  AggregatedMetrics,
  PublicationType,
  PublicationRatio
};

export interface JournalStats {
  avg_citations: number;
  avg_field_citation_ratio: number;
  first_publication: string;
  journal_name: string;
  last_publication: string;
  open_access_count: number;
  open_access_ratio: number;
  papers_with_data: number;
  publication_count: number;
  publication_span_years: number;
  publisher_name: string;
  year: number;
}

export interface AggregatedStats extends JournalStats {
  total_citations: number;
  total_field_citations: number;
  yearly_data?: {
      [year: string]: {
          publication_count: number;
          citations: number;
          open_access_count: number;
          papers_with_data: number;
      }
  }
}

export interface TimeSeriesMetric {
  value: 'publications' | 'citations' | 'openAccess';
  label: string;
}

export interface TimeSeriesData {
  year: number;
  name: string;
  publications: number;
  citations: number;
  openAccess: number;
}

export interface TopNFilter {
  value: 'publication_count' | 'avg_citations' | 'papers_with_data' | 'open_access_count' | 'avg_field_citation_ratio';
  label: string;
}

export interface JournalFilterState {
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  journalLists: string[];
  search_query: string;
  citationMetrics: {
    minImpactFactor: number | null;
    minCiteScore: number | null;
    minHIndex: number | null;
    minCitations: number | null;
    maxCitations: number | null;
    minFieldCitationRatio: number | null;
    minRelativeCitationRatio: number | null;
  };
  publisherFilters: {
    publishers: string[];
    excludePublishers: string[];
  };
  accessType: {
    openAccess: boolean;
    subscription: boolean;
    hybrid: boolean;
  };
  subjectAreas: string[];
  publicationFrequency: {
    minArticlesPerYear: number | null;
    maxArticlesPerYear: number | null;
  };
  sort: string[];
  organizations: {
    research: string[];
    funding: string[];
  };
  documentTypes: {
    include: string[];
    exclude: string[];
  };
  preprints: {
    include: boolean;
    exclude: boolean;
    only: boolean;
  };
}