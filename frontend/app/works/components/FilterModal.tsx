import { FC, useState, useEffect, useRef } from 'react';
import {
    Modal, Group, Button, TextInput, Switch, MultiSelect,
    NumberInput, Stack, Text, ActionIcon, Paper, Accordion
} from '@mantine/core';
import { WorksFilterState } from '@/libs/types';
import { DatePickerInput } from '@mantine/dates';
import { Upload, Download, Search } from 'lucide-react';
import { publicationTypes, fieldOptions, organizationOptions } from './FilterConstants';

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
                }
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    return (
        <Modal opened={opened} onClose={onClose} title="Filter Research Output" size="xl" padding="md">
            <Stack gap="md">
                <Paper p="md" withBorder shadow="sm">
                    <Stack gap="sm">
                        <TextInput
                            placeholder="Search within titles and abstracts"
                            value={filters.search_query}
                            onChange={(e) => setFilters(prev => ({ ...prev, search_query: e.target.value }))}
                            rightSection={<ActionIcon variant="subtle" radius="xl"><Search size={16} /></ActionIcon>}
                        />
                        <Group gap="apart">
                            <DatePickerInput placeholder="From date" value={filters.dateRange.from} onChange={handleDateChange('from')} clearable />
                            <Text size="sm" ml={-10} mr={-10}>to</Text>
                            <DatePickerInput placeholder="To date" value={filters.dateRange.to} onChange={handleDateChange('to')} clearable />
                        </Group>
                    </Stack>
                </Paper>

                <Accordion>
                    <Accordion.Item value="basic">
                        <Accordion.Control>Types & Citations</Accordion.Control>
                        <Accordion.Panel>
                            <Stack gap="md">
                                <MultiSelect
                                    label="Include Types"
                                    description="Analyze only these types of research output"
                                    data={publicationTypes}
                                    value={filters.type ?? []}
                                    onChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
                                    placeholder="Select types to include"
                                    clearable searchable
                                />
                                <MultiSelect
                                    label="Exclude Types"
                                    description="Remove these types from analysis"
                                    data={publicationTypes}
                                    value={filters.excludeTypes ?? []}
                                    onChange={(value) => setFilters(prev => ({ ...prev, excludeTypes: value }))}
                                    placeholder="Select types to exclude"
                                    clearable searchable
                                />
                                <Group grow>
                                    <NumberInput 
                                        label="Citation Range"
                                        placeholder="Minimum" 
                                        value={filters.citationCount.min} 
                                        onChange={handleNumberChange('min')} 
                                        min={0}
                                    />
                                    <NumberInput 
                                        label=" "
                                        placeholder="Maximum" 
                                        value={filters.citationCount.max ?? undefined} 
                                        onChange={handleNumberChange('max')} 
                                        min={0}
                                    />
                                </Group>
                                <Stack>
                                    <Switch 
                                        label="Open Access Only" 
                                        checked={filters.openAccess ?? false} 
                                        onChange={(event) => handleSwitchChange('openAccess', event.currentTarget.checked)} 
                                    />
                                    <Switch 
                                        label="Has DOI" 
                                        checked={filters.has_doi ?? false} 
                                        onChange={(event) => handleSwitchChange('has_doi', event.currentTarget.checked)} 
                                    />
                                </Stack>
                            </Stack>
                        </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="topics">
                        <Accordion.Control>Topics & Fields</Accordion.Control>
                        <Accordion.Panel>
                            <Stack gap="md">
                                <MultiSelect
                                    label="Research Topics"
                                    description="Analyze output in these research fields"
                                    data={fieldOptions}
                                    value={filters.fields ?? []}
                                    onChange={(value) => setFilters(prev => ({ ...prev, fields: value }))}
                                    placeholder="Select topics to include"
                                    clearable searchable
                                />
                                <MultiSelect
                                    label="Exclude Topics"
                                    description="Remove these research fields from analysis"
                                    data={fieldOptions}
                                    value={filters.excludeFields ?? []}
                                    onChange={(value) => setFilters(prev => ({ ...prev, excludeFields: value }))}
                                    placeholder="Select topics to exclude"
                                    clearable searchable
                                />
                            </Stack>
                        </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="organizations">
                        <Accordion.Control>Organizations</Accordion.Control>
                        <Accordion.Panel>
                            <Stack gap="md">
                                <MultiSelect
                                    label="Research Organizations"
                                    description="Analyze output from these institutions"
                                    data={organizationOptions}
                                    value={filters.organizations.research ?? []}
                                    onChange={(value) => setFilters(prev => ({ 
                                        ...prev, 
                                        organizations: { 
                                            ...prev.organizations, 
                                            research: value 
                                        } 
                                    }))}
                                    placeholder="Select organizations"
                                    clearable searchable
                                />
                                <MultiSelect
                                    label="Exclude Organizations"
                                    description="Remove output from these institutions"
                                    data={organizationOptions}
                                    value={filters.organizations.excludeResearch ?? []}
                                    onChange={(value) => setFilters(prev => ({ 
                                        ...prev, 
                                        organizations: { 
                                            ...prev.organizations, 
                                            excludeResearch: value 
                                        } 
                                    }))}
                                    placeholder="Select organizations"
                                    clearable searchable
                                />
                                {/* <MultiSelect
                                    label="Funding Organizations"
                                    description="Analyze output funded by these organizations"
                                    data={organizationOptions}
                                    value={filters.organizations.funding ?? []}
                                    onChange={(value) => setFilters(prev => ({ 
                                        ...prev, 
                                        organizations: { 
                                            ...prev.organizations, 
                                            funding: value 
                                        } 
                                    }))}
                                    placeholder="Select funders"
                                    clearable searchable
                                /> */}
                            </Stack>
                        </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="advanced">
                        <Accordion.Control>Advanced</Accordion.Control>
                        <Accordion.Panel>
                            <Stack gap="md">
                                <TextInput
                                    label="Author"
                                    description="Analyze output by specific authors"
                                    placeholder="Enter author name"
                                    value={filters.author}
                                    onChange={(e) => setFilters(prev => ({ ...prev, author: e.target.value }))}
                                />
                            </Stack>
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>

                <Group gap="apart" mt="xl">
                    <Group>
                        <Button variant="subtle" leftSection={<Upload size={16} />} onClick={() => fileInputRef.current?.click()}>
                            Load
                        </Button>
                        <Button variant="subtle" leftSection={<Download size={16} />} onClick={handleExportFilters}>
                            Save
                        </Button>
                        <input type="file" ref={fileInputRef} onChange={handleImportFilters} accept=".json" hidden />
                    </Group>
                    <Group>
                        <Button variant="subtle" onClick={onClose} disabled={isLoading}>Cancel</Button>
                        <Button onClick={handleApply} loading={isLoading}>
                            {isLoading ? 'Analyzing...' : 'Apply'}
                        </Button>
                    </Group>
                </Group>
            </Stack>
        </Modal>
    );
};

export default FilterModal;