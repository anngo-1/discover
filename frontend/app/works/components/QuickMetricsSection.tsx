import { WorksMetricsState } from "@/libs/types";
import { Center, Group, Loader } from "@mantine/core";
import { FC } from "react";
import QuickMetricCard from "../../../components/QuickMetricCard";

const QuickMetricsSection: FC<{ metrics: WorksMetricsState['quickMetrics']; loading: boolean; }> = ({ metrics, loading }) => (
    <Group grow gap="md">
      {loading ? (
        <Center h={100}><Loader size="sm" /></Center>
      ) : (
        <>
          <QuickMetricCard
            title="Total Results"
            value={metrics.totalPapers.toLocaleString()}
            description="Total number of results found"
          />
          <QuickMetricCard
            title="Total Citations"
            value={metrics.totalCitations.toLocaleString()}
            description="Total citations from all results"
          />
          <QuickMetricCard
            title="Average Citations"
            value={metrics.averageCitations.toFixed(1)}
            description="Average citations per work"
          />
        </>
      )}
    </Group>
  );


  export default QuickMetricsSection