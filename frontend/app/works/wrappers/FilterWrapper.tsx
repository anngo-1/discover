'use client'

import { FC, useState } from 'react';
import ResearchMetricsWrapper from './ResearchMetricsWrapper';
import PaginationWrapper from './PaginationWrapper';
import { WorksFilterState } from '../../../libs/types';
import FilterModal from '../components/FilterModal';
import { worksPredefinedFilters } from '@/app/works/presets/works';
import Filter from '../../../components/Filter';

interface FilterWrapperProps {
  initialFilters: WorksFilterState;
}

const FilterWrapper: FC<FilterWrapperProps> = ({ initialFilters }) => {
  const [currentFilters, setCurrentFilters] = useState<WorksFilterState>(initialFilters);

  return (
    <div>
      <Filter
        initialFilters={currentFilters}
        predefinedFilters={worksPredefinedFilters}
        onFiltersApplied={setCurrentFilters}
        FilterModalComponent={FilterModal}
      />
      <ResearchMetricsWrapper filters={currentFilters} />
      <PaginationWrapper filters={currentFilters} />
    </div>
  );
};

export default FilterWrapper;