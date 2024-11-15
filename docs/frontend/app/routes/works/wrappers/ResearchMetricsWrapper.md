# Research Metrics Wrapper Documentation
`app/works/wrappers/ResearchMetricsWrapper.tsx`

## Overview
A wrapper component for the research metrics section that displays various research metrics visualizations and statistics.

## Features
- Quick metrics overview
- Publication type visualization
- Citation metrics
- Timeline analysis
- Grouping statistics
- Loading states
- Error handling

## Props Interface
```typescript
interface ResearchMetricsWrapperProps {
  filters: WorksFilterState;
}
```

## Component Sections

### Quick Metrics
- Total papers count
- Total citations
- Average citations per paper

### Visualizations
- Publication types over time (stacked bar chart)
- Citations timeline (double bar chart)
- Metrics breakdown table

### Metrics Categories (for the MetricsCountTable)
```typescript
const metricsCategories = [
  { id: 'funders', label: 'Funders', searchable: true },
  { id: 'publishers', label: 'Publishers', searchable: true },
  { id: 'openAccess', label: 'Open Access', searchable: false }
];
```

## Usage Example
```tsx
<ResearchMetricsWrapper 
  filters={{
    dateRange: { from: new Date(), to: new Date() },
    search_query: "",
    type: ["article"],
    // ... other filter properties
  }}
/>
```
