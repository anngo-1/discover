import { FC, useState, useEffect, useRef } from 'react';
import {
    Modal, Group, Button, TextInput, Switch, MultiSelect,
    NumberInput, Stack, Text, ActionIcon, Tooltip, Select,
    Paper, Accordion, Divider
} from '@mantine/core';
import { WorksFilterState } from '@/libs/types';
import { DatePickerInput } from '@mantine/dates';
import { Upload, Download, X, Search } from 'lucide-react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { sortOptions, publicationTypes, fieldOptions, organizationOptions } from './FilterConstants';

type FilterModalProps = {
    opened: boolean;
    onClose: () => void;
    onApply: (filters: WorksFilterState) => void;
    initialFilters: WorksFilterState;
    isLoading: boolean;
};

const FilterModal: FC<FilterModalProps> = ({ opened, onClose, onApply, initialFilters, isLoading }) => {
    const [filters, setFilters] = useState(initialFilters);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (opened) {
            setFilters(initialFilters);
        }
    }, [initialFilters, opened]);

    const handleApply = async () => {
        await onApply(filters);
    };

    const handleDateChange = (field: 'from' | 'to') => (value: Date | null) =>
        setFilters(prev => ({ ...prev, dateRange: { ...prev.dateRange, [field]: value } }));

    const handleNumberChange = (field: 'min' | 'max') => (value: number | string) =>
        setFilters(prev => ({
            ...prev,
            citationCount: {
                ...prev.citationCount,
                [field]: isNaN(+value) ? (field === 'min' ? 0 : null) : +value
            }
        }));

    const handleSwitchChange = (field: keyof WorksFilterState, value: boolean) =>
        setFilters(prev => ({ ...prev, [field]: value }));

    const handleExportFilters = () => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([JSON.stringify(filters, null, 2)], { type: 'application/json' }));
        link.download = 'filters.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImportFilters = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                try {
                    const importedFilters = JSON.parse(e.target.result as string);
                    setFilters(prev => ({
                        ...prev,
                        ...importedFilters,
                        dateRange: {
                            from: importedFilters.dateRange?.from ? new Date(importedFilters.dateRange.from) : null,
                            to: importedFilters.dateRange?.to ? new Date(importedFilters.dateRange.to) : null,
                        }
                    }));
                } catch (error) {
                    console.error('Error importing filters:', error);
                    // Consider adding user-facing error handling here, e.g., an alert
                }
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    const handleSortChange = (sort: string[]) => setFilters(prev => ({ ...prev, sort }));

    const toggleSortDirection = (index: number) =>
        setFilters(prev => {
            const newSort = [...prev.sort || []];
            newSort[index] = newSort[index].includes(':desc')
                ? newSort[index].replace(':desc', '')
                : `${newSort[index]}:desc`;
            return { ...prev, sort: newSort };
        });


    return (
        <Modal opened={opened} onClose={onClose} title="Filter Research Output" size="xl" padding="md">
            <Stack gap="md">
                {/* Search and Date Range */}
                <Paper p="md" withBorder shadow="sm">
                    <Stack gap="sm">
                        <TextInput
                            placeholder="Enter keywords..."
                            value={filters.search_query}
                            onChange={(e) => setFilters(prev => ({ ...prev, search_query: e.target.value }))}
                            rightSection={<ActionIcon variant="subtle" radius="xl"><Search size={16} /></ActionIcon>}
                        />
                        <Group gap="apart">
                            <DatePickerInput placeholder="From" value={filters.dateRange.from} onChange={handleDateChange('from')} clearable />
                            <Text size="sm" ml={-10} mr={-10}>to</Text>
                            <DatePickerInput placeholder="To" value={filters.dateRange.to} onChange={handleDateChange('to')} clearable />
                        </Group>
                    </Stack>
                </Paper>

                <Accordion>
                    {/* Publication Types and Citations */}
                    <Accordion.Item value="basic">
                        <Accordion.Control>Filter by Type & Citations</Accordion.Control>
                        <Accordion.Panel>
                            <Stack gap="md">
                                <MultiSelect
                                    label="Publication Types"
                                    description="Include these publication types in the analysis"
                                    data={publicationTypes}
                                    value={filters.type ?? []}
                                    onChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
                                    placeholder="Select types"
                                    clearable searchable
                                />
                                <MultiSelect
                                    label="Exclude Publication Types"
                                    description="Exclude these publication types from the analysis"
                                    data={publicationTypes}
                                    value={filters.excludeTypes ?? []}
                                    onChange={(value) => setFilters(prev => ({ ...prev, excludeTypes: value }))}
                                    placeholder="Select types to exclude"
                                    clearable searchable
                                />
                                <Group grow>
                                    <NumberInput label="Minimum Citations" placeholder="No minimum" value={filters.citationCount.min} onChange={handleNumberChange('min')} min={0} />
                                    <NumberInput label="Maximum Citations" placeholder="No maximum" value={filters.citationCount.max ?? undefined} onChange={handleNumberChange('max')} min={0} />
                                </Group>
                                <Stack>
                                    <Switch label="Open Access (free-to-read)" checked={filters.openAccess ?? false} onChange={(event) => handleSwitchChange('openAccess', event.currentTarget.checked)} />
                                    <Switch label="Has DOI (Digital Object Identifier)" checked={filters.has_doi ?? false} onChange={(event) => handleSwitchChange('has_doi', event.currentTarget.checked)} />
                                </Stack>
                            </Stack>
                        </Accordion.Panel>
                    </Accordion.Item>

                    {/* Research Topics and Organizations */}
                    <Accordion.Item value="detailed">
                        <Accordion.Control>Filter by Research Topic & Organization</Accordion.Control>
                        <Accordion.Panel>
                            <Stack gap="md">
                                <MultiSelect
                                    label="Research Topics"
                                    description="Include publications related to these research topics"
                                    data={fieldOptions}
                                    value={filters.fields ?? []}
                                    onChange={(value) => setFilters(prev => ({ ...prev, fields: value }))}
                                    placeholder="Select topics"
                                    clearable searchable
                                />
                                <MultiSelect
                                    label="Exclude Topics"
                                    description="Exclude publications related to these research topics"
                                    data={fieldOptions}
                                    value={filters.excludeFields ?? []}
                                    onChange={(value) => setFilters(prev => ({ ...prev, excludeFields: value }))}
                                    placeholder="Select topics to exclude"
                                    clearable searchable
                                />
                                <Divider label="Organizations" labelPosition="center" />
                                <MultiSelect
                                    label="Research Organizations"
                                    description="Include publications from these research organizations"
                                    data={organizationOptions}
                                    value={filters.organizations.research}
                                    onChange={(value) => setFilters(prev => ({ ...prev, organizations: { ...prev.organizations, research: value } }))}
                                    placeholder="Select organizations"
                                    clearable searchable
                                />
                                <MultiSelect
                                    label="Exclude Organizations"
                                    description="Exclude publications from these organizations"
                                    data={organizationOptions}
                                    value={filters.organizations.funding}
                                    onChange={(value) => setFilters(prev => ({ ...prev, organizations: { ...prev.organizations, funding: value } }))}
                                    placeholder="Select organizations to exclude"
                                    clearable searchable
                                />
                            </Stack>
                        </Accordion.Panel>
                    </Accordion.Item>

                    {/* Sort Results */}
                    <Accordion.Item value="sort">
                        <Accordion.Control>Sort Results</Accordion.Control>
                        <Accordion.Panel>
                            <Stack gap="xs">
                                {filters.sort?.map((sort, index) => (
                                    <Paper p="xs" withBorder key={index}>
                                        <Group align="apart">
                                            <Text size="sm">{sortOptions.find(opt => opt.value === sort.replace(':desc', ''))?.label}</Text>
                                            <Group gap={4}>
                                                <Tooltip label={sort.includes(':desc') ? "Highest to lowest" : "Lowest to highest"}>
                                                    <ActionIcon size="sm" variant="subtle" onClick={() => toggleSortDirection(index)}>
                                                        {sort.includes(':desc') ? <FaArrowDown size={14} /> : <FaArrowUp size={14} />}
                                                    </ActionIcon>
                                                </Tooltip>
                                                <ActionIcon size="sm" color="red" variant="subtle" onClick={() => handleSortChange(filters.sort?.filter((_, i) => i !== index) || [])}>
                                                    <X size={14} />
                                                </ActionIcon>
                                            </Group>
                                        </Group>
                                    </Paper>
                                ))}
                                <Select
                                    placeholder="Add another sort criteria..."
                                    data={sortOptions.filter(option => !filters.sort?.some(sort => sort.replace(':desc', '') === option.value))}
                                    value={null}
                                    onChange={(value: string | null) => value && handleSortChange([...filters.sort || [], `${value}:desc`])}
                                    clearable={false}
                                />
                            </Stack>
                        </Accordion.Panel>
                    </Accordion.Item>

          
                    <Accordion.Item value="advanced">
                        <Accordion.Control>Advanced Filters</Accordion.Control>
                        <Accordion.Panel>
                            <Stack gap="md">
                                <TextInput
                                    label="Author Name"
                                    placeholder="Filter by author name"
                                    value={filters.author}
                                    onChange={(e) => setFilters(prev => ({ ...prev, author: e.target.value }))}
                                />
                            </Stack>
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>

          
                <Group gap="apart" mt="xl">
                    <Group>
                        <Tooltip label="Load saved filters">
                            <Button variant="subtle" leftSection={<Upload size={16} />} onClick={() => fileInputRef.current?.click()}>Load</Button>
                        </Tooltip>
                        <Tooltip label="Save current filters">
                            <Button variant="subtle" leftSection={<Download size={16} />} onClick={handleExportFilters}>Save</Button>
                        </Tooltip>
                        <input type="file" ref={fileInputRef} onChange={handleImportFilters} accept=".json" hidden />
                    </Group>
                    <Group>
                        <Button variant="subtle" onClick={onClose} disabled={isLoading}>Cancel</Button>
                        <Button onClick={handleApply} loading={isLoading}>{isLoading ? 'Analyzing...' : 'Apply Filter'}</Button>
                    </Group>
                </Group>
            </Stack>
        </Modal>
    );
};

export default FilterModal;