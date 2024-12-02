import { FC } from 'react';
import { Paper, Group, Title, NumberInput, Button, Text, Select } from '@mantine/core';
import { IconChartBar, IconChartPie } from '@tabler/icons-react';
import { ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface DataPoint {
    name: string;
    publications: number;
    citations: number;
}


interface DistributionChartProps {
    data: DataPoint[];
    chartType: 'bar' | 'pie';
    setChartType: (type: 'bar' | 'pie') => void;
    topNValue: number;
    setTopNValue: (value: number) => void;
    topNFilter: string;
    setTopNFilter: (value: string) => void;
    viewType: string;
    COLORS: string[];
}

export const DistributionChart: FC<DistributionChartProps> = ({
    data,
    chartType,
    setChartType,
    topNValue,
    setTopNValue,
    topNFilter,
    setTopNFilter,
    viewType,
    COLORS
}) => (
    <Paper shadow="sm" p="xl" radius="md" withBorder>
        <Group justify="space-between" mb="xl">
            <Group gap="lg">
                <Title order={4}>Distribution</Title>
                <Group gap="xs" align="flex-end">
                    <Group gap={4}>
                        <Text size="sm" fw={500} c="dimmed">Filter top</Text>
                        <NumberInput
                            value={topNValue}
                            onChange={(val) => setTopNValue(val as number)}
                            min={5}
                            max={50}
                            step={5}
                            w={70}
                            size="xs"
                            styles={{ input: { textAlign: 'center' } }}
                        />
                        <Text size="sm" c="dimmed">{viewType === 'publishers' ? 'publishers' : 'journals'} by</Text>
                    </Group>
                    <Select
                        value={topNFilter}
                        onChange={(value: string | null) => {
                            if (value) {
                                setTopNFilter(value);
                            }
                        }}
                        data={[
                            { value: 'publication_count', label: 'Publication Count' },
                            { value: 'avg_citations', label: 'Citation Count' },
                            { value: 'papers_with_data', label: 'Data Papers' },
                            { value: 'open_access_count', label: 'Open Access Papers' },
                            { value: 'avg_field_citation_ratio', label: 'Field Citation Ratio' }
                        ]}
                        size="xs"
                        w={180}
                        clearable={false}  // Add this to prevent null values
                    />

                </Group>
            </Group>
            <Group>
                <Button.Group>
                    <Button
                        variant={chartType === 'bar' ? 'filled' : 'light'}
                        onClick={() => setChartType('bar')}
                        leftSection={<IconChartBar size={16} />}
                        size="sm"
                    >
                        Bar
                    </Button>
                    <Button
                        variant={chartType === 'pie' ? 'filled' : 'light'}
                        onClick={() => setChartType('pie')}
                        leftSection={<IconChartPie size={16} />}
                        size="sm"
                    >
                        Pie
                    </Button>
                </Button.Group>
            </Group>
        </Group>
        {chartType === 'pie' ? (
            <ResponsiveContainer width="100%" height={500}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="publications"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={200}
                        fill="#8884d8"
                        label
                    >
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        ) : (
            <ResponsiveContainer width="100%" height={500}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f5" />
                    <XAxis
                        dataKey="name"
                        angle={-15}
                        textAnchor="end"
                        height={80}
                        interval={0}
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis yAxisId="left" orientation="left" stroke="#228be6" />
                    <YAxis yAxisId="right" orientation="right" stroke="#40c057" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="publications" fill="#228be6" name="Publications" />
                    <Bar yAxisId="right" dataKey="citations" fill="#40c057" name="Avg Citations" />
                </BarChart>
            </ResponsiveContainer>
        )}
    </Paper>
);