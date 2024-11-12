'use client'
import { FC, useState, useCallback } from 'react';
import { Button, MantineProvider, Text } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { IconFilter, IconLoader2 } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import FilterModal from '../app/works/components/FilterModal';
import { FilterState } from '../libs/types';
import ResearchMetricsWrapper from '../app/works/wrappers/ResearchMetricsWrapper';
import { Notifications } from '@mantine/notifications';
import { worksPredefinedFilters } from '@/app/works/presets/works';

import { useEffect } from 'react';
import PaginationWrapper from '../app/works/wrappers/PaginationWrapper';
interface FilterWrapperProps {
  initialFilters: FilterState;
}

export const FilterWrapper: React.FC<FilterWrapperProps> = ({ initialFilters }) => {
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(initialFilters);
  const [modalFilters, setModalFilters] = useState<FilterState>(initialFilters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("Filter");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleApplyFilters = async (newFilters: FilterState) => {
    setIsLoading(true);
    try {
      setAppliedFilters(newFilters);  // This will trigger a state update
      setActiveFilter("Filter");
      setIsModalOpen(false);
      notifications.show({
        title: 'Filters Applied',
        message: 'Your search filters have been updated successfully.',
        color: 'teal',
        autoClose: 2000,
        withBorder: true,
        style: { backgroundColor: 'white' },
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        color: 'red',
        autoClose: 3000,
        withBorder: true,
        style: { backgroundColor: 'white' },
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {}, [appliedFilters]);

  const handlePredefinedFilterClick = (predefinedFilter: { name: string; filters: FilterState }) => {
    setModalFilters(predefinedFilter.filters);
    setIsModalOpen(true);
  };

  const handleCustomFilterClick = () => {
    setModalFilters(appliedFilters);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalFilters(appliedFilters);
  };

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div>
      <Notifications />
      <Text size="md" fw={700} style={{ marginBottom: '10px' }}>
        Filters
      </Text>

      <div className="filters-carousel-container" style={{ padding: '0 1px' }}>
        <Carousel
          align="start"
          slideSize="auto"
          slidesToScroll={1}
          onSlideChange={handleSlideChange}
          dragFree
          styles={{
            root: { width: '100%' },
            viewport: { padding: '4px 0' },
            control: { display: 'none' },
          }}
          style={{ marginBottom: '10px' }}
        >
          <Carousel.Slide>
            <Button
              variant={activeFilter === "Filter" ? 'filled' : 'outline'}
              leftSection={<IconFilter size="1rem" />}
              onClick={handleCustomFilterClick}
              style={{ marginLeft: '10px', height: '36px' }}
            >
              Filter
            </Button>
          </Carousel.Slide>

          {worksPredefinedFilters.map((filter, index) => (
            <Carousel.Slide key={index}>
              <Button
                variant={activeFilter === filter.name ? 'filled' : 'outline'}
                onClick={() => handlePredefinedFilterClick(filter)}
                style={{ marginLeft: '10px', height: '36px' }}
              >
                {filter.name}
              </Button>
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>

      <FilterModal
        opened={isModalOpen}
        onClose={handleModalClose}
        onApply={handleApplyFilters}
        initialFilters={modalFilters}
        isLoading={isLoading}
      />

      <ResearchMetricsWrapper filters={appliedFilters} />
      <PaginationWrapper filters={appliedFilters} />
    </div>
  );
};


export default FilterWrapper;
