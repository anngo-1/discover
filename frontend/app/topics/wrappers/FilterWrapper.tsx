'use client';

import { FC, useState, useEffect, Suspense, useMemo } from 'react';
import { Select, Loader, Center, Stack, Space, Text, Flex } from '@mantine/core';
import { fetchTopicsData, TopicsResponse } from '../hooks/getTopicsData';
import Filter from '../../../components/Filter';
import MetricsView from '../components/MetricsView';
import TableView from '../components/Table';
import TopicVisualization from '../components/TopicVisualizations';
import FilterModal from '@/app/works/components/FilterModal';
import { TopicDataPoint, WorksFilterState } from '@/libs/types';
import { worksPredefinedFilters } from '@/app/works/presets/works';

interface FilterWrapperProps {
  initialFilters: WorksFilterState;
}

interface YearOption {
  value: string;
  label: string;
}

const ALL_YEARS = '9999';
const DEFAULT_TOP_N = 5;
const DEFAULT_PAGE = 1;

const FilterContent: FC<FilterWrapperProps> = ({ initialFilters }) => {
  const [currentFilters, setCurrentFilters] = useState<WorksFilterState>(initialFilters);
  const [data, setData] = useState<TopicsResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(ALL_YEARS);
  const [topN, setTopN] = useState(DEFAULT_TOP_N);
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchTopicsData(currentFilters);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentFilters]);

  const yearOptions: YearOption[] = useMemo(() => {
    if (!data) return [];
    
    return Object.keys(data)
      .filter(year => year !== ALL_YEARS)
      .map(year => ({ 
        value: year, 
        label: year 
      }));
  }, [data]);

  const filterData = (year: string, query: string): TopicDataPoint[] => {
    if (!data) return [];
    
    const selectedData = year === ALL_YEARS ? data[ALL_YEARS] : data[year];
    return Array.isArray(selectedData)
      ? selectedData.filter(item => 
          item.concept?.toLowerCase().includes(query.toLowerCase())
        )
      : [];
  };

  if (loading || !data) {
    return (
      <Stack gap={5}>
        <Filter
          initialFilters={currentFilters}
          onFiltersApplied={setCurrentFilters}
          predefinedFilters={worksPredefinedFilters}
          FilterModalComponent={FilterModal}
        />
        <Center py="xl">
          <Loader size="lg" variant="circle" />
        </Center>
      </Stack>
    );
  }

  const filteredData = filterData(selectedYear, searchQuery);

  return (
    <Flex
      direction="column"
      justify="flex-end"
      style={{ minHeight: '100vh' }}
    >
      <Stack gap={10} style={{ flex: 1 }}>
        <Filter
          initialFilters={currentFilters}
          onFiltersApplied={setCurrentFilters}
          predefinedFilters={worksPredefinedFilters}
          FilterModalComponent={FilterModal}
        />

        <Flex align="center" style={{ width: '100%' }}>
          <Text ta="left" fw={700} style={{ flex: 1 }}>
            Topic Metrics
          </Text>

          <Select
            label="Select Year"
            value={selectedYear}
            onChange={(value) => setSelectedYear(value || ALL_YEARS)}
            data={[{ value: ALL_YEARS, label: 'All Years' }, ...yearOptions]}
            placeholder="Select a year"
            clearable
            size="xs"
            style={{ marginLeft: 'auto' }}
          />
        </Flex>

        <MetricsView 
          filteredAndSearchedData={filteredData} 
          loading={loading} 
        />
        <TopicVisualization 
          data={filteredData} 
          topN={topN} 
          setTopN={setTopN} 
        />

        <Space h={5} />
        
        <Stack gap="xs">
          <TableView
            filteredAndSearchedData={filteredData}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            page={page}
            setPage={setPage}
            loading={loading}
          />
        </Stack>
      </Stack>
    </Flex>
  );
};

const FilterWrapper: FC<FilterWrapperProps> = (props) => {
  return (
    <Suspense fallback={
      <Center h={200}>
        <Loader size="xl" type="bars" />
      </Center>
    }>
      <FilterContent {...props} />
    </Suspense>
  );
};

export default FilterWrapper;