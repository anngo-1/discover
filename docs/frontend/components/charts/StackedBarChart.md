# Stacked Bar Chart Documentation
`components/charts/StackedBarChart.tsx`

## Overview
A responsive stacked bar chart component that visualizes publication types over time, showing the distribution between articles, preprints, and datasets.

## Features
- Stacked bar visualization
- Custom tooltips
- Responsive design
- Formatted numbers
- Color-coded categories

## Interfaces
```typescript
interface StackedBarData {
  year: string | number;
  articles: number;
  preprints: number;
  datasets: number;
}

interface StackedBarChartProps {
  data: StackedBarData[];
  height?: number;
}
```

## Usage Example
```tsx
<StackedBarChart
  data={[
    {
      year: 2023,
      articles: 500,
      preprints: 200,
      datasets: 100
    },
    // ... more data points
  ]}
  height={400}
/>
```
