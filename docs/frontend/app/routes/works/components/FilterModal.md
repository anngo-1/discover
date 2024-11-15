# Filter Modal Documentation
`app/works/components/FilterModal.tsx`

## Overview
A comprehensive modal component for configuring and applying filters to research works data.

## Features
- Filtering capabilities
- Import/Export filter configurations
- Date range selection
- Text search
- Multi-sort functionality
- Publication type filtering
- Field/Subject filtering
- Citation count range filtering
- Open Access and DOI filtering

## Props Interface
```typescript
interface FilterModalProps {  
  opened: boolean;                                            
  onClose: () => void;                                          
  onApply: (filters: WorksFilterState) => Promise<void>;         
  initialFilters: WorksFilterState;                               
  isLoading: boolean;
}
```

## Key Components

### Filter Options
- Date Range Picker
- Text Search
- Sort Configuration
  - Multiple sort criteria
  - Ascending/Descending toggle
- Publication Type Selection
- Field Selection/Exclusion
- Citation Count Range
- Toggle Switches for:
  - Open Access
  - DOI Existence

### Import/Export
- Export current filters to JSON
- Import filters from JSON file
- Validation of imported filters

## Usage Example
```tsx
<FilterModal
  opened={isModalOpen}
  onClose={handleClose}
  onApply={handleApply}
  initialFilters={currentFilters}
  isLoading={false}
/>
```

