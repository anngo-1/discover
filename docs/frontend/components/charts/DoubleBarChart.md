# Double Bar Chart Component
`components/charts/DoubleBarChart.tsx`

## Overview
A responsive bar chart component that visualizes total results and citations side by side over time using Recharts library.

## Props Interface
```typescript
interface TimeSeriesData {
  year: string | number;     // Label 
  total_results: number;     
  total_citations: number;  
}

interface DoubleBarChartProps {
  data: TimeSeriesData[];    // Array of time series data points
  height?: number;           // Optional height of the chart (default: 400)
}
```

## Features
- Responsive container that adapts to parent width
- Custom tooltip showing detailed information

## Usage Example
```tsx
import DoubleBarChart from '@/components/charts/DoubleBarChart';

const MyComponent = () => {
  const data = [
    { year: 2020, total_results: 1500, total_citations: 3000 },
    { year: 2021, total_results: 1800, total_citations: 3500 },
    { year: 2022, total_results: 2100, total_citations: 4000 },
  ];

  return (
    <DoubleBarChart 
      data={data}
      height={400}
    />
  );
};
```

