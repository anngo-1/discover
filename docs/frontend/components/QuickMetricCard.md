# Quick Metric Card Documentation
`components/QuickMetricCard.tsx`

## Overview
A simple, reusable card component for displaying individual metric statistics with title, value, and description.

## Features
- Clean, consistent layout
- Title and value highlighting
- Description text
- Consistent styling with Mantine theme

## Props Interface
```typescript
interface QuickMetric {
  title: string;      // Metric name/title
  value: string | number;  // Metric value
  description: string;     // Additional context/explanation
}
```

## Styling
- Uses Mantine Paper component for elevation
- Consistent padding and spacing
- Color-coded value display
- Responsive text sizing

## Usage Example
```tsx
<QuickMetricCard
  title="Total Citations"
  value="1,234"
  description="Total number of citations in the last year"
/>
```
