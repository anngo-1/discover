import React, { useState, useMemo } from 'react';
import { Table, Badge, Text, ScrollArea, Pagination, Card, Modal } from '@mantine/core';
import { IconSearch, IconRefresh, IconChevronUp, IconChevronDown } from '@tabler/icons-react';
import { TextInput, ActionIcon, Group } from '@mantine/core';
import { TopicDataPoint } from '@/libs/types';

type SortConfig = {
  key: keyof TopicDataPoint;
  direction: 'ascending' | 'descending';
};

interface TableViewProps {
  filteredAndSearchedData: TopicDataPoint[];
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  page: number;
  setPage: (page: number) => void;
  loading: boolean;
}

const TableView: React.FC<TableViewProps> = ({
  filteredAndSearchedData,
  searchQuery,
  setSearchQuery,
  page,
  setPage,
}) => {
  const itemsPerPage = 10;
  const totalItems = filteredAndSearchedData.length;
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState('');

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredAndSearchedData;

    return [...filteredAndSearchedData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (bValue === null || bValue === undefined) return sortConfig.direction === 'ascending' ? 1 : -1;

      if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
        const aNum = Number(aValue);
        const bNum = Number(bValue);
        return sortConfig.direction === 'ascending' ? aNum - bNum : bNum - aNum;
      }

      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();
      
      return sortConfig.direction === 'ascending'
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString);
    });
  }, [filteredAndSearchedData, sortConfig]);

  const requestSort = (key: keyof TopicDataPoint) => {
    let direction: 'ascending' | 'descending' = 'ascending';

    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
    }

    setSortConfig({ key, direction });
  };

  const TableHeader = ({ 
    columnKey, 
    width, 
    children 
  }: { 
    columnKey: keyof TopicDataPoint; 
    width?: string;
    children: React.ReactNode;
  }) => {
    const isActive = sortConfig?.key === columnKey;
    
    return (
      <Table.Th 
        onClick={() => requestSort(columnKey)} 
        style={{ width }} 
        className="select-none cursor-pointer"
      >
        <Group gap={4} wrap="nowrap" justify="space-between">
          <Text fw={700} size="sm" className="mr-1">
            {children}
          </Text>
          <div className="w-4 flex items-center">
            {isActive && (
              sortConfig.direction === 'ascending' 
                ? <IconChevronUp size={14} className="text-blue-500" />
                : <IconChevronDown size={14} className="text-blue-500" />
            )}
          </div>
        </Group>
      </Table.Th>
    );
  };

  const formatNumber = (num: number): string => num.toLocaleString();

  return (
    <Card shadow="sm" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="space-between" align="center">
          <Text fw={700}>Research Areas</Text>
          <TextInput
            size="sm"
            placeholder="Search research areas..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.currentTarget.value)}
            leftSection={<IconSearch size={16} />}
            rightSection={
              searchQuery && (
                <ActionIcon size="sm" variant="subtle" onClick={() => setSearchQuery('')}>
                  <IconRefresh size={16} />
                </ActionIcon>
              )
            }
            style={{ width: '300px' }}
          />
        </Group>
      </Card.Section>

      <ScrollArea h={430}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <TableHeader columnKey="concept">
                Research Area
              </TableHeader>
              <TableHeader columnKey="publication_count" width="15%">
                Publications
              </TableHeader>
              <TableHeader columnKey="top_journals">
                Top Journals
              </TableHeader>
              <TableHeader columnKey="collaborating_countries" width="20%">
                Collaborating Countries
              </TableHeader>
              <TableHeader columnKey="avg_citations" width="15%">
                Avg Citations
              </TableHeader>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sortedData
              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
              .map((row: TopicDataPoint) => (
                <Table.Tr key={row.concept}>
                  <Table.Td>
                    <Text fw={500}>{row.concept}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge size="lg" variant="light" color="blue">
                      {formatNumber(row.publication_count)}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text
                      size="sm"
                      c="dimmed"
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '150px',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        setSelectedJournal(row.top_journals);
                        setModalOpened(true);
                      }}
                    >
                      {row.top_journals}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{row.collaborating_countries || '0'}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{row.avg_citations?.toFixed(0) || '0'}</Text>
                  </Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="flex-end">
          <Pagination
            total={Math.ceil(totalItems / itemsPerPage)}
            value={page}
            onChange={setPage}
            color="blue"
            radius="md"
          />
        </Group>
      </Card.Section>

      <Modal opened={modalOpened} onClose={() => setModalOpened(false)} title="Top Journals">
        <Text>{selectedJournal}</Text>
      </Modal>
    </Card>
  );
};

export default TableView;