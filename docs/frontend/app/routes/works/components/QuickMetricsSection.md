# Quick Metrics Section Documentation
`app/works/components/QuickMetricsSection.tsx`

## Overview
A container component that displays three QuickMetricCards in a grid layout with loading states.

## Features
- Responsive grid layout
- Loading state handling
- Metric display
- Automatic number formatting

## Props Interface
```typescript
interface QuickMetricsSectionProps {
  metrics: {
    totalPapers: number;
    totalCitations: number;
    averageCitations: number;
  };
  loading: boolean;
}
```

## Default Metrics
- Total Results
- Total Citations
- Average Citations

## Usage Example
```tsx
<QuickMetricsSection
  metrics={{
    totalPapers: 1000,
    totalCitations: 5000,
    averageCitations: 5
  }}
  loading={false}
/>
```
