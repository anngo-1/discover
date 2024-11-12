import React from 'react';
import { Paper, Text, ScrollArea, Box, Group, Loader } from '@mantine/core';

interface Author {
  name: string;
}

interface Publication {
  id: string;  // Link (OpenAlex link, clickable now)
  title: string;
  authors: Author[];  // authors can be null
  publication_date: string;
  journal: string;
  cited_by_count: number;
  doi: string;
}

interface ResearchTableProps {
  publications: Publication[];
}

const ResearchTable: React.FC<ResearchTableProps> = ({ publications }) => {

  return (
    <Paper mt={8} shadow="sm" radius="md" withBorder>
      <ScrollArea style={{ height: 'calc(100vh - 300px)' }}>
        <Box p="md">
          {publications.map((publication) => (
            <Box
              key={publication.id}
              mb="md"
              p="md"
              style={{
                cursor: 'pointer',
                transition: 'background-color 300ms ease, transform 300ms ease', // Smoother transition for both properties
                borderRadius: '8px',
                backgroundColor: '#f9fafb', // Light background for the publication
                border: '1px solid #e0e0e0', // Subtle border
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', // Light shadow
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f3f5'; // Change background on hover
                e.currentTarget.style.transform = 'scale(1.01)'; // Slight scale-up effect
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb'; // Reset background
                e.currentTarget.style.transform = 'scale(1)'; // Reset scale
              }}
            >
              {/* Title is now underlined and clickable, leading to OpenAlex */}
              <Text size="xl" fw={600} color="dark">
                <a
                  href={publication.id}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'inherit',
                    textDecoration: 'underline', // Underlined title
                  }}
                >
                  {publication.title}
                </a>
              </Text>
              <Text size="sm" color="dimmed" mb="sm">
                {(publication.authors && Array.isArray(publication.authors) && publication.authors.length > 0)
                  ? publication.authors.map((author, index) => (
                      <span key={index}>
                        {author.name}
                        {index < publication.authors.length - 1 && ', '}
                      </span>
                    ))
                  : 'No authors available'}
              </Text>
              <Text size="xs" color="dimmed" mb="sm">
                {publication.publication_date} | {publication.journal}
              </Text>
              <Group gap="xs">
                <Text size="xs" color="dimmed">Cited by: {publication.cited_by_count}</Text>
                <Text size="xs" color="dimmed">| DOI: <a href={`https://doi.org/${publication.doi}`} target="_blank" rel="noopener noreferrer">{publication.doi}</a></Text>
              </Group>
            </Box>
          ))}
        </Box>
      </ScrollArea>
    </Paper>
  );
};

export default ResearchTable;
