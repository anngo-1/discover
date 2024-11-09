'use client';

import { FC, useState } from 'react';
import { Group, Button, Badge, ActionIcon, Modal, TextInput } from '@mantine/core';
import { IconFilter, IconX } from '@tabler/icons-react';
import PaginationWrapper from './PaginationWrapper';
import ResearchMetricsWrapper from './ResearchMetricsWrapper';

export function FilterWrapper() {
  const [filters, setFilters] = useState<string>(''); 
  const [currentFilter, setCurrentFilter] = useState<string>('Filter 1'); 
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); 
  const [customFilterValue, setCustomFilterValue] = useState<string>(''); 

  const handleFilterChange = (selectedFilter: string) => {
    setCurrentFilter(selectedFilter); // update the current filter when a filter is selected
  };

  const handleApplyFilter = () => {
    setFilters(customFilterValue); // set custom filter value when applying it
    setCurrentFilter(customFilterValue); // set current filter to custom filter value
    setIsModalOpen(false); // close the modal after applying
  };

  const handleResetFilter = () => {
    setFilters(''); // reset the filter
    setCurrentFilter('Filter 1'); // reset to default filter
  };

  const handleOpenModal = () => {
    setIsModalOpen(true); // open the modal when "Custom Filter" is selected
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // close the modal without applying the custom filter
  };

  return (
    <div className="space-y-4">
      {/* Filter section */}
      <Group gap="xs" mb={8} style={{ overflowX: 'auto', paddingBottom: '8px' }}>
        {/* Filter Buttons */}
        {['Filter 1', 'Filter 2', 'Filter 3', 'Filter 4', 'Custom Filter'].map((filter) => (
          <Button
            key={filter}
            variant={currentFilter === filter || (filter === 'Custom Filter' && currentFilter === customFilterValue) ? 'filled' : 'outline'} // Filled if selected
            radius="xl" // Makes the button rounded
            onClick={() => filter === 'Custom Filter' ? handleOpenModal() : handleFilterChange(filter)}
          >
            {filter}
          </Button>
        ))}
      </Group>

      {/* Render Pagination and Metrics with the current filter */}
      <ResearchMetricsWrapper filters={filters} />
      <PaginationWrapper filters={filters} />

      {/* Modal for custom filter */}
      <Modal
        opened={isModalOpen}
        onClose={handleCloseModal}
        title="Define Custom Filter"
        size="lg"
      >
        <TextInput
          label="Custom Filter Criteria"
          placeholder="Enter your custom filter"
          value={customFilterValue}
          onChange={(e) => setCustomFilterValue(e.target.value)} // Update custom filter value
        />
        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleApplyFilter}>Apply Custom Filter</Button>
        </Group>
      </Modal>
    </div>
  );
}

export default FilterWrapper;
