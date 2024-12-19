import { FC, useState } from 'react';
import { Card, Group, Text, Select, Tabs, Box } from '@mantine/core';
import { IconChartPie, IconNetwork } from '@tabler/icons-react';
import StaticWordCloud from '../components/StaticWordCloud';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TopicDataPoint } from '@/libs/types';

interface TopicVisualizationProps {
  data: TopicDataPoint[];
  topN: number;
  setTopN: (topN: number) => void;
}

const COLORS = ['#339AF0', '#51CF66', '#FF922B', '#845EF7', '#FF6B6B'];

const TopicVisualization: FC<TopicVisualizationProps> = ({ data, topN, setTopN }) => {
  const chartData = [...data]
    .sort((a, b) => b.publication_count - a.publication_count)
    .slice(0, topN);

  const [activeTab, setActiveTab] = useState<"overview" | "network">("overview");

  const renderCustomLabel = ({ name, percent }: { name: string; percent: number }) => 
    `${name} (${(percent * 100).toFixed(0)}%)`;

  return (
    <Card shadow="sm" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="space-between" align="center">
          <Text fw={700}>Research Topics Visualization</Text>
          <Select
            size="sm"
            value={topN.toString()}
            onChange={(value) => setTopN(Number(value))}
            data={['5', '10', '15', '20']}
            style={{ width: 100 }}
          />
        </Group>
      </Card.Section>
      <Tabs value={activeTab} onChange={(value) => setActiveTab(value as "overview" | "network")}>
        <Tabs.List>
          <Tabs.Tab value="overview" leftSection={<IconChartPie size={16} />}>
            Distribution
          </Tabs.Tab>
          <Tabs.Tab value="network" leftSection={<IconNetwork size={16} />}>
            Topic Cloud
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="overview">
          <Box style={{ display: 'flex', gap: '20px', justifyContent: 'space-between' }}>
            <Box style={{ flex: 1 }}>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="publication_count"
                    nameKey="concept"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    fill="#8884d8"
                    label={renderCustomLabel}
                    animationBegin={0}
                    animationDuration={800}
                    animationEasing="ease-in-out"
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`pie-${entry.concept}-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Box style={{ flex: 1 }}>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart 
                  data={chartData} 
                  margin={{ top: 20, left: 0, right: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="concept" angle={-10} textAnchor="end" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="publication_count">
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`bar-${entry.concept}-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </Tabs.Panel>
        <Tabs.Panel value="network">
          <StaticWordCloud data={data} />
        </Tabs.Panel>
      </Tabs>
    </Card>
  );
};

export default TopicVisualization;