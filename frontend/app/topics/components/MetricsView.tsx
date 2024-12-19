import React from 'react';
import { Grid } from '@mantine/core';
import { IconChartDots, IconStars, IconBuildingCommunity } from '@tabler/icons-react';
import QuickMetricCard from '@/components/QuickMetricCard';
import { TopicDataPoint } from '@/libs/types';

interface MetricsViewProps {
  filteredAndSearchedData: TopicDataPoint[];
  loading: boolean;
}

const CITATION_THRESHOLD = 20;
const PUBLICATION_THRESHOLD = 50;

const MetricsView: React.FC<MetricsViewProps> = ({ 
  filteredAndSearchedData, 
  loading 
}) => {
  const totalTopics = filteredAndSearchedData.length;
  
  const highImpactTopics = filteredAndSearchedData.filter(
    (item) => (item.avg_citations ?? 0) >= CITATION_THRESHOLD
  ).length;
  
  const commonTopics = filteredAndSearchedData.filter(
    (item) => item.publication_count >= PUBLICATION_THRESHOLD
  ).length;

  return (
    <Grid gutter="xs">
      <Grid.Col span={4}>
        <QuickMetricCard
          title="Total Topics"
          value={totalTopics}
          icon={<IconChartDots size={18} />}
          subtitle="across all areas"
          loading={loading}
        />
      </Grid.Col>
      <Grid.Col span={4}>
        <QuickMetricCard
          title="High-Impact Topics"
          value={highImpactTopics}
          icon={<IconStars size={18} />}
          subtitle={`with ${CITATION_THRESHOLD}+ citations`}
          loading={loading}
        />
      </Grid.Col>
      <Grid.Col span={4}>
        <QuickMetricCard
          title="Common Topics"
          value={commonTopics}
          icon={<IconBuildingCommunity size={18} />}
          subtitle={`with ${PUBLICATION_THRESHOLD}+ publications`}
          loading={loading}
        />
      </Grid.Col>
    </Grid>
  );
};

export default MetricsView;