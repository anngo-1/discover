# Metrics Count Table Documentation
`components/MetricsCountTable.tsx`

## Overview
A tabbed table component that displays various metric categories with search, sorting, and percentage calculations.

## Features
- Tabbed interface
- Search functionality
- Percentage calculations
- Sorted display
- Responsive design
- Loading states

## Interfaces
```typescript
interface MetricData {
  [key: string]: number;
}

interface MetricCategory {
  id: string;
  label: string;
  data: MetricData;
  searchable?: boolean;
}

interface MetricsCountTableProps {
  categories: MetricCategory[];
  isLoading?: boolean;
  defaultActiveTab?: string;
}
```

## Key Functions
### Search and Filtering
```typescript
const getFilteredMetrics = (metrics: MetricData): MetricData => {
  return Object.entries(metrics)
    .filter(([name]) => name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort(([, a], [, b]) => b - a)
    .reduce<MetricData>((acc, [key, value]) => ({ ...acc, [key]: value }), {});
};
```

### Performance Optimizations
- Debounced search
- Memoized calculations
- Optimized rendering

## Usage Example
```tsx
<MetricsCountTable
  categories={[
    {
      id: 'publishers',
      label: 'Publishers',
      data: { 'Publisher A': 100, 'Publisher B': 200 },
      searchable: true
    }
  ]}
  isLoading={false}
  defaultActiveTab="publishers"
/>
```

