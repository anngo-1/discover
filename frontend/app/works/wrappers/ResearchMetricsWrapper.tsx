import React, { FC } from 'react';
import MetricsCountTable, { MetricCategory } from "@/components/MetricsCountTable";
import QuickMetricsSection from "@/app/works/components/QuickMetricsSection";
import { WorksFilterState } from "@/libs/types";
import { 
  Center, 
  Paper, 
  Stack,
  Text, 
  Loader,
  Container,
  Group,
  SimpleGrid,
  Box
} from '@mantine/core';
import useMetricsData from "@/hooks/getWorksMetricsData";
import DoubleBarChart from '@/components/charts/DoubleBarChart';
import StackedBarChart from '@/components/charts/StackedBarChart';

const ResearchMetricsWrapper: FC<{ filters: WorksFilterState }> = ({ filters }) => {
  const { metrics, loading, error } = useMetricsData(filters);

  if (error) {
    return (
      <Center>
        <Text c="red" fw={700}>{error}</Text>
      </Center>
    );
  }

  const metricsCategories: MetricCategory[] = [
    {
      id: 'funders',
      label: 'Funders',
      data: metrics.groupingsData.funders,
      searchable: true
    },
    {
      id: 'publishers',
      label: 'Publishers',
      data: metrics.groupingsData.publishers,
      searchable: true
    },
    {
      id: 'openAccess',
      label: 'Open Access',
      data: metrics.groupingsData.openAccess,
      searchable: false
    }
  ];

  return (
    <Container size="100%" px={0} w="100%" fluid>
      <Group justify="space-between" mb="lg">
        <Text fw={700}>Research Metrics Dashboard</Text>
      </Group>

      <Paper shadow="sm" radius="md" withBorder p="md">
        <Stack gap="xl">
          <QuickMetricsSection
            metrics={metrics.quickMetrics}
            loading={loading.quickMetrics}
          />

          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            <Paper shadow="xs" p="md" radius="md" withBorder>
              <Text mb="md" fw={700}>Publication Types Over Time</Text>
              {loading.visualizations ? (
                <Center h={500}>
                  <Loader size="lg" variant="bars" />
                </Center>
              ) : (
                <Box h={500}>
                  <StackedBarChart data={metrics.visualizationData.stackedData} />
                </Box>
              )}
            </Paper>

            <Paper shadow="xs" p="md" radius="md" withBorder>
              <Text mb="md" fw={700}>Metrics Breakdown</Text>
              <MetricsCountTable
                categories={metricsCategories}
                isLoading={loading.groupings}
              />
            </Paper>
          </SimpleGrid>

          <Paper shadow="xs" p="md" radius="md" withBorder>
            <Text mb="md" fw={700}>Citations and Results Timeline</Text>
            {loading.visualizations ? (
              <Center h={300}>
                <Loader size="lg" variant="bars" />
              </Center>
            ) : (
              <Box>
                <DoubleBarChart data={metrics.visualizationData.timeSeriesData} />
              </Box>
            )}
          </Paper>
        </Stack>
      </Paper>
    </Container>
  );
};

export default ResearchMetricsWrapper;