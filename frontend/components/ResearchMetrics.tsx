import { Paper, Title, Text, Group } from '@mantine/core';

export function ResearchMetrics() {
  return (
    <Paper p="md" withBorder>
      <Group justify="space-between">
        <div>
          <Title order={4}>Total Papers: 12,000</Title>
          <Text size="sm" c="dimmed">Growth: +20% from January 2023 to May 2024</Text>
        </div>
        <div>
          <Title order={4}>Total Datasets: 12,000</Title>
          <Text size="sm" c="dimmed">Growth: +30% from January 2023 to May 2024</Text>
        </div>
        <div>
          <Title order={4}>Other Documents: 20,000</Title>
          <Text size="sm" c="dimmed">Growth: +20% from January 2023 to May 2024</Text>
        </div>
      </Group>
    </Paper>
  );
}