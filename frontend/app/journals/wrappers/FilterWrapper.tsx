'use client';
import { FC, useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { JournalFilterState } from '@/libs/types';
import JournalFilterModal from '../components/JournalFilterModal';
import JournalDashboard from '../components/JournalDashoard';
import Filter from '@/components/Filter';
import { journalPredefinedFilters } from '../presets/journals';
import { Box, Center, Loader } from '@mantine/core';
import { encodeFilters, decodeFilters } from '@/utils/filterCompression';

interface JournalFilterWrapperProps {
 initialFilters: JournalFilterState;
}

const JournalFilterContent: FC<JournalFilterWrapperProps> = ({ initialFilters }) => {
 const router = useRouter();
 const searchParams = useSearchParams();
 
 const loadFiltersFromURL = (): JournalFilterState => {
   try {
     const encodedFilters = searchParams.get('f');
     if (encodedFilters) {
       const decoded = decodeFilters(encodedFilters);
       if (decoded) {
         return decoded;
       }
     }
     return initialFilters;
   } catch (error) {
     console.error('Error loading filters from URL:', error);
     return initialFilters;
   }
 };

 const [currentFilters, setCurrentFilters] = useState<JournalFilterState>(loadFiltersFromURL());

 useEffect(() => {
   if (searchParams.has('f')) {
     try {
       const encoded = encodeFilters(currentFilters);
       const params = new URLSearchParams(window.location.search);
       params.set('f', encoded);
       params.delete('filters');
       const newPath = `${window.location.pathname}?${params.toString()}`;
       router.push(newPath);
     } catch (error) {
       console.error('Error updating URL:', error);
     }
   }
 }, [currentFilters, router, searchParams]);

 const handleFiltersApplied = (newFilters: JournalFilterState) => {
   try {
     setCurrentFilters(newFilters);
   } catch (error) {
     console.error('Error applying filters:', error);
   }
 };

 return (
   <Box>
     <Filter
       initialFilters={currentFilters}
       predefinedFilters={journalPredefinedFilters}
       onFiltersApplied={handleFiltersApplied}
       FilterModalComponent={JournalFilterModal}
     />
     <JournalDashboard filters={currentFilters} />
   </Box>
 );
};

const JournalFilterWrapper: FC<JournalFilterWrapperProps> = (props) => {
 return (
   <Suspense fallback={
     <Center h={100}>
       <Loader size="lg" />
     </Center>
   }>
     <JournalFilterContent {...props} />
   </Suspense>
 );
};

export default JournalFilterWrapper;