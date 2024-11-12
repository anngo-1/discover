'use client';

import { FC, useState, useEffect } from 'react';
import { Text, ActionIcon, Center, Loader, Pagination } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import ResearchTable from '../components/ResearchTable';
import { FilterState } from '@/libs/types';
import React from 'react';

interface Author {
  name: string;
}

interface Publication {
  id: string;
  title: string;
  authors: Author[];
  publication_date: string;
  journal: string;
  cited_by_count: number;
  doi: string;
}

interface PaginationWrapperProps {
  filters: FilterState;
}

const PaginationWrapper: FC<PaginationWrapperProps> = ({ filters }) => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const host = process.env.NEXT_PUBLIC_HOST
  const fetchPublications = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${host}/works/publications?page=${page}&filter=${JSON.stringify(filters)}`);

      if (!response.ok) {
        throw new Error(`Error fetching publications: ${response.statusText}`);
      }

      const data = await response.json();
      const { publications, total_pages } = data;

      setPublications(publications);
      setTotalPages(total_pages);
    } catch (error) {
      console.error('Error fetching publications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // fetch publications when filters change or currentPage changes
    fetchPublications(currentPage);
  }, [filters, currentPage]); 

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px',
          marginTop: '16px',
          flexWrap: 'wrap', // allows items to wrap on small screens
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', flex: '1 1 auto' }}>
          <Text style={{ fontSize: '16px', fontWeight: 700, marginRight: '8px' }}>Works</Text>
          <ActionIcon variant="outline" color="blue" size="sm">
            <IconDownload size={16} />
          </ActionIcon>
        </div>
        <Pagination
          total={totalPages}
          onChange={(newPage) => setCurrentPage(newPage)}
          disabled={isLoading}
          size="sm"
          styles={{
            root: {
              display: 'flex',
              alignItems: 'center',
              flex: '1 1 auto', // allows pagination to shrink or grow based on screen size
              justifyContent: 'flex-end',
            },
            control: {
              padding: '4px 8px',
              fontSize: '14px',
            },
          }}
        />
      </div>

      {isLoading ? (
        <Center style={{ height: 'calc(100vh - 300px)' }}>
          <Loader size="sm" variant="dots" color="gray" />
        </Center>
      ) : (
        <ResearchTable publications={publications} />
      )}
    </div>
  );
};

export default React.memo(PaginationWrapper);
