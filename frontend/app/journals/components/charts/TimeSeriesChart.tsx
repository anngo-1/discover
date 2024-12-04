import { FC } from 'react';
import { Paper, Group, Title, NumberInput, Text, Select, Stack } from '@mantine/core';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';

type MetricKey = 'publications' | 'citations' | 'withData' | 'openAccess' | 'fieldCitationRatio';

interface TimeSeriesData {
    year: number;
    name: string;
    publications: number;
    citations: number;
    withData: number;
    openAccess: number;
    fieldCitationRatio: number;
    [key: string]: string | number;
}

interface MetricConfig {
    label: string;
    color: string;
    formatter: (value: number) => string;
}

type MetricConfigs = Record<MetricKey, MetricConfig>;


interface TooltipPayloadItem {
    dataKey: string;
    name: string;
    value: number;
    stroke: string;
}

const METRIC_CONFIGS: MetricConfigs = {
    publications: {
        label: 'Publications',
        color: '#228be6',
        formatter: (value) => value.toLocaleString()
    },
    citations: {
        label: 'Average Citations',
        color: '#40c057',
        formatter: (value) => value.toFixed(2)
    },
    withData: {
        label: 'Data Papers',
        color: '#fab005',
        formatter: (value) => value.toLocaleString()
    },
    openAccess: {
        label: 'Open Access Papers',
        color: '#fd7e14',
        formatter: (value) => value.toLocaleString()
    },
    fieldCitationRatio: {
        label: 'Field Citation Ratio',
        color: '#e64980',
        formatter: (value) => value.toFixed(2)
    }
};

interface ChartDataPoint {
    year: number;
    [key: string]: number | string;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: TooltipPayloadItem[];
    label?: string | number;
}

const CustomTooltip: FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (!active || !payload) return null;
    const year = label;
    
    return (
        <Paper p="sm" shadow="md" radius="md" bg="white" style={{ minWidth: '180px' }}>
            <Stack gap="xs">
                <Text fw={600} c="dimmed">Year {year}</Text>
                {payload.map((entry) => {
                    const [name, metric] = entry.dataKey.split('_');
                    const config = METRIC_CONFIGS[metric as MetricKey];
                    
                    return (
                        <Group key={entry.dataKey} justify="space-between" wrap="nowrap">
                            <Group gap="xs" wrap="nowrap">
                                <div style={{ 
                                    width: 8, 
                                    height: 8, 
                                    borderRadius: '50%', 
                                    backgroundColor: entry.stroke
                                }} />
                                <Text size="sm">{name}</Text>
                            </Group>
                            <Text size="sm" fw={500}>
                                {entry.value !== undefined ? config.formatter(Number(entry.value)) : 'N/A'}
                            </Text>
                        </Group>
                    );
                })}
            </Stack>
        </Paper>
    );
};

interface TimeSeriesChartProps {
    data: TimeSeriesData[];
    topNValue: number;
    setTopNValue: (value: number) => void;
    timeSeriesMetric: MetricKey;
    setTimeSeriesMetric: (value: MetricKey) => void;
    viewType: string;
    COLORS: string[];
}

export const TimeSeriesChart: FC<TimeSeriesChartProps> = ({
    data,
    topNValue,
    setTopNValue,
    timeSeriesMetric,
    setTimeSeriesMetric,
    viewType,
    COLORS
}) => {
    const sortedYears = Array.from(new Set(data.map(d => d.year))).sort((a, b) => a - b);
    const currentMetric = METRIC_CONFIGS[timeSeriesMetric];

    const entities = Array.from(new Set(data.map(d => d.name)));
    const latestYear = Math.max(...sortedYears);
    const sortedEntities = entities
        .map(name => {
            const latestData = data.find(d => d.name === name && d.year === latestYear);
            return {
                name,
                value: latestData ? (latestData[timeSeriesMetric] as number) : 0
            };
        })
        .sort((a, b) => b.value - a.value)
        .slice(0, topNValue)
        .map(entity => entity.name);

    const dataMap = new Map<number, Map<string, TimeSeriesData>>();
    data.forEach(d => {
        if (!dataMap.has(d.year)) {
            dataMap.set(d.year, new Map());
        }
        dataMap.get(d.year)?.set(d.name, d);
    });

    const chartData: ChartDataPoint[] = sortedYears.map(year => {
        const yearData: ChartDataPoint = { year };
        sortedEntities.forEach(name => {
            const entityData = dataMap.get(year)?.get(name);
            if (entityData) {
                Object.keys(METRIC_CONFIGS).forEach(metric => {
                    yearData[`${name}_${metric}`] = entityData[metric as MetricKey] as number;
                });
            }
        });
        return yearData;
    });

    return (
        <Paper shadow="sm" p="md" radius="md" withBorder>
            <Stack gap="md">
                <Group justify="space-between" align="flex-end">
                    <Title order={4} mb={0}>Historical Trends</Title>
                    <Group gap="md">
                        <Group gap="xs">
                            <Text size="sm" fw={500} c="dimmed">Show</Text>
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
                            <Text size="sm" c="dimmed">{viewType} by</Text>
                        </Group>
                        <Select
                            value={timeSeriesMetric}
                            onChange={(value) => {
                                if (value) {
                                    setTimeSeriesMetric(value as MetricKey);
                                }
                            }}
                            data={Object.entries(METRIC_CONFIGS).map(([value, config]) => ({
                                value,
                                label: config.label
                            }))}
                            size="xs"
                            w={180}
                            clearable={false}
                            defaultValue="publications"
                        />
                    </Group>
                </Group>

                <div style={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
                            data={chartData}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f5" />
                            <XAxis
                                dataKey="year"
                                type="number"
                                domain={['dataMin', 'dataMax']}
                                tickCount={sortedYears.length}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                tickFormatter={currentMetric?.formatter || ((v) => v.toString())}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            {sortedEntities.map((name, index) => (
                                <Line
                                    key={name}
                                    type="monotone"
                                    dataKey={`${name}_${timeSeriesMetric}`}
                                    name={name}
                                    stroke={COLORS[index % COLORS.length]}
                                    strokeWidth={2}
                                    dot={{ r: 3 }}
                                    connectNulls
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Stack>
        </Paper>
    );
};

export default TimeSeriesChart;