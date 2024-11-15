'use client'

import { FC, useState } from 'react';
import { WorksFilterState } from '@/libs/types';
interface FilterWrapperProps {
  initialFilters: WorksFilterState;
}

const FilterWrapper: FC<FilterWrapperProps> = ({ initialFilters }) => {
  const [filters, setFilters] = useState<WorksFilterState>(initialFilters);
  
  const handleFiltersApplied = async (newFilters: WorksFilterState) => {
    setFilters(newFilters);
  };

  return (
    <div>
      {/* <Filter
        initialFilters={filters}
        predefinedFilters={worksPredefinedFilters}
        onFiltersApplied={handleFiltersApplied}  //
        FilterModalComponent={FilterModal}  
      />
      <ResearchMetricsWrapper filters={filters} />
      <PaginationWrapper filters={filters} /> */}
    </div>
  );
};

export default FilterWrapper;
