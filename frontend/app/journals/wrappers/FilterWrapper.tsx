'use client'
import { FC, useState } from 'react';
import { JournalFilterState } from '@/libs/types';
import JournalFilterModal from '../components/JournalFilterModal';
import JournalDashboard from '../components/JournalDashoard';
import Filter from '@/components/Filter';
import { journalPredefinedFilters } from '../presets/journals';

interface JournalFilterWrapperProps {
  initialFilters: JournalFilterState;
}

const JournalFilterWrapper: FC<JournalFilterWrapperProps> = ({ initialFilters }) => {
  const [currentFilters, setCurrentFilters] = useState<JournalFilterState>(initialFilters);

  return (
    <div className="space-y-4">
      <Filter
        initialFilters={currentFilters}
        predefinedFilters={journalPredefinedFilters}
        onFiltersApplied={setCurrentFilters}
        FilterModalComponent={JournalFilterModal}
      />
      
      <JournalDashboard filters={currentFilters} />
    </div>
  );
};

export default JournalFilterWrapper;