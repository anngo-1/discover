import { FC, useState } from 'react';
import { Button, Text } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { IconFilter } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

interface FilterProps<T> {
  initialFilters: T;
  predefinedFilters: { name: string; filters: T }[];
  onFiltersApplied: (newFilters: T) => void;  
  FilterModalComponent: FC<{
    opened: boolean;
    onClose: () => void;
    onApply: (filters: T) => void;  
    initialFilters: T;
    isLoading: boolean;
  }>;
}

const Filter = <T,>({
  initialFilters,
  predefinedFilters,
  onFiltersApplied,
  FilterModalComponent,
}: FilterProps<T>) => {
  const [appliedFilters, setAppliedFilters] = useState<T>(initialFilters);
  const [modalFilters, setModalFilters] = useState<T>(initialFilters);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleApplyFilters = (newFilters: T) => {  
    setIsLoading(true);
    try {
      onFiltersApplied(newFilters);  
      setAppliedFilters(newFilters);
      setIsModalOpen(false);
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

  const handlePredefinedFilterClick = (predefinedFilter: { name: string; filters: T }) => {
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

  return (
    <div>
      <Text size="md" fw={700} style={{ marginBottom: '10px' }}>
        Filters
      </Text>

      <Carousel
        align="start"
        slideSize="auto"
        slidesToScroll={1}
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
            variant={'filled'}
            leftSection={<IconFilter size="1rem" />}
            onClick={handleCustomFilterClick}
            style={{ marginLeft: '10px', height: '36px' }}
          >
            Filter
          </Button>
        </Carousel.Slide>

        {predefinedFilters.map((filter, index) => (
          <Carousel.Slide key={index}>
            <Button
         variant={'outline'}
              onClick={() => handlePredefinedFilterClick(filter)}
              style={{ marginLeft: '10px', height: '36px' }}
            >
              {filter.name}
            </Button>
          </Carousel.Slide>
        ))}
      </Carousel>

      <FilterModalComponent
        opened={isModalOpen}
        onClose={handleModalClose}
        onApply={handleApplyFilters}
        initialFilters={modalFilters}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Filter;