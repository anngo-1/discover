import { Box, Card, Group, Skeleton,Text, ThemeIcon} from "@mantine/core";


const QuickMetricCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; subtitle?: string; loading?: boolean }> = ({ title, value, icon, subtitle, loading }) => (
  <Card shadow="xs" padding="sm" radius="md" withBorder style={{ backgroundColor: '#fcfcfc' }}>
    <Group gap="xs" align="baseline">
      <ThemeIcon size="md" radius="md" variant="light" color="blue.4">{icon}</ThemeIcon>
      <Box>
        <Text size="sm" fw={500} c="dimmed" mb={2}>{title}</Text>
        {loading ? (
          <Skeleton height={20} width={80} />
        ) : (
          <Group gap={4}>
            <Text fw={600} size="md">{value}</Text>
            {subtitle && <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap' }}>{subtitle}</Text>}
          </Group>
        )}
      </Box>
    </Group>
  </Card>
);
export default QuickMetricCard