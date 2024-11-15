# Works Metrics Hook Documentation
`hooks/getWorksMetricsData.tsx`

## Overview
A custom React hook that fetches and manages various research metrics data, including quick metrics from the search result (total citations, total results), data for the stacked bar chart and double bar chart, and count data for funders, publishers, and open access.

## Features
- Fetches multiple types of metrics data for the Works page
- Manages loading states
- Handles errors
- Automatic data transformation
- Type-safe state management

## Hook Interface
```typescript
function useMetricsData(filters: WorksFilterState) {
  return {
    metrics: WorksMetricsState;
    loading: {
      quickMetrics: boolean;
      visualizations: boolean;
      groupings: boolean;
    };
    error: string | null;
  };
}
```

## State Structure
```typescript
const initialMetricsState = {
  quickMetrics: {
    totalPapers: 0,
    totalCitations: 0,
    averageCitations: 0
  },
  visualizationData: {
    timeSeriesData: [],
    stackedData: []
  },
  groupingsData: {
    funders: {},
    publishers: {},
    openAccess: {}
  }
};
```

## API Endpoints
- `/works/publications` - Quick metrics
- `/works/works_metrics` - Visualization data
- `/works/group_metrics` - Grouping statistics

## Usage Example
```typescript
const MyComponent = () => {
  const filters = {
    // ... filter configuration
  };
  
  const { metrics, loading, error } = useMetricsData(filters); 

  if (error) return <ErrorComponent message={error} />;
  if (loading.quickMetrics) return <LoadingComponent />;

  return (
    // Use metrics data
  );
};
```
