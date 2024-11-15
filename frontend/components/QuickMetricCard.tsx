import { QuickMetric } from "@/libs/types";
import { Paper, Stack, Text, Title} from "@mantine/core";
import { FC } from "react";

const QuickMetricCard: FC<QuickMetric> = ({ title, value, description }) => (
    <Paper p="md" radius="md" withBorder>
      <Stack gap="xs">
        <Text fw={500} c="dimmed">{title}</Text>
        <Title order={3} fw={700} c="blue">{value}</Title>
        <Text c="dimmed">{description}</Text>
      </Stack>
    </Paper>
  );

export default QuickMetricCard