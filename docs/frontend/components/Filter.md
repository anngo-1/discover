# Filter Component
`components/Filter.tsx`

## Overview
A generic filter component that manages filter state and provides a carousel of filter options, including custom and predefined filters. The inputs are the intial filters, predefined filters, a function to call when filters are applied, and a filter modal that allows the user to select the filters.

## Props Interface
```typescript
interface FilterProps<T> {
  // Initial filter state
  initialFilters: T;
  
  // Array of predefined filter configurations
  predefinedFilters: { 
    name: string; 
    filters: T; 
  }[];
  
  // Callback function when filters are applied
  onFiltersApplied: (newFilters: T) => Promise<void>; 
  
  // Modal component for filter configuration
  FilterModalComponent: FC<{
    opened: boolean;
    onClose: () => void;
    onApply: (filters: T) => Promise<void>;
    initialFilters: T;
    isLoading: boolean;
  }>;
}
```

## Features
- Generic typing for filter state
- Carousel of filter options
- Custom and predefined filters
- Async filter application
- Loading states
- Success/Error notifications
- Modal integration
- Active filter indication

## Usage Example
```tsx
import Filter from '@/components/Filter';
import CustomFilterModal from './CustomFilterModal';

interface MyFilters {
  dateRange: DateRange;
  searchTerm: string;
  // ... other filter properties
}

const MyComponent = () => {
  const initialFilters: MyFilters = {
    dateRange: { start: null, end: null },
    searchTerm: '',
  };

  const predefinedFilters = [
    { 
      name: 'Last Month', 
      filters: { 
        dateRange: { start: lastMonth, end: today },
        searchTerm: '' 
      } 
    },
    // ... other predefined filters
  ];

  const handleFiltersApplied = async (filters: MyFilters) => {
    // Handle filter application
    await applyFilters(filters);
  };

  return (
    <Filter
      initialFilters={initialFilters}
      predefinedFilters={predefinedFilters}
      onFiltersApplied={handleFiltersApplied}
      FilterModalComponent={CustomFilterModal}
    />
  );
};
```

