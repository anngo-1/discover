import { FC } from 'react';
import { Paper, Group, Text, Button, Box, Tooltip, ScrollArea, Stack, Pagination, TextInput, Menu, Badge, ActionIcon } from '@mantine/core';
import { IconSortAscending, IconSortDescending, IconSearch, IconRefresh, IconDownload } from '@tabler/icons-react';
import { JournalCard } from './JournalCard';
import { AggregatedStats } from '@/libs/types';

type SortableFields = 'publication_count' | 'avg_citations' | 'papers_with_data' | 'open_access_count' | 'avg_field_citation_ratio';

interface JournalDashboardResultsProps {
    viewType: string;
    filteredData: AggregatedStats[];
    paginatedData: AggregatedStats[];
    sortBy: SortableFields;
    sortDirection: 'asc' | 'desc';
    currentPage: number;
    itemsPerPage: number;
    searchQuery: string;
    onSearchChange: (value: string) => void;
    onSort: (field: SortableFields) => void;
    onPageChange: (page: number) => void;
    onSelect: (item: AggregatedStats) => void;
    onDownloadCSV: () => void;
}

export const JournalDashboardResults: FC<JournalDashboardResultsProps> = ({
    viewType,
    filteredData,
    paginatedData,
    sortBy,
    sortDirection,
    currentPage,
    itemsPerPage,
    searchQuery,
    onSearchChange,
    onSort,
    onPageChange,
    onSelect,
    onDownloadCSV
}) => {
    const sortFields: { key: SortableFields; label: string }[] = [
        { key: 'publication_count', label: 'Publications' },
        { key: 'avg_citations', label: 'Citations' },
        { key: 'papers_with_data', label: 'Data Papers' },
        { key: 'open_access_count', label: 'Open Access' },
        { key: 'avg_field_citation_ratio', label: 'Field Citation Ratio' }
    ];

    return (
        <Paper shadow="sm" radius="md" withBorder>
            <Group p="md" pb="xs" justify="space-between">
                <Group>
                    <TextInput
                        placeholder={`Search ${viewType}...`}
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.currentTarget.value)}
                        leftSection={<IconSearch size={16} />}
                        w={300}
                    />
                    <Menu shadow="md" width={200}>
                    </Menu>
                    <Badge size="lg" radius="sm" variant="dot">
                        {filteredData.length} results
                    </Badge>
                </Group>
                <Group>
                    <Tooltip label="Refresh data">
                        <ActionIcon
                            variant="light"
                            onClick={() => window.location.reload()}
                            size="lg"
                            radius="md"
                        >
                            <IconRefresh size={16} />
                        </ActionIcon>
                    </Tooltip>
                    <Button
                        leftSection={<IconDownload size={16} />}
                        variant="light"
                        onClick={onDownloadCSV}
                        radius="md"
                    >
                        Export CSV
                    </Button>
                </Group>
            </Group>

            <Group p="xs" px="md">
                <Text size="sm" fw={500}>Sort by:</Text>
                {sortFields.map(({ key, label }) => (
                    <Tooltip key={key} label={`Sort by ${label}`}>
                        <Button
                            variant={sortBy === key ? 'light' : 'subtle'}
                            size="xs"
                            onClick={() => onSort(key)}
                            rightSection={sortBy === key && (
                                <Box style={{ marginLeft: 4 }}>
                                    {sortDirection === 'desc' ?
                                        <IconSortDescending size={14} /> :
                                        <IconSortAscending size={14} />
                                    }
                                </Box>
                            )}
                        >
                            {label}
                        </Button>
                    </Tooltip>
                ))}
            </Group>

            <ScrollArea h="calc(100vh - 500px)" scrollbarSize={8} offsetScrollbars>
                <Stack gap="xs" p="md">
                    {paginatedData.map((item, index) => (
                        <JournalCard
                            key={index}
                            item={item}
                            viewType={viewType}
                            onSelect={onSelect}
                        />
                    ))}
                </Stack>
            </ScrollArea>

            <Group justify="space-between" p="md">
                <Text size="sm" c="dimmed">
                    Showing {paginatedData.length} of {filteredData.length} results
                </Text>
                <Pagination
                    total={Math.ceil(filteredData.length / itemsPerPage)}
                    value={currentPage}
                    onChange={onPageChange}
                    size="sm"
                    radius="xl"
                    withEdges
                />
            </Group>
        </Paper>
    );
};