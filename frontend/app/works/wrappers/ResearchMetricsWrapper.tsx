import { FC, useState, useEffect, useRef } from 'react';
import { Paper, Title, Text, Group, Loader, Center, Stack, Grid, Flex } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { FilterState } from '@/libs/types';
import { TimeSeriesChart } from '../charts/DoubleBarChart';
import { StackedBarChart } from '../charts/StackedBarChart';
import { MetricsListView } from '../components/MetricsListView';

interface ResearchMetricsWrapperProps {
  filters: FilterState;
}

interface QuickMetrics {
  totalPapers: number;
  totalCitations: number;
  averageCitations: number;
}

interface TimeSeriesDataPoint {
  year: number;
  total_results: number;
  total_citations: number;
}

interface StackedDataPoint {
  year: number;
  articles: number;
  preprints: number;
  datasets: number;
}

const ResearchMetricsWrapper: FC<ResearchMetricsWrapperProps> = ({ filters }) => {
  const [quickMetrics, setQuickMetrics] = useState<QuickMetrics>({
    totalPapers: 0,
    totalCitations: 0,
    averageCitations: 0
  });
  const [groupingsData, setGroupingsData] = useState<{
    funders: Record<string, number>;
    publishers: Record<string, number>;
    openAccess: Record<string, number>;
  }>({
    funders: {},
    publishers: {},
    openAccess: {}
  });
  const [visualizationData, setVisualizationData] = useState<{
    timeSeriesData: TimeSeriesDataPoint[];
    stackedData: StackedDataPoint[];
  }>({
    timeSeriesData: [],
    stackedData: []
  });

  const [isLoadingQuickMetrics, setIsLoadingQuickMetrics] = useState(false);
  const [isLoadingVisualizations, setIsLoadingVisualizations] = useState(false);
  const [isLoadingGroupings, setIsLoadingGroupings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const host = process.env.NEXT_PUBLIC_HOST

  useEffect(() => {
    const fetchQuickMetrics = async () => {
      setIsLoadingQuickMetrics(true);
      try {
        const response = await fetch(`${host}/works/publications?filter=${encodeURIComponent(JSON.stringify(filters))}&page=1`);

        if (!response.ok) {
          throw new Error('Failed to fetch publications data');
        }

        const data = await response.json();

        setQuickMetrics({
          totalPapers: data.total_count || 0,
          totalCitations: data.cited_by_count || 0,
          averageCitations: data.total_count > 0 ? (data.cited_by_count / data.total_count) : 0
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred fetching quick metrics');
      } finally {
        setIsLoadingQuickMetrics(false);
      }
    };

    fetchQuickMetrics();
  }, [filters]);

  // Fetch visualization data
  useEffect(() => {
    const fetchVisualizationData = async () => {
      setIsLoadingVisualizations(true);
      try {
        const response = await fetch(`${host}/works/works_metrics?filter=${encodeURIComponent(JSON.stringify(filters))}`);

        if (!response.ok) {
          throw new Error('Failed to fetch visualization data');
        }

        const data = await response.json();

        const timeSeriesData = data.timeline.map((entry: any) => ({
          year: Number(entry.period),
          total_results: Number(entry.total || 0),
          total_citations: Number(entry.cited_by_count || 0)
        }));

        const stackedData = data.timeline.map((entry: any) => {
          const typeMap: Record<string, number> = {};
          entry.types?.forEach((type: any) => {
            typeMap[type.name.toLowerCase()] = Number(type.count) || 0;
          });

          return {
            year: Number(entry.period),
            articles: typeMap.article || 0,
            preprints: typeMap.preprint || 0,
            datasets: typeMap.dataset || 0
          };
        });

        setVisualizationData({
          timeSeriesData,
          stackedData
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred fetching visualization data');
      } finally {
        setIsLoadingVisualizations(false);
      }
    };

    fetchVisualizationData();
  }, [filters]);

  // Fetch groupings data
  useEffect(() => {
    const fetchGroupings = async () => {
      setIsLoadingGroupings(true);
      try {
        const response = await fetch(`${host}/works/group_metrics?filter=${encodeURIComponent(JSON.stringify(filters))}`);

        if (!response.ok) {
          throw new Error('Failed to fetch groupings data');
        }

        const data = await response.json();

        setGroupingsData({
          funders: data.funders || {},
          publishers: data.publishers || {},
          openAccess: data.open_access || {}
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred fetching groupings data');
      } finally {
        setIsLoadingGroupings(false);
      }
    };

    fetchGroupings();
  }, [filters]);

  if (error) {
    return (
      <Center>
        <Text c="red">{error}</Text>
      </Center>
    );
  }

  return (
    <div className="p-4" ref={containerRef}>
      <Group justify="flex-start" mb="md">
        <Text fw={700}>Research Metrics Dashboard</Text>
      </Group>

      <Paper p={isMobile ? "md" : "xl"} shadow="sm" radius="md" withBorder>
        <Stack gap="xl">
          {/* Quick Metrics Section */}
          <Group grow gap="md" wrap={isMobile ? "wrap" : "nowrap"}>
            <Paper p="md" radius="md" withBorder>
              <Stack gap="xs">
                <Text fw={500} c="dimmed">Total Results</Text>
                {isLoadingQuickMetrics ? (
                  <Center><Loader size="sm" /></Center>
                ) : (
                  <Title order={3} fw={700} c="blue">
                    {quickMetrics.totalPapers.toLocaleString()}
                  </Title>
                )}
                <Text c="dimmed">Total number of results found</Text>
              </Stack>
            </Paper>

            <Paper p="md" radius="md" withBorder>
              <Stack gap="xs">
                <Text fw={500} c="dimmed">Total Citations</Text>
                {isLoadingQuickMetrics ? (
                  <Center><Loader size="sm" /></Center>
                ) : (
                  <Title order={3} fw={700} c="blue">
                    {quickMetrics.totalCitations.toLocaleString()}
                  </Title>
                )}
                <Text c="dimmed">Total citations from all results</Text>
              </Stack>
            </Paper>

            <Paper p="md" radius="md" withBorder>
              <Stack gap="xs">
                <Text fw={500} c="dimmed">Average Citations</Text>
                {isLoadingQuickMetrics ? (
                  <Center><Loader size="sm" /></Center>
                ) : (
                  <Title order={3} fw={700} c="blue">
                    {quickMetrics.averageCitations.toFixed(1)}
                  </Title>
                )}
                <Text c="dimmed">Average citations per work</Text>
              </Stack>
            </Paper>
          </Group>
          <Flex
            direction={{ base: 'column', md: 'row' }} // Stack on mobile (base), side-by-side on medium and up (md)
            gap="lg"

            style={{ width: '100%', marginTop: '20px' }} // Added marginTop here
          >
            {/* Left column for Stacked Bar Chart */}
            <Paper
              p="md"
              radius="md"
              withBorder
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Title order={4} mb="md" fw={600}>Publication Types Over Time</Title>
              {isLoadingVisualizations ? (
                <Center style={{ height: '100%' }}>
                  <Loader variant="bars" color="blue" />
                </Center>
              ) : (
                <StackedBarChart
                  data={visualizationData.stackedData}
                  containerId="stacked-chart"
                  width={containerRef.current?.offsetWidth || 0}
                />
              )}
            </Paper>

            {/* Right column for Metrics List View */}
            <Paper
              p="md"
              radius="md"
              withBorder
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Title order={4} mb="md" fw={600}>More Metrics</Title>
              <MetricsListView
                funders={groupingsData.funders}
                publishers={groupingsData.publishers}
                openAccess={groupingsData.openAccess}
                isLoading={isLoadingGroupings}
              />
            </Paper>
          </Flex>
          {/* Time Series Chart Section */}
          <Paper p="md" radius="md" withBorder>
            <Title order={4} mb="md" fw={600}>Citations and Results Timeline</Title>
            {isLoadingVisualizations ? (
              <Center style={{ height: '400px' }}>
                <Loader variant="bars" color="blue" />
              </Center>
            ) : (
              <TimeSeriesChart
                data={visualizationData.timeSeriesData}
                containerId="citationstimeline"
                width={containerRef.current?.offsetWidth || 0}
              />
            )}
          </Paper>

          {/* Stacked Bar Chart Section */}
        </Stack>

      </Paper>
    </div>
  );
};

export default ResearchMetricsWrapper;