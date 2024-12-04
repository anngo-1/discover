'use client';
import { FC, useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Loader, Center } from '@mantine/core';
import ResearchMetricsWrapper from './ResearchMetricsWrapper';
import PaginationWrapper from './PaginationWrapper';
import { WorksFilterState } from '../../../libs/types';
import FilterModal from '../components/FilterModal';
import { worksPredefinedFilters } from '@/app/works/presets/works';
import Filter from '../../../components/Filter';
import { encodeFilters, decodeFilters } from '../../../utils/filterCompression';

interface FilterWrapperProps {
  initialFilters: WorksFilterState;
}

const FilterContent: FC<FilterWrapperProps> = ({ initialFilters }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const loadFiltersFromURL = (): WorksFilterState => {
    try {
      const encodedFilters = searchParams.get('f');
      if (encodedFilters) {
        const decoded = decodeFilters(encodedFilters);
        if (decoded) {
          return decoded;
        }
      }
      return initialFilters;
    } catch (error) {
      console.error('Error loading filters from URL:', error);
      return initialFilters;
    }
  };

  const [currentFilters, setCurrentFilters] = useState<WorksFilterState>(loadFiltersFromURL());

  useEffect(() => {
    if (searchParams.has('f')) {
      try {
        const encoded = encodeFilters(currentFilters);
        const params = new URLSearchParams(window.location.search);
        params.set('f', encoded);
        params.delete('filters');
        const newPath = `${window.location.pathname}?${params.toString()}`;
        router.push(newPath);
      } catch (error) {
        console.error('Error updating URL:', error);
      }
    }
  }, [currentFilters, router, searchParams]);

  const handleFiltersApplied = (newFilters: WorksFilterState) => {
    try {
      setCurrentFilters(newFilters);
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  };

  return (
    <Box>
      <Filter
        initialFilters={currentFilters}
        predefinedFilters={worksPredefinedFilters}
        onFiltersApplied={handleFiltersApplied}
        FilterModalComponent={FilterModal}
      />
      <ResearchMetricsWrapper filters={currentFilters} />
      <PaginationWrapper filters={currentFilters} />
    </Box>
  );
};

const FilterWrapper: FC<FilterWrapperProps> = (props) => {
  return (
    <Suspense fallback={
      <Center h={100}>
        <Loader size="lg" />
      </Center>
    }>
      <FilterContent {...props} />
    </Suspense>
  );
};

export default FilterWrapper;