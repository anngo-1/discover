import { FC } from 'react';
import { Paper, Group, Title, NumberInput, Text, Select, Stack, SegmentedControl } from '@mantine/core';
import { ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import React from 'react';

interface DataPoint {
    name: string;
    publications: number;
    citations: number;
    openAccess: number;
    withData: number;
    fieldCitationRatio: number;
    [key: string]: string | number;
}

type MetricKey = 'publications' | 'citations' | 'openAccess' | 'withData' | 'fieldCitationRatio';
type SortDirection = 'desc' | 'asc';
type ChartType = 'bar' | 'pie';

interface MetricConfig {
    label: string;
    color: string;
    formatter: (value: number) => string;
}

type MetricConfigs = Record<MetricKey, MetricConfig>;

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

const CHART_COLORS = [
    '#228be6', '#40c057', '#fab005', '#fd7e14', '#e64980',
    '#7950f2', '#15aabf', '#82c91e', '#be4bdb', '#4c6ef5'
];

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ value: number; dataKey: MetricKey; name?: string; payload: DataPoint }>;
    label?: string;
}

const CustomTooltip: FC<CustomTooltipProps> = ({ active, payload }) => {
    if (!active || !payload || !payload[0]) return null;
    
    const dataPoint = payload[0].payload;
    const selectedMetricKey = payload[0].dataKey as MetricKey;
    const selectedConfig = METRIC_CONFIGS[selectedMetricKey];
    
    return (
        <Paper p="sm" shadow="md" radius="md" bg="white" style={{ minWidth: '180px' }}>
            <Stack gap="xs">
                <Text fw={600} c="dimmed">{dataPoint.name}</Text>
                
                <Group justify="space-between" wrap="nowrap">
                    <Group gap="xs" wrap="nowrap">
                        <div style={{ 
                            width: 8, 
                            height: 8, 
                            borderRadius: '50%', 
                            backgroundColor: selectedConfig.color 
                        }} />
                        <Text size="sm">{selectedConfig.label}</Text>
                    </Group>
                    <Text size="sm" fw={500}>
                        {selectedConfig.formatter(Number(dataPoint[selectedMetricKey]))}
                    </Text>
                </Group>

                {Object.entries(METRIC_CONFIGS)
                    .filter(([key]) => key !== selectedMetricKey)
                    .map(([key, config]) => (
                        <Group key={key} justify="space-between" wrap="nowrap">
                            <Group gap="xs" wrap="nowrap">
                                <div style={{ 
                                    width: 8, 
                                    height: 8, 
                                    borderRadius: '50%', 
                                    backgroundColor: config.color 
                                }} />
                                <Text size="sm">{config.label}</Text>
                            </Group>
                            <Text size="sm" fw={500}>
                                {config.formatter(Number(dataPoint[key]))}
                            </Text>
                        </Group>
                    ))}
            </Stack>
        </Paper>
    );
};

interface DistributionChartProps {
    data: DataPoint[];
    chartType: ChartType;
    setChartType: (type: ChartType) => void;
    topNValue: number;
    setTopNValue: (value: number) => void;
    topNFilter: string;
    setTopNFilter: (value: string) => void;
    viewType: string;
    COLORS: string[];
}

const DistributionChart: FC<DistributionChartProps> = ({
    data,
    chartType,
    setChartType,
    topNValue,
    setTopNValue,
    topNFilter,
    setTopNFilter,
    viewType,
}) => {
    const [sortDirection, setSortDirection] = React.useState<SortDirection>('desc');
    
    React.useEffect(() => {
        if (!topNFilter) {
            setTopNFilter('publications');
        }
    }, []);

    const currentMetric = METRIC_CONFIGS[topNFilter as MetricKey] || METRIC_CONFIGS.publications;

    const handleSortDirectionChange = (value: string | null) => {
        if (value) {
            setSortDirection(value as SortDirection);
        }
    };

    const handleMetricChange = (value: string | null) => {
        if (value) {
            setTopNFilter(value);
        }
    };

    const processedData = React.useMemo(() => {
        const filterToUse = topNFilter || 'publications';
        return [...data]
            .sort((a, b) => {
                const aValue = Number(a[filterToUse]);
                const bValue = Number(b[filterToUse]);
                return sortDirection === 'desc' ? bValue - aValue : aValue - bValue;
            })
            .slice(0, topNValue);
    }, [data, topNFilter, topNValue, sortDirection]);

    return (
        <Paper shadow="sm" p="md" radius="md" withBorder>
            <Stack gap="md">
                <Group justify="space-between" align="flex-end">
                    <Group gap="lg">
                        <Title order={4} mb={0}>Distribution</Title>
                        <SegmentedControl
                            value={chartType}
                            onChange={(value) => setChartType(value as ChartType)}
                            data={[
                                { label: 'Bar Chart', value: 'bar' },
                                { label: 'Pie Chart', value: 'pie' }
                            ]}
                            size="xs"
                        />
                    </Group>
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
                            <Select
                                value={sortDirection}
                                onChange={handleSortDirectionChange}
                                data={[
                                    { value: 'desc', label: 'Top' },
                                    { value: 'asc', label: 'Bottom' }
                                ]}
                                size="xs"
                                w={100}
                            />
                            <Text size="sm" c="dimmed">{viewType} by</Text>
                        </Group>
                        <Select
                            value={topNFilter || 'publications'}
                            onChange={handleMetricChange}
                            data={Object.entries(METRIC_CONFIGS).map(([value, config]) => ({
                                value,
                                label: config.label
                            }))}
                            size="xs"
                            w={180}
                            clearable={false}
                        />
                    </Group>
                </Group>

                <div style={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'bar' ? (
                            <BarChart 
                                data={processedData}
                                margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f5" />
                                <XAxis
                                    dataKey="name"
                                    angle={-45}
                                    textAnchor="end"
                                    height={100}
                                    interval={0}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={currentMetric?.formatter || ((v) => v.toString())}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar
                                    dataKey={topNFilter || 'publications'}
                                    fill={currentMetric?.color || '#228be6'}
                                    name={currentMetric?.label || 'Value'}
                                />
                            </BarChart>
                        ) : (
                            <PieChart>
                                <Pie
                                    data={processedData}
                                    dataKey={topNFilter || 'publications'}
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={160}
                                    label={({name, value}) => `${name}: ${currentMetric?.formatter?.(Number(value)) || value}`}
                                    labelLine={true}
                                >
                                    {processedData.map((_, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                            </PieChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </Stack>
        </Paper>
    );
};

export default DistributionChart;