import { WorksFilterState } from "@/libs/types";

export const initialFilters: WorksFilterState = {
  dateRange: { from: new Date('2023-01-01'), to: new Date('2024-12-31') },
  search_query: "",
  type: ['article', 'preprint'],
  fields: [],
  excludeFields: [],
  openAccess: false,
  has_doi: false,
  citationCount: {
    min: 0,
    max: null,
  },
  subject: "works",
  sort: ['cited_by_count:desc', 'publication_date:desc'] // Sort by publication date descending
};

export const worksPredefinedFilters = [
  { 
    name: 'Filter: Papers from 2022-2024', 
    filters: { 
      ...initialFilters, 
      type: ['article', 'preprint'],
      dateRange: { from: new Date('2022-01-01'), to: new Date('2024-12-31') },
      sort: ['cited_by_count:desc', 'publication_date:desc'] // Sort by publication date descending
    } 
  },
  { 
    name: 'Filter: Papers in Computer Science from 2022-2023', 
    filters: { 
      ...initialFilters, 
      type: ['article', 'preprint'],
      fields: ['Computer Science'], 
      dateRange: { from: new Date('2022-01-01'), to: new Date('2023-12-31') },
      sort: ['cited_by_count:desc', 'publication_date:desc'] // Sort by publication date descending
    } 
  },
  { 
    name: 'Filter: Papers with 10000+ citations from 2000-2024', 
    filters: { 
      ...initialFilters, 
      type: ['article', 'preprint'],
      citationCount: { min: 10000, max: null }, 
      dateRange: { from: new Date('2000-01-01'), to: new Date('2024-12-31') },
      sort: ['cited_by_count:desc', 'publication_date:desc'] // Sort by citation count and publication date descending
    } 
  },
  { 
    name: 'Filter: Mathematics Papers with 500+ Citations', 
    filters: { 
      ...initialFilters, 
      type: ['article', 'preprint'],
      fields: ['Mathematics'],
      citationCount: { min: 500, max: null },
      dateRange: { from: new Date('2010-01-01'), to: new Date('2024-12-31') },
      sort: ['cited_by_count:desc', 'publication_date:desc'] // Sort by citation count and publication date descending
    } 
  },
  {
    name: 'Filter: AI/ML Papers Since 2023',
    filters: {
      ...initialFilters,
      type: ['article', 'preprint'],
      fields: ['Computer Science'],
      search_query: "artificial intelligence OR machine learning OR deep learning",
      dateRange: { from: new Date('2023-01-01'), to: new Date('2024-12-31') },
      has_doi: true,
      sort: ['cited_by_count:desc', 'publication_date:desc'] // Sort by publication date descending and citation count descending
    }
  }
];
