import { FC, useState, useEffect, useRef } from 'react';
import {
    Modal,
    Group,
    Button,
    TextInput,
    Switch,
    MultiSelect,
    NumberInput,
    Stack,
    Text,
    ActionIcon,
    Tooltip,
    Select,
} from '@mantine/core';
import { FilterState } from '@/libs/types';
import { DatePickerInput, DateValue } from '@mantine/dates';
import { Upload, Download, X } from 'lucide-react';

import { FaArrowDown, FaArrowUp } from 'react-icons/fa'
type FilterModalProps = {
    opened: boolean;
    onClose: () => void;
    onApply: (filters: FilterState) => Promise<void>;
    initialFilters: FilterState;
    isLoading: boolean;
};

const FilterModal: FC<FilterModalProps> = ({
    opened,
    onClose,
    onApply,
    initialFilters,
    isLoading,
}) => {
    const [filters, setFilters] = useState<FilterState>({ ...initialFilters });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const sortOptions = [
        { value: 'display_name', label: 'Name' },
        { value: 'cited_by_count', label: 'Citation Count' },
        // { value: 'works_count', label: 'Works Count' },
        { value: 'publication_date', label: 'Publication Date' }
    ];

    const publicationTypes = [
        { value: 'article', label: 'Article' },
        { value: 'book-chapter', label: 'Book Chapter' },
        { value: 'dataset', label: 'Dataset' },
        { value: 'preprint', label: 'Preprint' },
        { value: 'dissertation', label: 'Dissertation' },
        { value: 'book', label: 'Book' },
        { value: 'review', label: 'Review Article' },
        { value: 'paratext', label: 'Paratext' },
        { value: 'libguides', label: 'Library Guides' },
        { value: 'letter', label: 'Letter' },
        { value: 'other', label: 'Other' },
        { value: 'reference-entry', label: 'Reference Entry' },
        { value: 'report', label: 'Report' },
        { value: 'editorial', label: 'Editorial' },
        { value: 'peer-review', label: 'Peer Review' },
        { value: 'standard', label: 'Standard' },
        { value: 'erratum', label: 'Erratum' },
        { value: 'grant', label: 'Grant' },
        { value: 'supplementary-materials', label: 'Supplementary Materials' },
        { value: 'retraction', label: 'Retraction' }
    ];

    const fieldNames = [
        'Agricultural and Biological Sciences',
        'Arts and Humanities',
        'Biochemistry, Genetics and Molecular Biology',
        'Business, Management and Accounting',
        'Chemical Engineering',
        'Chemistry',
        'Computer Science',
        'Decision Sciences',
        'Earth and Planetary Sciences',
        'Economics, Econometrics and Finance',
        'Energy',
        'Engineering',
        'Environmental Science',
        'Immunology and Microbiology',
        'Materials Science',
        'Mathematics',
        'Medicine',
        'Neuroscience',
        'Nursing',
        'Pharmacology, Toxicology and Pharmaceutics',
        'Physics and Astronomy',
        'Psychology',
        'Social Sciences',
        'Veterinary',
        'Dentistry',
        'Health Professions'
    ];

    const fieldOptions = fieldNames.map((fieldName) => ({
        value: fieldName,
        label: fieldName,
    }));

    useEffect(() => {
        if (opened) {
            setFilters({ ...initialFilters });
        }
    }, [initialFilters, opened]);

    const handleApply = async () => {
        await onApply(filters);
    };

    const handleDateChange = (field: 'from' | 'to') => (value: DateValue) => {
        setFilters(prev => ({
            ...prev,
            dateRange: { ...prev.dateRange, [field]: value }
        }));
    };

    const handleNumberChange = (field: 'min' | 'max') => (value: number | string) => {
        const numberValue = typeof value === 'string' ? parseFloat(value) : value;
        setFilters(prev => ({
            ...prev,
            citationCount: {
                ...prev.citationCount,
                [field]: !isNaN(numberValue) ? numberValue : field === 'min' ? 0 : null
            }
        }));
    };

    const handleSwitchChange = (field: keyof FilterState) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, [field]: event.target.checked }));
    };

    const handleExportFilters = () => {
        const filterData = JSON.stringify(filters, null, 2);
        const blob = new Blob([filterData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'filters.json';
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
                // Validate imported filters structure
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
    const SortItem = ({ sort, index }: { sort: string, index: number }) => {
        const isDesc = sort.includes(':desc');
        const baseSort = sort.replace(':desc', '');
        const label = sortOptions.find(opt => opt.value === baseSort)?.label || baseSort;

        return (
            <Group gap="xs" className="bg-gray-100 rounded p-2">
                <Text size="sm">{label}</Text>
                <Tooltip label={isDesc ? "Sort Descending" : "Sort Ascending"}>
                    <ActionIcon size="sm" onClick={() => toggleSortDirection(index)}>
                        {isDesc ? (
                            <FaArrowDown size={14} />
                        ) : (
                            <FaArrowUp size={14} />
                        )}
                    </ActionIcon>
                </Tooltip>
                <Tooltip label="Remove">
                    <ActionIcon size="sm" color="red" onClick={() => handleRemoveSort(index)}>
                        <X size={14} />
                    </ActionIcon>
                </Tooltip>
            </Group>
        );
    };

    return (
        <Modal opened={opened} onClose={onClose} title="Works Filter" size="lg">
            <Stack gap="md">
                <Group align="center">
                    <Tooltip label="Import Filter">
                        <Button variant="light" leftSection={<Upload size={14} />} onClick={handleImportClick}>
                            Import Filter
                        </Button>
                    </Tooltip>

                    <Tooltip label="Export Filter">
                        <Button variant="light" leftSection={<Download size={14} />} onClick={handleExportFilters}>
                            Export Filter
                        </Button>
                    </Tooltip>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImportFilters}
                        accept=".json"
                        style={{ display: 'none' }}
                    />
                </Group>

                <div>
                    <Text size="sm" mb={4}>Date Range</Text>
                    <Group grow>
                        <DatePickerInput
                            placeholder="From date"
                            value={filters.dateRange.from}
                            onChange={handleDateChange('from')}
                            clearable
                        />
                        <DatePickerInput
                            placeholder="To date"
                            value={filters.dateRange.to}
                            onChange={handleDateChange('to')}
                            clearable
                        />
                    </Group>
                </div>

                <TextInput
                    label="Text Search"
                    placeholder="Search titles and abstracts"
                    value={filters.search_query}
                    onChange={(event) => setFilters(prev => ({ ...prev, search_query: event.target.value }))}
                />

                <div>
                    <Text size="sm" fw={500} mb={4}>Sort By</Text>
                    <Stack gap="xs">
                        {filters.sort?.map((sort, index) => (
                            <SortItem key={index} sort={sort} index={index} />
                        ))}
                        <Select
                            placeholder="Add sort criterion"
                            data={sortOptions.filter(option =>
                                !filters.sort?.some(sort => sort.replace(':desc', '') === option.value)
                            )}
                            value={null}
                            onChange={(value: string | null) => value && handleAddSort(value)}
                            disabled={filters.sort?.length === sortOptions.length}
                            clearable={false}
                        />
                    </Stack>
                </div>

                <MultiSelect
                    label="Types of Work to Include"
                    data={publicationTypes}
                    value={filters.type ?? []}
                    onChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
                    placeholder="Select publication types"
                    clearable
                    searchable
                />

                <MultiSelect
                    label="Fields to Include"
                    data={fieldOptions}
                    value={filters.fields ?? []}
                    onChange={(value) => setFilters(prev => ({ ...prev, fields: value }))}
                    placeholder="Search and select fields"
                    clearable
                    searchable
                    maxDropdownHeight={200}
                    limit={20}
                    withScrollArea={true}
                />

                <MultiSelect
                    label="Fields to Exclude"
                    data={fieldOptions}
                    value={filters.excludeFields ?? []}
                    onChange={(value) => setFilters(prev => ({ ...prev, excludeFields: value }))}
                    placeholder="Search and select fields to exclude"
                    clearable
                    searchable
                    maxDropdownHeight={200}
                    limit={20}
                    withScrollArea={true}
                />

                <div>
                    <Text size="sm" fw={500} mb={4}>Citation Count Range</Text>
                    <Group grow>
                        <NumberInput
                            placeholder="Min citations"
                            value={filters.citationCount.min}
                            onChange={handleNumberChange('min')}
                            min={0}
                        />
                        <NumberInput
                            placeholder="Max citations"
                            value={filters.citationCount.max ?? undefined}
                            onChange={handleNumberChange('max')}
                            min={0}
                        />
                    </Group>
                </div>

                <Switch
                    label="Open Access Only"
                    checked={filters.openAccess ?? false}
                    onChange={handleSwitchChange('openAccess')}
                />

                <Switch
                    label="DOI Exists"
                    checked={filters.has_doi ?? false}
                    onChange={handleSwitchChange('has_doi')}
                />

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

export default FilterModal;