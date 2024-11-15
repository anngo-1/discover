# Filter Wrapper Documentation
`app/works/wrappers/FilterWrapper.tsx`

## Overview
The root wrapper component that manages filter state and coordinates between filter UI components and data display components.

## Features
- Centralized filter state management
- Integration of filter modal
- Coordination of research metrics and pagination
- Predefined filter management

## Props Interface
```typescript
interface FilterWrapperProps {
  initialFilters: WorksFilterState;
}
```

## Component Structure
```
FilterWrapper
├── Filter (UI Component)
├── ResearchMetricsWrapper (Data Visualization)
└── PaginationWrapper (Results Display)
```

## Usage Example
```tsx
<FilterWrapper 
  initialFilters={{
    dateRange: { from: new Date(), to: new Date() },
    search_query: "",
    type: [],
    fields: [],
    excludeFields: [],
    // ... other filter properties
  }}
/>
```

