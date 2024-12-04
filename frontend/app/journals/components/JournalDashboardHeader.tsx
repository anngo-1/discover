import { FC } from 'react';
import { Paper, Text, Group, Select, SegmentedControl } from '@mantine/core';

interface JournalDashboardHeaderProps {
    viewType: string;
    selectedYear: string | null;
    yearOptions?: { value: string; label: string; }[];
    setViewType: (value: string) => void;
    setSelectedYear: (value: string | null) => void;
}

export const JournalDashboardHeader: FC<JournalDashboardHeaderProps> = ({
    viewType,
    selectedYear,
    yearOptions,
    setViewType,
    setSelectedYear
}) => {
    return (
        <Group justify="space-between" mb="-xs">
            <Text fw={700}>{viewType === 'publishers' ? 'Publisher' : 'Journal'} Statistics</Text>
            <Paper p="xs">
                <Group gap="md" align="flex-end">
                    <Select
                        value={selectedYear}
                        onChange={setSelectedYear}
                        data={yearOptions}
                        w={150}
                    />
                    <SegmentedControl
                        value={viewType}
                        onChange={setViewType}
                        data={[
                            { label: 'Publishers', value: 'publishers' },
                            { label: 'Journals', value: 'journals' }
                        ]}
                        size="sm"
                        radius="xl"
                    />
                </Group>
            </Paper>
        </Group>
    );
};