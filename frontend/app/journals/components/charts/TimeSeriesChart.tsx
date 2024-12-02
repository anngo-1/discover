import { FC } from 'react';
import { Paper, Group, Title, NumberInput, SegmentedControl, Text, Select } from '@mantine/core';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { TimeSeriesData } from '@/libs/types';

interface TimeSeriesChartProps {
    data: TimeSeriesData[];
    topNValue: number;
    setTopNValue: (value: number) => void;
    topNFilter: string;
    setTopNFilter: (value: string) => void;
    timeSeriesMetric: 'publications' | 'citations' | 'openAccess';
    setTimeSeriesMetric: (value: 'publications' | 'citations' | 'openAccess') => void;
    viewType: string;
    COLORS: string[];
}

export const TimeSeriesChart: FC<TimeSeriesChartProps> = ({
    data,
    topNValue,
    setTopNValue,
    topNFilter,
    setTopNFilter,
    timeSeriesMetric,
    setTimeSeriesMetric,
    viewType,
    COLORS
}) => {
    const sortedYears = Array.from(new Set(data.map(d => d.year))).sort((a, b) => a - b);
    
    // Get unique entities and sort them by their latest year value
    const entities = Array.from(new Set(data.map(d => d.name)));
    const latestYear = Math.max(...sortedYears);
    const sortedEntities = entities
        .map(name => {
            const latestData = data.find(d => d.name === name && d.year === latestYear);
            return { name, value: latestData ? latestData[timeSeriesMetric] : 0 };
        })
        .sort((a, b) => b.value - a.value)
        .slice(0, topNValue)
        .map(entity => entity.name);

    // Create a map of data points for faster lookup
    const dataMap = new Map();
    data.forEach(d => {
        if (!dataMap.has(d.year)) {
            dataMap.set(d.year, new Map());
        }
        dataMap.get(d.year).set(d.name, d[timeSeriesMetric]);
    });

    return (
        <Paper shadow="sm" p="xl" radius="md" withBorder>
            <Group justify="space-between" mb="xl">
                <Group gap="lg">
                    <Title order={4}>Historical Trends</Title>
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
                            clearable={false}
                        />
                    </Group>
                </Group>
                <Group gap="sm">
                    <Text size="sm" fw={500} c="dimmed">Metric:</Text>
                    <SegmentedControl
                        value={timeSeriesMetric}
                        onChange={(value) => setTimeSeriesMetric(value as 'publications' | 'citations' | 'openAccess')}
                        data={[
                            { label: 'Publications', value: 'publications' },
                            { label: 'Citations', value: 'citations' },
                            { label: 'Open Access', value: 'openAccess' }
                        ]}
                        size="xs"
                        styles={(theme) => ({
                            root: {
                                backgroundColor: theme.colors.gray[0],
                            },
                            control: {
                                border: `1px solid ${theme.colors.gray[3]}`,
                            },
                            label: {
                                padding: '6px 12px',
                            }
                        })}
                    />
                </Group>
            </Group>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart 
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    data={sortedYears.map(year => ({
                        year,
                        ...Object.fromEntries(
                            sortedEntities.map(name => [
                                name,
                                dataMap.get(year)?.get(name) ?? null
                            ])
                        )
                    }))}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f5" />
                    <XAxis
                        dataKey="year"
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        tickCount={sortedYears.length}
                    />
                    <YAxis />
                    <Tooltip 
                        wrapperStyle={{ outline: 'none' }}
                    />
                    <Legend />
                    {sortedEntities.map((name, index) => (
                        <Line
                            key={name}
                            type="monotone"
                            dataKey={name}
                            name={name}
                            stroke={COLORS[index % COLORS.length]}
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            connectNulls
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </Paper>
    );
};

export default TimeSeriesChart;