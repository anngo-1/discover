import { JournalFilterState } from "@/libs/types";
interface OrganizationGroup {
  group: string;
  items: {
      value: string;
      label: string;
      description: string;
  }[];
}

export const sortOptions = [
  { value: 'citations', label: 'Citation Count' },
  { value: 'date', label: 'Publication Date' },
  { value: 'field_citation_ratio', label: 'Field Citation Ratio' },
  { value: 'journal_impact_factor', label: 'Journal Impact Factor' },
  { value: 'recent_citations', label: 'Citations (Last 2 Years)' }
];

export const documentTypeOptions = [
  { value: 'RESEARCH_ARTICLE', label: 'Research Article' },
  { value: 'REVIEW_ARTICLE', label: 'Review Article' },
  { value: 'CONFERENCE_PAPER', label: 'Conference Paper' },
  { value: 'EDITORIAL', label: 'Editorial' },
  { value: 'LETTER', label: 'Letter' },
  { value: 'OTHER', label: 'Other' }
];

export const publisherOptions = [
  { value: 'elsevier', label: 'Elsevier' },
  { value: 'springer', label: 'Springer Nature' },
  { value: 'wiley', label: 'Wiley' },
  { value: 'oup', label: 'Oxford University Press' },
  { value: 'taylor_francis', label: 'Taylor & Francis' },
  { value: 'ieee', label: 'IEEE' },
  { value: 'acs', label: 'American Chemical Society' },
  { value: 'sage', label: 'SAGE Publications' },
  { value: 'nature', label: 'Nature Portfolio' },
  { value: 'plos', label: 'PLOS' }
];

export const citationRanges = {
  citations: {
    min: 0,
    max: 1000, 
    average: 15
  },
  fieldCitationRatio: {
    min: 0,
    max: 10 
  },
  journalImpactFactor: {
    min: 0,
    max: 15
  }
};

export const fieldOptions = [
  { value: 'medicine', label: 'Medicine & Health Sciences' },
  { value: 'biology', label: 'Biological Sciences' },
  { value: 'physics', label: 'Physical Sciences' },
  { value: 'chemistry', label: 'Chemical Sciences' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'computer_science', label: 'Computer Science' },
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'social_sciences', label: 'Social Sciences' },
  { value: 'arts_humanities', label: 'Arts & Humanities' },
  { value: 'environmental', label: 'Environmental Sciences' }
];

export const journalListOptions = [
  { value: 'web_of_science', label: 'Web of Science' },
  { value: 'scopus', label: 'Scopus' },
  { value: 'pubmed', label: 'PubMed' },
  { value: 'doaj', label: 'DOAJ (Open Access)' },
  { value: 'scielo', label: 'SciELO' }
];


export const organizationOptions: OrganizationGroup[] = [
  {
      group: 'Main Institution',
      items: [
          {
              value: 'grid.266100.3',
              label: 'University of California, San Diego',
              description: 'San Diego, United States'
          }
      ]
  },
  {
      group: 'University of California System',
      items: [
          {
              value: 'grid.30389.31',
              label: 'University of California System',
              description: 'Oakland, United States'
          }
      ]
  },
  {
      group: 'Child Organizations',
      items: [
          {
              value: 'grid.217200.6',
              label: 'Scripps Institution of Oceanography',
              description: 'La Jolla, United States'
          },
          {
              value: 'grid.516081.b',
              label: 'Moores Comprehensive Cancer Center',
              description: 'La Jolla, United States'
          },
          {
              value: 'grid.468305.c',
              label: 'California Space Grant Consortium',
              description: 'La Jolla, United States'
          },
          {
              value: 'grid.454017.3',
              label: 'California Sea Grant',
              description: 'Eureka, United States'
          },
          {
              value: 'grid.419957.7',
              label: 'San Diego Supercomputer Center',
              description: 'San Diego, United States'
          }
      ]
  },
  {
      group: 'Related Organizations',
      items: [
          {
              value: 'grid.214007.0',
              label: 'Scripps Research Institute',
              description: 'San Diego, United States'
          },
          {
              value: 'grid.250671.7',
              label: 'Salk Institute for Biological Studies',
              description: 'La Jolla, United States'
          },
          {
              value: 'grid.410371.0',
              label: 'VA San Diego Healthcare System',
              description: 'San Diego, United States'
          },
          {
              value: 'grid.286440.c',
              label: "Rady Children's Hospital-San Diego",
              description: 'San Diego, United States'
          },
          {
              value: 'grid.413086.8',
              label: 'University of California San Diego Medical Center',
              description: 'San Diego, United States'
          }
      ]
  }
];



export const defaultFilterState: JournalFilterState = {
  dateRange: {
    from: null,
    to: null
  },
  journalLists: [],
  search_query: '',
  citationMetrics: {
    minImpactFactor: null,
    minCitations: null,
    maxCitations: null,
    minFieldCitationRatio: null,
    minCiteScore: null,
    minHIndex: null,
    minRelativeCitationRatio: null
  },
  publisherFilters: {
    publishers: [],
    excludePublishers: []
  },
  accessType: {
    openAccess: false,
    subscription: false,
    hybrid: false
  },
  subjectAreas: [],
  publicationFrequency: {
    minArticlesPerYear: null,
    maxArticlesPerYear: null
  },
  sort: [],
  organizations: {
    research: [],
    funding: []
  },
  documentTypes: {
    include: [],
    exclude: []
  },
  preprints: {
    include: true,
    only: false,
    exclude: false
  }
};

export const formatCitationRatio = (value: number): string => 
  value.toFixed(1);

export const formatLargeNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};