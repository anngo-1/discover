'use client';

import { FC, useState, useEffect } from 'react';
import { Paper, Title, Text, Group, Loader, Center } from '@mantine/core';

interface ResearchMetricsWrapperProps {
  filters: string;  // This will be the filter criteria
}

const ResearchMetricsWrapper: FC<ResearchMetricsWrapperProps> = ({ filters }) => {
  let [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/metrics?filters=${filters}`);
        if (!response.ok) {
          throw new Error('Failed to fetch metrics');
        }

        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (filters) {
      fetchMetrics();
    }
  }, [filters]);

  if (isLoading) {
    return (
      <Center style={{ height: '300px' }}>
        <Loader size="sm" variant="dots" color="gray" />
      </Center>
    );
  }

  if (!metrics) { // aplaceholder
    metrics = {
      totalPapers: 12000,
      paperGrowth: '+20% from January 2023 to May 2024',
      totalDatasets: 8000,
      datasetGrowth: '+30% from January 2023 to May 2024',
      totalDocuments: 20000,
      documentGrowth: '+10% from January 2023 to May 2024'
    };
  }

  return (
    <Paper p="md" withBorder>
      <Group justify="space-between">
        <div>
          <Title order={4}>Total Papers: {metrics.totalPapers}</Title>
          <Text size="sm" c="dimmed">Growth: {metrics.paperGrowth}</Text>
        </div>
        <div>
          <Title order={4}>Total Datasets: {metrics.totalDatasets}</Title>
          <Text size="sm" c="dimmed">Growth: {metrics.datasetGrowth}</Text>
        </div>
        <div>
          <Title order={4}>Other Documents: {metrics.totalDocuments}</Title>
          <Text size="sm" c="dimmed">Growth: {metrics.documentGrowth}</Text>
        </div>
      </Group>
    </Paper>
  );
};

export default ResearchMetricsWrapper;
