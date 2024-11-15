import React, { useState, useEffect, useMemo } from 'react';
import { Tabs, Paper, Text, Group, Loader, Center, Stack, ScrollArea, TextInput, Box } from '@mantine/core';
import { debounce } from 'lodash';

type MetricData = Record<string, number>;

export interface MetricCategory {
  id: string;
  label: string;
  data: MetricData;
  searchable?: boolean;
}

interface MetricsCountTableProps {
  categories: MetricCategory[];
  isLoading?: boolean;
  defaultActiveTab?: string;
}

export const MetricsCountTable = ({
  categories,
  isLoading = false,
  defaultActiveTab,
}: MetricsCountTableProps) => {
  const [activeTab, setActiveTab] = useState<string | null>(defaultActiveTab || categories[0]?.id || null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Debounced search handler
  const debouncedSearch = useMemo(() => debounce((term: string) => setSearchTerm(term), 300), []);

  // Clean up debounce on unmount
  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const getFilteredMetrics = (metrics: MetricData): MetricData => {
    return Object.entries(metrics)
      .filter(([name]) => name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort(([, a], [, b]) => b - a)
      .reduce<MetricData>((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  };

  const getTotalValue = (metrics: MetricData): number => 
    Object.values(metrics).reduce((sum, value) => sum + value, 0);

  if (isLoading) {
    return (
      <Center h={500}>
        <Loader size="lg" />
      </Center>
    );
  }

  const renderMetricsList = (metrics: MetricData) => {
    const total = getTotalValue(metrics);
    const filteredMetrics = getFilteredMetrics(metrics);

    return (
      <ScrollArea h={350} scrollbarSize={8}>
        <Stack gap="xs">
          {Object.entries(filteredMetrics).map(([name, value]) => (
            <Paper 
              key={name} 
              p="md" 
              withBorder 
              radius="sm"
              bg="gray.0"
            >
              <Group justify="space-between" wrap="nowrap">
                <Text fw={500} lineClamp={1} style={{ flex: 1 }}>
                  {name}
                </Text>
                <Group gap="sm" wrap="nowrap" ml="md">
                  <Text fw={600} c="blue.7" style={{ whiteSpace: 'nowrap' }}>
                    {value.toLocaleString()}
                  </Text>
                  <Text size="sm" c="dimmed" style={{ whiteSpace: 'nowrap' }}>
                    {((value / total) * 100).toFixed(1)}%
                  </Text>
                </Group>
              </Group>
            </Paper>
          ))}
        </Stack>
      </ScrollArea>
    );
  };

  return (
    <Box
      style={(theme) => ({
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        [`@media (maxWidth: ${theme.breakpoints.sm})`]: {
          maxWidth: '100%',
          padding: theme.spacing.xs,
        },
      })}
    >
      <Paper shadow="sm" radius="md" withBorder h={500}>
        <Tabs value={activeTab} onChange={setActiveTab} variant="default" h="100%">
          <Tabs.List grow style={{ borderBottom: '1px solid #eee' }}>
            {categories.map((category) => (
              <Tabs.Tab 
                key={category.id} 
                value={category.id}
                rightSection={
                  <Text size="xs" c="dimmed">
                    {Object.keys(category.data).length}
                  </Text>
                }
              >
                {category.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          {categories.map((category) => (
            <Tabs.Panel key={category.id} value={category.id} p="md">
              {category.searchable && (
                <TextInput
                  placeholder={`Search ${category.label.toLowerCase()}`}
                  onChange={(e) => debouncedSearch(e.target.value)}
                  mb="md"
                />
              )}
              {renderMetricsList(category.data)}
            </Tabs.Panel>
          ))}
        </Tabs>
      </Paper>
    </Box>
  );
};

export default MetricsCountTable;