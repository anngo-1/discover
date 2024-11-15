# Works Presets Documentation
`app/works/presets/works.tsx`

## Overview
Defines preset configurations for filters and initial states in the works section.

## Features
- Default filter configuration
- Predefined filter sets

## Initial Filters
```typescript
export const initialFilters: WorksFilterState = {
  dateRange: { 
    from: new Date('2023-01-01'), 
    to: new Date('2024-12-31') 
  },
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
  sort: ['cited_by_count:desc', 'publication_date:desc']
};
```

## Predefined Filters
Includes preset filters for:
- Papers from 2022-2024
- Computer Science papers
- Highly cited papers (10000+ citations)
- Mathematics papers with 500+ citations
- Recent AI/ML papers

## Usage Example
```typescript
import { initialFilters, worksPredefinedFilters } from './works';

// Using initial filters
const filters = { ...initialFilters };

<ResearchMetricsWrapper 
  filters={filters}
/>
```

