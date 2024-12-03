import { FC, useState, useEffect, useRef } from 'react';
import {
  Modal, Group, Button, TextInput, MultiSelect, NumberInput,
  Stack, Text, Paper, Accordion, Checkbox
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { Upload, Download, Search } from 'lucide-react';
import {
  documentTypeOptions, publisherOptions,
  journalListOptions, organizationOptions,
  fieldOptions,
} from './JournalFilterConstants';
import { JournalFilterState } from '@/libs/types';


interface CitationMetrics {
  minCitations: number | null;
  maxCitations: number | null;
  minFieldCitationRatio: number | null;
  minRelativeCitationRatio: number | null;
}


interface Props {
  opened: boolean;
  onClose: () => void;
  onApply: (filters: JournalFilterState) => void;
  initialFilters: JournalFilterState;
  isLoading: boolean;
}

const JournalFilterModal: FC<Props> = ({
  opened, onClose, onApply, initialFilters, isLoading
}) => {
  const [filters, setFilters] = useState<JournalFilterState>(initialFilters);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (opened) setFilters({ ...initialFilters });
  }, [initialFilters, opened]);

  const updateFilter = <K extends keyof JournalFilterState>(
    key: K,
    value: JournalFilterState[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleNumberChange = (
    field: keyof CitationMetrics,
    value: string | number | null
  ) => {
    updateFilter('citationMetrics', {
      ...filters.citationMetrics,
      [field]: value === '' ? null : typeof value === 'string' ? parseFloat(value) : value
    });
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(filters, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'journal_filters.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setFilters({
          ...initialFilters,
          ...imported,
          dateRange: {
            from: imported.dateRange?.from ? new Date(imported.dateRange.from) : null,
            to: imported.dateRange?.to ? new Date(imported.dateRange.to) : null,
          }
        });
      } catch (error) {
        console.error('Error importing filters:', error);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Journal Analytics Filter" size="xl">
      <Stack gap="md">
        {/* Basic Search Section */}
        <Paper p="md" withBorder>
          <Stack gap="sm">
            <TextInput
              placeholder="Search titles and abstracts..."
              value={filters.search_query}
              onChange={(e) => updateFilter('search_query', e.target.value)}
              rightSection={<Search size={16} />}
            />
            <Group>
              <DatePickerInput
                placeholder="From"
                value={filters.dateRange.from}
                onChange={(v) => updateFilter('dateRange', { ...filters.dateRange, from: v })}
                clearable
              />
              <Text size="sm">to</Text>
              <DatePickerInput
                placeholder="To"
                value={filters.dateRange.to}
                onChange={(v) => updateFilter('dateRange', { ...filters.dateRange, to: v })}
                clearable
              />
            </Group>
          </Stack>
        </Paper>

        <Accordion>
          {/* Citation Metrics Section */}
          <Accordion.Item value="citation-metrics">
            <Accordion.Control>Citation Metrics</Accordion.Control>
            <Accordion.Panel>
              <Stack gap="md">
                <Group grow>
                  <NumberInput
                    label="Min Citations"
                    value={filters.citationMetrics.minCitations ?? ''}
                    onChange={(v) => handleNumberChange('minCitations', v)}
                    min={0}
                  />
                  <NumberInput
                    label="Max Citations"
                    value={filters.citationMetrics.maxCitations ?? ''}
                    onChange={(v) => handleNumberChange('maxCitations', v)}
                    min={0}
                  />
                </Group>

                <NumberInput
                  label="Min Field Citation Ratio"
                  description="Minimum citation impact relative to field average"
                  value={filters.citationMetrics.minFieldCitationRatio ?? ''}
                  onChange={(v) => handleNumberChange('minFieldCitationRatio', v)}
                  min={0}
                  step={0.1}
                />

                <NumberInput
                  label="Min Relative Citation Ratio"
                  value={filters.citationMetrics.minRelativeCitationRatio ?? ''}
                  onChange={(v) => handleNumberChange('minRelativeCitationRatio', v)}
                  min={0}
                  step={0.1}
                />
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          {/* Subject Areas Section */}
          <Accordion.Item value="subject-areas">
            <Accordion.Control>Subject Areas</Accordion.Control>
            <Accordion.Panel>
              <MultiSelect
                label="Subject Areas (FOR 2020 Categories)"
                description="Filter by research fields"
                data={fieldOptions}
                value={filters.subjectAreas}
                onChange={(v) => updateFilter('subjectAreas', v)}
                searchable
              />
            </Accordion.Panel>
          </Accordion.Item>

          {/* Journal Lists Section */}
          <Accordion.Item value="journal-lists">
            <Accordion.Control>Journal Lists</Accordion.Control>
            <Accordion.Panel>
              <MultiSelect
                label="Journal Lists"
                description="Filter by specific journal lists"
                data={journalListOptions}
                value={filters.journalLists}
                onChange={(v) => updateFilter('journalLists', v)}
                searchable
              />
            </Accordion.Panel>
          </Accordion.Item>

          {/* Publishers & Organizations Section */}
          <Accordion.Item value="publishers">
            <Accordion.Control>Publishers & Organizations</Accordion.Control>
            <Accordion.Panel>
              <Stack gap="md">
                <MultiSelect
                  label="Include Publishers"
                  description="Filter by specific publishing houses"
                  data={publisherOptions}
                  value={filters.publisherFilters.publishers}
                  onChange={(v) => updateFilter('publisherFilters', {
                    ...filters.publisherFilters,
                    publishers: v
                  })}
                  searchable
                />
                
                <MultiSelect
                  label="Exclude Publishers"
                  description="Exclude specific publishing houses"
                  data={publisherOptions}
                  value={filters.publisherFilters.excludePublishers}
                  onChange={(v) => updateFilter('publisherFilters', {
                    ...filters.publisherFilters,
                    excludePublishers: v
                  })}
                  searchable
                />

                <MultiSelect
                  label="Research Organizations"
                  description="Filter by research institutions"
                  data={organizationOptions}
                  value={filters.organizations.research}
                  onChange={(v) => updateFilter('organizations', {
                    ...filters.organizations,
                    research: v
                  })}
                  searchable
                />

                <MultiSelect
                  label="Funding Organizations"
                  description="Filter by funding organizations"
                  data={organizationOptions}
                  value={filters.organizations.funding}
                  onChange={(v) => updateFilter('organizations', {
                    ...filters.organizations,
                    funding: v
                  })}
                  searchable
                />
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          {/* Access Types Section */}
          <Accordion.Item value="access">
            <Accordion.Control>Access Types</Accordion.Control>
            <Accordion.Panel>
              <Stack gap="xs">
                <Group>
                  <Checkbox
                    label="Open Access"
                    checked={filters.accessType.openAccess}
                    onChange={(e) => updateFilter('accessType', {
                      ...filters.accessType,
                      openAccess: e.currentTarget.checked
                    })}
                  />
                  <Checkbox
                    label="Subscription"
                    checked={filters.accessType.subscription}
                    onChange={(e) => updateFilter('accessType', {
                      ...filters.accessType,
                      subscription: e.currentTarget.checked
                    })}
                  />
                </Group>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          {/* Document Types & Preprints Section */}
          <Accordion.Item value="document-types">
            <Accordion.Control>Document Types & Preprints</Accordion.Control>
            <Accordion.Panel>
              <Stack gap="md">
                <MultiSelect
                  label="Include Document Types"
                  description="Filter for specific document types"
                  data={documentTypeOptions}
                  value={filters.documentTypes.include}
                  onChange={(v) => updateFilter('documentTypes', {
                    ...filters.documentTypes,
                    include: v
                  })}
                  searchable
                />
                
                <MultiSelect
                  label="Exclude Document Types"
                  description="Exclude specific document types"
                  data={documentTypeOptions}
                  value={filters.documentTypes.exclude}
                  onChange={(v) => updateFilter('documentTypes', {
                    ...filters.documentTypes,
                    exclude: v
                  })}
                  searchable
                />

                <Stack gap="xs">
                  <Text size="sm" fw={500}>Preprint Settings</Text>
                  <Group>
                    <Checkbox
                      label="Include Preprints"
                      checked={filters.preprints.include}
                      onChange={(e) => updateFilter('preprints', {
                        ...filters.preprints,
                        include: e.currentTarget.checked,
                        only: false,
                        exclude: false
                      })}
                    />
                    <Checkbox
                      label="Exclude Preprints"
                      checked={filters.preprints.exclude}
                      onChange={(e) => updateFilter('preprints', {
                        ...filters.preprints,
                        exclude: e.currentTarget.checked,
                        include: false,
                        only: false
                      })}
                    />
                    <Checkbox
                      label="Only Preprints"
                      checked={filters.preprints.only}
                      onChange={(e) => updateFilter('preprints', {
                        ...filters.preprints,
                        only: e.currentTarget.checked,
                        include: false,
                        exclude: false
                      })}
                    />
                  </Group>
                </Stack>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

        {/* Footer Actions */}
        <Group justify="space-between" mt="xl">
          <Group>
            <Button variant="default" leftSection={<Upload size={16} />}
              onClick={() => fileInputRef.current?.click()}>
              Load
            </Button>
            <Button variant="default" leftSection={<Download size={16} />}
              onClick={handleExport}>
              Save
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".json"
              hidden
            />
          </Group>
          <Group>
            <Button variant="default" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={() => onApply(filters)} loading={isLoading}>
              {isLoading ? 'Analyzing...' : 'Apply Filters'}
            </Button>
          </Group>
        </Group>
      </Stack>
    </Modal>
  );
};

export default JournalFilterModal;