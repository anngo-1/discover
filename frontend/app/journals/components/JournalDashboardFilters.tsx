import { FC } from 'react';
import { Group, TextInput, Menu, Button, Badge, Tooltip, ActionIcon } from '@mantine/core';
import { IconSearch, IconFilter, IconChevronDown, IconRefresh, IconDownload } from '@tabler/icons-react';

interface JournalDashboardFiltersProps {
    viewType: string;
    searchQuery: string;
    filteredCount: number;
    onSearchChange: (value: string) => void;
    onDownloadCSV: () => void;
}

export const JournalDashboardFilters: FC<JournalDashboardFiltersProps> = ({
    viewType,
    searchQuery,
    filteredCount,
    onSearchChange,
    onDownloadCSV
}) => {
    return (
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
                    <Menu.Target>
                        <Button
                            variant="light"
                            leftSection={<IconFilter size={16} />}
                            rightSection={<IconChevronDown size={16} />}
                        >
                            Filters
                        </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Label>Filter by</Menu.Label>
                        <Menu.Item>Has Open Access</Menu.Item>
                        <Menu.Item>Has Data</Menu.Item>
                        <Menu.Item>Above Average Citations</Menu.Item>
                    </Menu.Dropdown>
                </Menu>
                <Badge size="lg" radius="sm" variant="dot">
                    {filteredCount} results
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
    );
};