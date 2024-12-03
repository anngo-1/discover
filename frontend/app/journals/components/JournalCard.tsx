import { FC } from 'react';
import { Paper, Stack, Box, Text, SimpleGrid } from '@mantine/core';
import { AggregatedStats } from '@/libs/types'

interface JournalCardProps {
    item: AggregatedStats;
    viewType: string;
    onSelect?: (item: AggregatedStats) => void;
}

export const JournalCard: FC<JournalCardProps> = ({ item, viewType, onSelect }) => {
    const name = viewType === 'publishers' ? item.publisher_name : item.journal_name;

    return (
        <Paper
            p="md"
            radius="md"
            withBorder
            bg="gray.0"
            onClick={() => onSelect?.(item)}
            style={{
                cursor: onSelect ? 'pointer' : 'default',
                transition: 'all 150ms ease',
            }}
            styles={(theme) => ({
                root: {
                    '&:hover': {
                        backgroundColor: theme.white,
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows.sm,
                    }
                }
            })}
        >
            <Stack gap="sm">
                <Box>
                    <Text size="lg" fw={600} mb={4} style={{ lineHeight: 1.3 }}>{name}</Text>
                    <Text size="xs" c="dimmed">
                        First publication: {item.first_publication} • Last publication: {item.last_publication}
                    </Text>
                </Box>
                <SimpleGrid cols={5}>
                    <Box>
                        <Text size="sm" c="dimmed">Publications</Text>
                        <Text size="lg" fw={600} c="blue">{item.publication_count.toLocaleString()}</Text>
                    </Box>
                    <Box>
                        <Text size="sm" c="dimmed">Avg Citations</Text>
                        <Text size="lg" fw={600} c="green">{item.avg_citations.toFixed(2)}</Text>
                    </Box>
                    <Box>
                        <Text size="sm" c="dimmed">Field Citation Ratio</Text>
                        <Text size="lg" fw={600} c="cyan">{item.avg_field_citation_ratio.toFixed(2)}</Text>
                    </Box>
                    <Box>
                        <Text size="sm" c="dimmed">With Data</Text>
                        <Text size="lg" fw={600} c="grape">{item.papers_with_data.toLocaleString()}</Text>
                    </Box>
                    <Box>
                        <Text size="sm" c="dimmed">Open Access</Text>
                        <Text size="lg" fw={600} c="violet">{item.open_access_count.toLocaleString()}</Text>
                    </Box>
                </SimpleGrid>
            </Stack>
        </Paper>
    );
};