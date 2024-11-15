# Types Documentation
`libs/types.ts`

## Overview
Central type definitions for the application, defining interfaces for research data, filters, and metrics.

## Type Definitions

### Research Interface
```typescript
interface Research {
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
```

### Works Filter State
```typescript
type WorksFilterState = {
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
```

### Quick Metric Interface
```typescript
interface QuickMetric {
  title: string;
  value: string | number;
  description: string;
}
```

### Works Metrics State
```typescript
interface WorksMetricsState {
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
```

## Usage
- Import types using: `import { TypeName } from '@/libs/types';`
- Used throughout the application for type safety
- Provides centralized type management

## Best Practices
- Keep types DRY (Don't Repeat Yourself)
- Use strict typing
- Document complex types
- Use meaningful naming
- Keep interfaces focused