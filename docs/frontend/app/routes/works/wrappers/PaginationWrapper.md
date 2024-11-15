# Pagination Wrapper Documentation
`app/works/wrappers/PaginationWrapper.tsx`

## Overview
A wrapper component that handles pagination for research works data, including fetching and displaying paginated results.

## Features
- API request to retrieve paginated research works
- Download capability (work in progress)

## Props Interface
```typescript
interface PaginationWrapperProps {
  filters: WorksFilterState;
}
```

## API Integration
```typescript
const fetchPublications = async (page: number) => {
  const response = await fetch(
    `${host}/works/publications?page=${page}&filter=${JSON.stringify(filters)}`
  );
  // Returns publications and total_pages
}
```

## Usage Example
```tsx
<PaginationWrapper 
  filters={{
    dateRange: { from: null, to: null },
    search_query: "",
    type: [],
    // ... other filter properties
  }}
/>
```

