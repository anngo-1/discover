import { FC, useState, useCallback } from 'react';
import { Button, Text, Box, Group } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { IconFilter, IconChevronRight } from '@tabler/icons-react';
import ShareModal from '@/components/Share';
import { FilterState } from '@/libs/types'; // Make sure to import FilterState

type FilterModalProps<T extends FilterState> = {
  opened: boolean;
  onClose: () => void;
  onApply: (filters: T) => void;
  initialFilters: T;
  isLoading: boolean;
};

interface FilterProps<T extends FilterState> {
  initialFilters: T;
  predefinedFilters: Array<{ name: string; filters: T }>;
  onFiltersApplied: (newFilters: T) => void;
  FilterModalComponent: FC<FilterModalProps<T>>;
}

const Filter = <T extends FilterState>({
  initialFilters,
  predefinedFilters,
  onFiltersApplied,
  FilterModalComponent,
}: FilterProps<T>): JSX.Element => {
  const [appliedFilters, setAppliedFilters] = useState<T>(initialFilters);
  const [modalFilters, setModalFilters] = useState<T>(initialFilters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleApplyFilters = useCallback(async (newFilters: T) => {
    setIsLoading(true);
    try {
      await Promise.resolve(onFiltersApplied(newFilters));
      setAppliedFilters(newFilters);
      setIsModalOpen(false);

    } finally {
      setIsLoading(false);
    }
  }, [onFiltersApplied]);

  const handlePredefinedFilterClick = useCallback((predefinedFilter: { filters: T }) => {
    setModalFilters(predefinedFilter.filters);
    setIsModalOpen(true);
  }, []);

  const handleCustomFilterClick = useCallback(() => {
    setModalFilters(appliedFilters);
    setIsModalOpen(true);
  }, [appliedFilters]);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setModalFilters(appliedFilters);
  }, [appliedFilters]);

  return (
    <Box>
      <Group justify="space-between" align="center" mb="xs">
        <Group>
          <Text size="md" fw={700}>Filters</Text>
          <Text size="xs" c="dimmed">({predefinedFilters.length} preset filters available)</Text>
        </Group>
        <ShareModal currentFilters={appliedFilters} />
      </Group>

      <Carousel
        align="start"
        slideSize="auto"
        slidesToScroll={1}
        dragFree
        styles={(theme) => ({
          root: { 
            width: '100%',
            '&:hover': {
              '.mantine-Carousel-control': {
                opacity: 1,
              },
            },
          },
          viewport: { 
            padding: '4px 0',
            borderRadius: theme.radius.sm,
          },
          control: {
            opacity: 0,
            transition: 'opacity 150ms ease',
            width: 30,
            height: 30,
            border: `1px solid ${theme.colors.gray[3]}`,
            backgroundColor: theme.white,
            '&[dataInactive]': {
              opacity: 0,
              cursor: 'default',
            },
          },
        })}
        nextControlIcon={<IconChevronRight size={16} />}
        previousControlIcon={<IconChevronRight size={16} style={{ transform: 'rotate(180deg)' }} />}
        mb="md"
      >
        <Carousel.Slide>
          <Button
            variant="filled"
            leftSection={<IconFilter size={16} />}
            onClick={handleCustomFilterClick}
            h={36}
            ml="xs"
            styles={() => ({
              root: {
                transition: 'transform 150ms ease',
                '&:hover': {
                  transform: 'translateY(-1px)',
                },
              },
            })}
          >
            Current Filter
          </Button>
        </Carousel.Slide>

        {predefinedFilters.map((filter, index) => (
          <Carousel.Slide key={`${filter.name}-${index}`}>
            <Button
              variant="outline"
              onClick={() => handlePredefinedFilterClick(filter)}
              h={36}
              ml="xs"
              styles={(theme) => ({
                root: {
                  borderColor: theme.colors.blue[4],
                  color: theme.colors.blue[6],
                  transition: 'all 150ms ease',
                  '&:hover': {
                    backgroundColor: theme.colors.blue[0],
                    transform: 'translateY(-1px)',
                  },
                },
              })}
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
    </Box>
  );
};

export default Filter;