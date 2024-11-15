# Works Page Documentation
`app/works/page.tsx`

## Overview
The main page component for the works section, displaying research works with filtering and metrics capabilities.

## Features
- Filter system
- Research metrics
- Paginated results
- Responsive layout

## Component Structure
```
Works Page
├── Navbar
├── Container
│   ├── Description Text
│   └── FilterWrapper
│       ├── Filter Component
│       ├── ResearchMetricsWrapper
│       └── PaginationWrapper
```

## Props
Uses `initialFilters` from works presets for initial filter state.

## Implementation
```tsx
export default function HomePage() {
  return (
    <div>
      <Navbar />
      <Container fluid px={24}>
        <Space h="md" />
        <Text c="dimmed">
          Works include journal articles, books, datasets, and theses.
        </Text>
        <Space h="md" />
        <FilterWrapper initialFilters={initialFilters} />
      </Container>
    </div>
  );
}
```

\