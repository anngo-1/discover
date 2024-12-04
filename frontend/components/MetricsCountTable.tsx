import React, { useState, useEffect, useMemo } from 'react';
import { Paper, Text, Group, Loader, Center, Stack, ScrollArea, TextInput, Box, Menu, UnstyledButton, Flex, Divider } from '@mantine/core';
import { debounce } from 'lodash';
import { ChevronDown, Search } from 'lucide-react';

export type MetricData = Record<string, number>;

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
  const initialTab = defaultActiveTab || (categories.length > 0 ? categories[0].id : null);
  const [activeTab, setActiveTab] = useState<string | null>(initialTab);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [tabSearchTerm, setTabSearchTerm] = useState('');
  
  // Set initial active tab when categories change and there isn't one selected
  useEffect(() => {
    if (!activeTab && categories.length > 0) {
      setActiveTab(categories[0].id);
    }
  }, [categories, activeTab]);

  const debouncedSearch = useMemo(() => debounce((term: string) => setSearchTerm(term), 300), []);
  const debouncedTabSearch = useMemo(() => debounce((term: string) => setTabSearchTerm(term), 300), []);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
      debouncedTabSearch.cancel();
    };
  }, [debouncedSearch, debouncedTabSearch]);

  const filteredCategories = useMemo(() => 
    categories.filter(cat => 
      cat.label.toLowerCase().includes(tabSearchTerm.toLowerCase())
    )
  , [categories, tabSearchTerm]);

  const activeCategory = categories.find(cat => cat.id === activeTab);

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

  // Show empty state if no categories are available
  if (categories.length === 0) {
    return (
      <Paper shadow="sm" radius="md" withBorder h={500}>
        <Center h={500}>
          <Stack gap="xs" align="center">
            <Text size="lg" fw={500} c="dimmed">No categories available</Text>
            <Text size="sm" c="dimmed">Please add some categories to get started</Text>
          </Stack>
        </Center>
      </Paper>
    );
  }

  const renderMetricsList = (metrics: MetricData) => {
    const total = getTotalValue(metrics);
    const filteredMetrics = getFilteredMetrics(metrics);
    
    if (Object.keys(filteredMetrics).length === 0) {
      return (
        <Center h={350}>
          <Stack gap="xs" align="center">
            <Text size="lg" fw={500} c="dimmed">No results found</Text>
            <Text size="sm" c="dimmed">Try adjusting your search terms</Text>
          </Stack>
        </Center>
      );
    }
    
    return (
      <ScrollArea h={400} scrollbarSize={8}>
        <Stack gap={2}>
          {Object.entries(filteredMetrics).map(([name, value], index) => (
            <Paper 
              key={name} 
              p="xs"
              withBorder 
              radius="md"
              bg={index % 2 === 0 ? 'gray.0' : 'white'}
            >
              <Group justify="space-between" wrap="nowrap" gap="xs">
                <Box style={{ flex: 1 }}>
                  <Group gap={6} align="center">
                    <Text fw={500} lineClamp={1} size="sm">
                      {name}
                    </Text>
                    <Text size="xs" c="dimmed" span>
                      ({((value / total) * 100).toFixed(1)}%)
                    </Text>
                  </Group>
                </Box>
                <Text fw={600} c="blue.7" style={{ whiteSpace: 'nowrap' }} size="sm">
                  {value.toLocaleString()}
                </Text>
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
        [`@media (maxWidth: ${theme.breakpoints.sm})`]: {
          maxWidth: '100%'
        },
      })}
    >
      <Paper shadow="sm" radius="md" withBorder h={500}>
        <Flex direction="column" h="100%">
          <Box p="xs">
            <Group gap="xs" align="center">
              <Menu shadow="md" width={300} position="bottom-start">
                <Menu.Target>
                  <UnstyledButton>
                    <Paper withBorder p="xs" pr="sm" radius="md">
                      <Group gap="xs">
                        <Text fw={500} size="sm">{activeCategory?.label || 'Select Category'}</Text>
                        <Text size="xs" c="dimmed" span>
                          ({Object.keys(activeCategory?.data || {}).length})
                        </Text>
                        <ChevronDown size={14} />
                      </Group>
                    </Paper>
                  </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown>
                  <Box p="xs">
                    <TextInput
                      placeholder="Find a category..."
                      leftSection={<Search size={14} />}
                      onChange={(e) => debouncedTabSearch(e.target.value)}
                      size="xs"
                    />
                  </Box>
                  <Divider my={4} />
                  <ScrollArea.Autosize mah={400} scrollbarSize={8}>
                    <Box pr="sm">
                      {filteredCategories.map((category) => (
                        <Menu.Item
                          key={category.id}
                          onClick={() => setActiveTab(category.id)}
                          bg={category.id === activeTab ? 'blue.0' : undefined}
                          p="xs"
                        >
                          <Group justify="space-between" gap="xs">
                            <Text size="sm">{category.label}</Text>
                            <Text size="xs" c="dimmed">
                              {Object.keys(category.data).length}
                            </Text>
                          </Group>
                        </Menu.Item>
                      ))}
                    </Box>
                  </ScrollArea.Autosize>
                </Menu.Dropdown>
              </Menu>

              {activeCategory?.searchable && (
                <TextInput
                  placeholder={`Search in ${activeCategory.label.toLowerCase()}...`}
                  leftSection={<Search size={14} />}
                  onChange={(e) => debouncedSearch(e.target.value)}
                  style={{ flex: 1 }}
                  size="xs"
                />
              )}
            </Group>
          </Box>

          <Divider />

          <Box style={{ flex: 1 }} p="xs">
            {activeCategory && renderMetricsList(activeCategory.data)}
          </Box>
        </Flex>
      </Paper>
    </Box>
  );
};

export default MetricsCountTable;