import { FC } from 'react';
import { SimpleGrid } from '@mantine/core';
import { StatsCard } from './StatsCard';
import { AggregatedStats } from '@/libs/types';

interface JournalDashboardStatsProps {
    viewType: string;
    selectedYear: string | null;
    filteredData: AggregatedStats[];
    aggregateStats: {
        avgCitations: number;
        openAccess: number;
        openAccessRatio: number;
        withData: number;
        withDataRatio: number;
    };
}

export const JournalDashboardStats: FC<JournalDashboardStatsProps> = ({
    viewType,
    selectedYear,
    filteredData,
    aggregateStats
}) => {
    return (
        <SimpleGrid cols={4} spacing="lg">
            <StatsCard
                label={`Total ${viewType === 'publishers' ? 'Publishers' : 'Journals'}`}
                value={filteredData.length.toLocaleString()}
                subValue={`${selectedYear === 'all' ? 'All time' : selectedYear}`}
                color="blue"
                icon={undefined}
            />
            <StatsCard
                label="Average Citations"
                value={aggregateStats.avgCitations.toFixed(2)}
                subValue={`Per publication`}
                color="green"
                icon={undefined}
            />
            <StatsCard
                label="Open Access"
                value={`${aggregateStats.openAccessRatio.toFixed(1)}%`}
                subValue={`${aggregateStats.openAccess.toLocaleString()} publications`}
                color="violet"
                icon={undefined}
            />
            <StatsCard
                label="With Data"
                value={`${aggregateStats.withDataRatio.toFixed(1)}%`}
                subValue={`${aggregateStats.withData.toLocaleString()} publications`}
                color="orange"
                icon={undefined}
            />
        </SimpleGrid>
    );
};