import React, { useState, useEffect, useMemo } from 'react';
import { Tabs, Paper, Text, Group, Loader, Center, Stack, ScrollArea, TextInput } from '@mantine/core';
import { debounce } from 'lodash';

type Metrics = {
  [key: string]: number;
};

interface MetricsListViewProps {
  funders: Metrics;
  publishers: Metrics;
  openAccess: Metrics;
  isLoading: boolean;
}

export const MetricsListView: React.FC<MetricsListViewProps> = ({
  funders,
  publishers,
  openAccess,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<string | null>('funders');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Debounced search handler
  const debouncedSearch = useMemo(() => debounce((term: string) => setSearchTerm(term), 300), []);

  // Filter the metrics based on the current tab and search term
  const getFilteredMetrics = (metrics: Metrics): Metrics => {
    const filtered = Object.entries(metrics).filter(([name]) =>
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const sortedEntries = filtered.sort(([, a], [, b]) => b - a);
    return Object.fromEntries(sortedEntries);
  };

  useEffect(() => {
    return () => debouncedSearch.cancel(); // Clean up on unmount
  }, [debouncedSearch]);

  if (isLoading) {
    return (
      <Center h={400}>
        <Loader size="lg" variant="bars" />
      </Center>
    );
  }

  const getTotalValue = (metrics: Metrics) => {
    return Object.values(metrics).reduce((acc, value) => acc + value, 0);
  };

  const renderMetricsList = (metrics: Metrics, total: number) => {
    const filteredMetrics = getFilteredMetrics(metrics);
    const filteredMetricsEntries = Object.entries(filteredMetrics);

    return (
      <ScrollArea
        h={300}  // Limit the height of the scrollable area
        type="scroll"
        style={{ overflowY: 'auto' }}  // Ensure vertical scroll only
      >
        <Stack gap="xs">
          {filteredMetricsEntries.map(([name, value]) => {
            const percentage = ((value / total) * 100).toFixed(2);

            return (
              <Paper key={name} p="sm" radius="sm" style={{ backgroundColor: 'transparent' }}>
                <Group gap="apart">
                  <Text fw={500} size="md" style={{ maxWidth: '60%' }}>
                    {name}
                  </Text>
                  <Group>
                    <Text size="lg" fw={600}>
                      {value.toLocaleString()}
                    </Text>
                    <Text size="sm" fw={500} style={{ color: '#888' }}>
                      ({percentage}%)
                    </Text>
                  </Group>
                </Group>
              </Paper>
            );
          })}
        </Stack>
      </ScrollArea>
    );
  };

  const getMetricsCount = (metrics: Metrics) => {
    return Object.keys(metrics).length;
  };

  const totalFunders = getTotalValue(funders);
  const totalPublishers = getTotalValue(publishers);
  const totalOpenAccess = getTotalValue(openAccess);

  return (
    <Paper p="md" radius="md" style={{ backgroundColor: 'transparent', height: '450px' }}>
      <Tabs value={activeTab} onChange={setActiveTab} variant="unstyled">
        <Tabs.List
          grow
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            borderBottom: '2px solid #ccc',
          }}
        >
          <Tabs.Tab
            value="funders"
            style={{
              padding: '10px 20px',
              fontWeight: 500,
              fontSize: '16px',
              color: '#444',
              borderBottom: activeTab === 'funders' ? '2px solid #007BFF' : 'none',
            }}
            rightSection={
              <Text size="sm" style={{ padding: '2px 8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                {getMetricsCount(funders)}
              </Text>
            }
          >
            Funders
          </Tabs.Tab>

          <Tabs.Tab
            value="publishers"
            style={{
              padding: '10px 20px',
              fontWeight: 500,
              fontSize: '16px',
              color: '#444',
              borderBottom: activeTab === 'publishers' ? '2px solid #007BFF' : 'none',
            }}
            rightSection={
              <Text size="sm" style={{ padding: '2px 8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                {getMetricsCount(publishers)}
              </Text>
            }
          >
            Publishers
          </Tabs.Tab>

          <Tabs.Tab
            value="openAccess"
            style={{
              padding: '10px 20px',
              fontWeight: 500,
              fontSize: '16px',
              color: '#444',
              borderBottom: activeTab === 'openAccess' ? '2px solid #007BFF' : 'none',
            }}
            rightSection={
              <Text size="sm" style={{ padding: '2px 8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                {getMetricsCount(openAccess)}
              </Text>
            }
          >
            Open Access
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="funders" pt="md">
          <TextInput
            placeholder="Search funders"
            onChange={(e) => debouncedSearch(e.target.value)}
            style={{ marginBottom: '16px' }}
          />
          {renderMetricsList(funders, totalFunders)}
        </Tabs.Panel>

        <Tabs.Panel value="publishers" pt="md">
          <TextInput
            placeholder="Search publishers"
            onChange={(e) => debouncedSearch(e.target.value)}
            style={{ marginBottom: '16px' }}
          />
          {renderMetricsList(publishers, totalPublishers)}
        </Tabs.Panel>

        <Tabs.Panel value="openAccess" pt="md">
          {renderMetricsList(openAccess, totalOpenAccess)}
        </Tabs.Panel>
      </Tabs>
    </Paper>
  );
};

export default MetricsListView;
