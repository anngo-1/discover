'use client';

import { FC, useState, useEffect } from 'react';
import ResearchTable from './ResearchTable';
import { Pagination, Loader, Center } from '@mantine/core';

interface Author {
  name: string;
}

interface Publication {
  id: string;  // Link
  title: string;
  authors: Author[];  // authors can be null
  publication_date: string;
  journal: string;
  cited_by_count: number;
  doi: string;
}
interface PaginationWrapperProps {
  filters: string;
}
const PaginationWrapper: FC<PaginationWrapperProps> = ({ filters }) => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchPublications = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/publications?page=${page}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching publications: ${response.statusText}`);
      }

      const data = await response.json();
      const { publications, total_pages } = data;

      console.log(publications);
      setPublications(publications);
      setTotalPages(total_pages);
    } catch (error) {
      console.error('Error fetching publications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications(currentPage);
  }, [currentPage]);

  return (
    <div>
      {isLoading ? (
        <Center style={{ height: '300px' }}>
          <Loader size="sm" variant="dots" color="gray" />
        </Center>
      ) : (
        <ResearchTable publications={publications} />
      )}

      <Pagination
        total={totalPages}
        onChange={(newPage) => setCurrentPage(newPage)}
        mt="md"
        disabled={isLoading}
        styles={{
          root: {
            display: 'flex',
            justifyContent: 'left',
            flexWrap: 'wrap',
            gap: '8px',
            overflow: 'hidden', // Prevents overflow
            width: '100%', // Ensures it stays within the container width
          },
          control: {
            padding: '8px 16px',
            fontSize: '16px',
            '@media (maxWidth: 600px)': {
              padding: '6px 12px', // Adjust padding for mobile
              fontSize: '14px', // Adjust font size for mobile
            },
          },
        }}
      />
    </div>
  );
};

export default PaginationWrapper;
