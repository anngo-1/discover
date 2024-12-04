import { FC } from 'react';
import { SimpleGrid } from '@mantine/core';

import { AggregatedStats } from '@/libs/types';
import { IconFileText, IconUsers, IconBuilding, IconLock } from '@tabler/icons-react'; // Import icons
import QuickMetricCard from '@/components/QuickMetricCard';

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
        <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="md"> 
            <QuickMetricCard
                title={`Total ${viewType === 'publishers' ? 'Publishers' : 'Journals'}`}
                value={filteredData.length.toLocaleString()}
                subtitle={`${selectedYear === 'all' ? 'All time' : selectedYear}`}
                icon={<IconFileText size={16} />} 
            />
            <QuickMetricCard
                title="Average Citations"
                value={aggregateStats.avgCitations.toFixed(2)}
                subtitle={`Per publication`}
                icon={<IconUsers size={16} />} 
            />
            <QuickMetricCard
                title="Open Access"
                value={`${aggregateStats.openAccessRatio.toFixed(1)}%`}
                subtitle={`${aggregateStats.openAccess.toLocaleString()} publications`}
                icon={<IconLock size={16} />} 
            />
            <QuickMetricCard
                title="With Data"
                value={`${aggregateStats.withDataRatio.toFixed(1)}%`}
                subtitle={`${aggregateStats.withData.toLocaleString()} publications`}
                icon={<IconBuilding size={16} />}
            />
        </SimpleGrid>
    );
};