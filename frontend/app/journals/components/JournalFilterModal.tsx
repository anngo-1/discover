import { FC, useState, useEffect, useRef } from 'react';
import {
    Modal,
    Group,
    Button,
    TextInput,
    MultiSelect,
    NumberInput,
    Stack,
    Text,
    ActionIcon,
    Tooltip,
    Select,
    Paper,
    Divider,
    Box,
    Checkbox,
    Tabs
} from '@mantine/core';
import { JournalFilterState } from '@/libs/types';
import { DatePickerInput } from '@mantine/dates';
import { Upload, Download, X, Filter, TrendingUp, Building2, FileText, BookOpen } from 'lucide-react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import {
    sortOptions,
    documentTypeOptions,
    publisherOptions,
    citationRanges,
    fieldOptions,
    journalListOptions,
    organizationOptions,
} from './JournalFilterConstants'

interface JournalFilterModalProps {
    opened: boolean;
    onClose: () => void;
    onApply: (filters: JournalFilterState) => void;
    initialFilters: JournalFilterState;
    isLoading: boolean;
}

const JournalFilterModal: FC<JournalFilterModalProps> = ({
    opened,
    onClose,
    onApply,
    initialFilters,
    isLoading,
}) => {
    const [filters, setFilters] = useState<JournalFilterState>(initialFilters);
    const [activeTab, setActiveTab] = useState<string>('general');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (opened) {
            setFilters({ ...initialFilters });
        }
    }, [initialFilters, opened]);

    const handleApply = async () => {
        await onApply(filters);
    };

    const handleDateChange = (field: 'from' | 'to') => (value: Date | null) => {
        setFilters((prev) => ({
            ...prev,
            dateRange: { ...prev.dateRange, [field]: value },
        }));
    };

    const handleCitationMetricsChange = (field: keyof JournalFilterState['citationMetrics']) => (value: number | string) => {
        const numberValue = typeof value === 'string' ? parseFloat(value) : value;
        setFilters(prev => ({
            ...prev,
            citationMetrics: {
                ...prev.citationMetrics,
                [field]: !isNaN(numberValue) ? numberValue : null,
            },
        }));
    };

    const handlePublisherChange = (field: 'publishers' | 'excludePublishers') => (value: string[]) => {
        setFilters(prev => ({
            ...prev,
            publisherFilters: {
                ...prev.publisherFilters,
                [field]: value,
            },
        }));
    };

    const handleDocumentTypeChange = (field: 'include' | 'exclude') => (value: string[]) => {
        setFilters(prev => ({
            ...prev,
            documentTypes: {
                ...prev.documentTypes,
                [field]: value,
            },
        }));
    };

    const handlePreprintChange = (field: keyof JournalFilterState['preprints']) => (value: boolean) => {
        setFilters(prev => ({
            ...prev,
            preprints: {
                ...prev.preprints,
                [field]: value,
            },
        }));
    };

    const handlePublicationFrequencyChange = (field: 'minArticlesPerYear' | 'maxArticlesPerYear') => (value: number | string) => {
        const numberValue = typeof value === 'string' ? parseFloat(value) : value;
        setFilters(prev => ({
            ...prev,
            publicationFrequency: {
                ...prev.publicationFrequency,
                [field]: !isNaN(numberValue) ? numberValue : null,
            }
        }));
    };

    const handleAddSort = (value: string) => {
        setFilters(prev => ({
            ...prev,
            sort: [...(prev.sort || []), `${value}:desc`]
        }));
    };

    const handleRemoveSort = (indexToRemove: number) => {
        setFilters(prev => ({
            ...prev,
            sort: prev.sort?.filter((_, index) => index !== indexToRemove) || []
        }));
    };

    const toggleSortDirection = (index: number) => {
        setFilters(prev => {
            const newSort = [...(prev.sort || [])];
            const currentSort = newSort[index];
            if (currentSort.includes(':desc')) {
                newSort[index] = currentSort.replace(':desc', '');
            } else {
                newSort[index] = `${currentSort}:desc`;
            }
            return { ...prev, sort: newSort };
        });
    };

    const handleExportFilters = () => {
        const filterData = JSON.stringify(filters, null, 2);
        const blob = new Blob([filterData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'journal_filters.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleImportFilters = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedFilters = JSON.parse(e.target?.result as string);
                const validatedFilters = {
                    ...initialFilters,
                    ...importedFilters,
                    dateRange: {
                        from: importedFilters.dateRange?.from ? new Date(importedFilters.dateRange.from) : null,
                        to: importedFilters.dateRange?.to ? new Date(importedFilters.dateRange.to) : null,
                    }
                };
                setFilters(validatedFilters);
            } catch (error) {
                console.error('Error importing filters:', error);
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    const SortItem: FC<{ sort: string; index: number }> = ({ sort, index }) => {
        const isDesc = sort.includes(':desc');
        const baseSort = sort.replace(':desc', '');
        const label = sortOptions.find((opt: { value: string; }) => opt.value === baseSort)?.label || baseSort;

        return (
            <Paper p="xs" radius="sm" withBorder>
                <Group justify="space-between">
                    <Text size="sm">{label}</Text>
                    <Group gap={4}>
                        <Tooltip label={isDesc ? "Sort Descending" : "Sort Ascending"}>
                            <ActionIcon size="sm" variant="subtle" onClick={() => toggleSortDirection(index)}>
                                {isDesc ? <FaArrowDown size={14} /> : <FaArrowUp size={14} />}
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Remove">
                            <ActionIcon size="sm" color="red" variant="subtle" onClick={() => handleRemoveSort(index)}>
                                <X size={14} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </Group>
            </Paper>
        );
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Journal Filter"
            size="xl"
            padding="md"
        >
            <Stack gap="md">
                <Group>
                    <Button
                        variant="light"
                        leftSection={<Upload size={14} />}
                        onClick={handleImportClick}
                    >
                        Import Filter
                    </Button>
                    <Button
                        variant="light"
                        leftSection={<Download size={14} />}
                        onClick={handleExportFilters}
                    >
                        Export Filter
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImportFilters}
                        accept=".json"
                        style={{ display: 'none' }}
                    />
                </Group>

                <Divider />

                <Tabs value={activeTab} onChange={(value) => setActiveTab(value as string)}>
                    <Tabs.List>
                        <Tabs.Tab value="general" leftSection={<Filter size={14} />}>
                            General
                        </Tabs.Tab>
                        <Tabs.Tab value="metrics" leftSection={<TrendingUp size={14} />}>
                            Metrics
                        </Tabs.Tab>
                        <Tabs.Tab value="publishers" leftSection={<Building2 size={14} />}>
                            Publishers
                        </Tabs.Tab>
                        <Tabs.Tab value="content" leftSection={<FileText size={14} />}>
                            Content
                        </Tabs.Tab>
                        <Tabs.Tab value="advanced" leftSection={<BookOpen size={14} />}>
                            Advanced
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="general" pt="xs">
                        <Stack gap="md">
                            <Box>
                                <Text size="sm" fw={500} mb={8}>Date Range</Text>
                                <Group grow>
                                    <DatePickerInput
                                        placeholder="From date"
                                        value={filters.dateRange.from}
                                        onChange={handleDateChange('from')}
                                        clearable
                                        size="sm"
                                    />
                                    <DatePickerInput
                                        placeholder="To date"
                                        value={filters.dateRange.to}
                                        onChange={handleDateChange('to')}
                                        clearable
                                        size="sm"
                                    />
                                </Group>
                            </Box>

                            <TextInput
                                label="Text Search"
                                placeholder="Search titles and abstracts"
                                value={filters.search_query}
                                onChange={(event) => setFilters(prev => ({ ...prev, search_query: event.target.value }))}
                                size="sm"
                            />

                            <MultiSelect
                                label="Subject Areas"
                                data={fieldOptions}
                                value={filters.subjectAreas}
                                onChange={(value) => setFilters(prev => ({ ...prev, subjectAreas: value }))}
                                placeholder="Search and select subject areas"
                                searchable
                                clearable
                                size="sm"
                            />

                            <Box>

                            </Box>
                        </Stack>
                    </Tabs.Panel>

                    <Tabs.Panel value="metrics" pt="xs">
                        <Stack gap="md">
                            <Box>
                                <Text size="sm" fw={500} mb={8}>Citation Metrics</Text>
                                <Stack gap="sm">
                                    <Group grow>
                                        <NumberInput
                                            label="Min Citations"
                                            value={filters.citationMetrics.minCitations ?? ''}
                                            onChange={handleCitationMetricsChange('minCitations')}
                                            min={0}
                                            max={citationRanges.citations.max}
                                            size="sm"
                                        />
                                        <NumberInput
                                            label="Max Citations"
                                            value={filters.citationMetrics.maxCitations ?? ''}
                                            onChange={handleCitationMetricsChange('maxCitations')}
                                            min={0}
                                            max={citationRanges.citations.max}
                                            size="sm"
                                        />
                                    </Group>
                                    <NumberInput
                                        label="Min Field Citation Ratio"
                                        value={filters.citationMetrics.minFieldCitationRatio ?? ''}
                                        onChange={handleCitationMetricsChange('minFieldCitationRatio')}
                                        min={0}
                                        max={citationRanges.fieldCitationRatio.max}
                                        size="sm"
                                    />
                                    <NumberInput
                                        label="Min Relative Citation Ratio"
                                        value={filters.citationMetrics.minRelativeCitationRatio ?? ''}
                                        onChange={handleCitationMetricsChange('minRelativeCitationRatio')}
                                        min={0}
                                        max={citationRanges.relativeCitationRatio.max}
                                        size="sm"
                                    />
                                </Stack>
                            </Box>

                            <Box>
                                <Text size="sm" fw={500} mb={8}>Publication Frequency</Text>
                                <Group grow>
                                    <NumberInput
                                        label="Min Articles per Year"
                                        value={filters.publicationFrequency.minArticlesPerYear ?? ''}
                                        onChange={handlePublicationFrequencyChange('minArticlesPerYear')}
                                        min={0}
                                        size="sm"
                                    />
                                    <NumberInput
                                        label="Max Articles per Year"
                                        value={filters.publicationFrequency.maxArticlesPerYear ?? ''}
                                        onChange={handlePublicationFrequencyChange('maxArticlesPerYear')}
                                        min={0}
                                        size="sm"
                                    />
                                </Group>
                            </Box>

                            <Box>
                                <Text size="sm" fw={500} mb={8}>Sort By</Text>
                                <Stack gap="xs">
                                {filters.sort?.map((sort, index) => (
                                        <SortItem key={index} sort={sort} index={index} />
                                    ))}
                                    <Select
                                        placeholder="Add sort criterion"
                                        data={sortOptions.filter((option: { value: string; }) =>
                                            !filters.sort?.some(sort => sort.replace(':desc', '') === option.value)
                                        )}
                                        value={null}
                                        onChange={(value) => value && handleAddSort(value)}
                                        disabled={filters.sort?.length === sortOptions.length}
                                        clearable={false}
                                        size="sm"
                                    />
                                </Stack>
                            </Box>
                        </Stack>
                    </Tabs.Panel>

                    <Tabs.Panel value="publishers" pt="xs">
                        <Stack gap="md">
                            <Box>
                                <Text size="sm" fw={500} mb={8}>Publisher Selection</Text>
                                <Stack gap="xs">
                                    <MultiSelect
                                        label="Include Publishers"
                                        placeholder="Select publishers to include"
                                        data={publisherOptions}
                                        value={filters.publisherFilters.publishers}
                                        onChange={handlePublisherChange('publishers')}
                                        searchable
                                        clearable
                                        size="sm"
                                    />
                                    <MultiSelect
                                        label="Exclude Publishers"
                                        placeholder="Select publishers to exclude"
                                        data={publisherOptions.filter((pub: { value: string; }) => 
                                            !filters.publisherFilters.publishers.includes(pub.value)
                                        )}
                                        value={filters.publisherFilters.excludePublishers}
                                        onChange={handlePublisherChange('excludePublishers')}
                                        searchable
                                        clearable
                                        size="sm"
                                    />
                                </Stack>
                            </Box>

                            <Box>
                                <Text size="sm" fw={500} mb={8}>Organizations</Text>
                                <Stack gap="xs">
                                    <MultiSelect
                                        label="Research Organizations"
                                        placeholder="Select research organizations"
                                        data={organizationOptions}
                                        value={filters.organizations.research}
                                        onChange={(value) => setFilters(prev => ({
                                            ...prev,
                                            organizations: { ...prev.organizations, research: value }
                                        }))}
                                        searchable
                                        clearable
                                        size="sm"
                                    />
                                    <MultiSelect
                                        label="Funding Organizations"
                                        placeholder="Select funding organizations"
                                        data={organizationOptions}
                                        value={filters.organizations.funding}
                                        onChange={(value) => setFilters(prev => ({
                                            ...prev,
                                            organizations: { ...prev.organizations, funding: value }
                                        }))}
                                        searchable
                                        clearable
                                        size="sm"
                                    />
                                </Stack>
                            </Box>
                        </Stack>
                    </Tabs.Panel>

                    <Tabs.Panel value="content" pt="xs">
                        <Stack gap="md">
                            <Box>
                                <Text size="sm" fw={500} mb={8}>Document Types</Text>
                                <Stack gap="xs">
                                    <MultiSelect
                                        label="Include Document Types"
                                        placeholder="Select document types to include"
                                        data={documentTypeOptions}
                                        value={filters.documentTypes.include}
                                        onChange={handleDocumentTypeChange('include')}
                                        searchable
                                        clearable
                                        size="sm"
                                    />
                                    <MultiSelect
                                        label="Exclude Document Types"
                                        placeholder="Select document types to exclude"
                                        data={documentTypeOptions.filter((type: { value: string; }) => 
                                            !filters.documentTypes.include.includes(type.value)
                                        )}
                                        value={filters.documentTypes.exclude}
                                        onChange={handleDocumentTypeChange('exclude')}
                                        searchable
                                        clearable
                                        size="sm"
                                    />
                                </Stack>
                            </Box>

                            <Box>
                                <Text size="sm" fw={500} mb={8}>Preprint Settings</Text>
                                <Stack gap="xs">
                                    <Checkbox
                                        label="Include Preprints"
                                        checked={filters.preprints.include}
                                        onChange={(event) => handlePreprintChange('include')(event.currentTarget.checked)}
                                        size="sm"
                                    />
                                    <Checkbox
                                        label="Exclude Preprints"
                                        checked={filters.preprints.exclude}
                                        onChange={(event) => handlePreprintChange('exclude')(event.currentTarget.checked)}
                                        size="sm"
                                    />
                                    <Checkbox
                                        label="Only Preprints"
                                        checked={filters.preprints.only}
                                        onChange={(event) => handlePreprintChange('only')(event.currentTarget.checked)}
                                        size="sm"
                                    />
                                </Stack>
                            </Box>
                        </Stack>
                    </Tabs.Panel>

                    <Tabs.Panel value="advanced" pt="xs">
                        <Stack gap="md">
                            <MultiSelect
                                label="Journal Lists"
                                data={journalListOptions}
                                value={filters.journalLists}
                                onChange={(value) => setFilters(prev => ({ ...prev, journalLists: value }))}
                                placeholder="Select journal lists"
                                searchable
                                clearable
                                size="sm"
                            />
                        </Stack>
                    </Tabs.Panel>
                </Tabs>

                <Group justify="flex-end" mt="md">
                    <Button variant="subtle" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleApply} loading={isLoading}>
                        {isLoading ? 'Applying...' : 'Apply Filters'}
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
};

export default JournalFilterModal;