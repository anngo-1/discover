import { FC } from 'react';
import { Card, Group, Box, Stack, Text, Center, RingProgress } from '@mantine/core';

interface StatsCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    subValue?: string;
    color: string;
    trend?: number;
}

export const StatsCard: FC<StatsCardProps> = ({ icon, label, value, subValue, color, trend }) => (
    <Card shadow="sm" p="lg" radius="md" withBorder>
        <Group gap="sm">
            <Box p="md" style={{ backgroundColor: `var(--mantine-color-${color}-0)`, borderRadius: '50%' }}>
                {icon}
            </Box>
            <Stack gap={0}>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">{label}</Text>
                <Text size="xl" fw={700}>{value}</Text>
                {subValue && <Text size="xs" c="dimmed">{subValue}</Text>}
            </Stack>
            {trend !== undefined && (
                <Box ml="auto">
                    <RingProgress
                        size={80}
                        thickness={8}
                        sections={[{ value: Math.abs(trend), color: trend >= 0 ? 'teal' : 'red' }]}
                        label={
                            <Center>
                                <Text size="xs" fw={700} c={trend >= 0 ? 'teal' : 'red'}>
                                    {trend >= 0 ? '+' : ''}{trend}%
                                </Text>
                            </Center>
                        }
                    />
                </Box>
            )}
        </Group>
    </Card>
);