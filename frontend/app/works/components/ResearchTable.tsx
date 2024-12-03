import React from 'react';
import { 
  Paper, 
  Text, 
  ScrollArea, 
  Box, 
  Group, 
  Stack,
  Badge,
  Anchor,
} from '@mantine/core';

interface Author {
  name: string;
}

interface Publication {
  id: string;
  title: string;
  authors: Author[] | null;
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
    <Paper shadow="sm" radius="md" withBorder>
      <ScrollArea h="calc(100vh - 300px)" scrollbarSize={8} offsetScrollbars>
        <Stack gap="xs" p="md">
          {publications.map((publication) => (
            <PublicationCard key={publication.id} publication={publication} />
          ))}
        </Stack>
      </ScrollArea>
    </Paper>
  );
};

const PublicationCard: React.FC<{ publication: Publication }> = ({ publication }) => {
  const { title, authors, publication_date, cited_by_count, doi } = publication;

  const formattedDate = new Date(publication_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  });

  return (
    <Paper 
      p="md"
      radius="md"
      withBorder
      bg="gray.0"
      style={{
        transition: 'all 150ms ease',
      }}
      styles={(theme) => ({
        root: {
          '&:hover': {
            backgroundColor: theme.white,
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows.sm,
          }
        }
      })}
    >
      <Stack gap="sm">
        <Box>
          <Anchor
            href={`https://doi.org/${doi}`}
            target="_blank"
            rel="noopener noreferrer"
            underline="never"
            display="block"
          >
            <Text size="lg" fw={600} mb={4} style={{ lineHeight: 1.3 }}>
              {title}
            </Text>
          </Anchor>

          {authors && authors.length > 0 && (
            <Text size="sm" c="dimmed" mb={4} lineClamp={2}>
              {authors.map((author, index) => (
                <span key={index}>
                  {author.name}
                  {index < authors.length - 1 && ', '}
                </span>
              ))}
            </Text>
          )}
        </Box>

        <Group gap="sm" wrap="wrap">
          <Badge variant="dot" radius="sm" color="gray">
            {formattedDate}
          </Badge>
          
          {/* <Badge variant="outline" radius="sm" color="dark">
            {journal}
          </Badge> */}

          <Badge 
            variant="light" 
            radius="sm"
            color="gray"
          >
            {cited_by_count} citations
          </Badge>

          {doi && (
            <Anchor
              href={`https://doi.org/${doi}`}
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              c="dimmed"
              style={{ fontFamily: 'monospace' }}
            >
              DOI: {doi}
            </Anchor>
          )}
        </Group>
      </Stack>
    </Paper>
  );
};

export default ResearchTable;