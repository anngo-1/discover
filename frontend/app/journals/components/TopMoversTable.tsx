import { FC, useState } from "react";
import {
  Table,
  TextInput,
  Center,
  Container,
  Text,
  ScrollArea,
  Paper,
  Stack,
} from "@mantine/core";
import { AggregatedStats, TopMover } from "@/libs/types";
import { calculateMover } from "../utils/data";

interface TopMoversTableProps {
  filteredData: AggregatedStats[];
  viewType: string;
}

const TopMoversTable: FC<TopMoversTableProps> = ({
  filteredData,
  viewType,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof TopMover | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const allYears = new Set<number>();
  filteredData.forEach((entity) => {
    Object.keys(entity.yearly_data || {}).forEach((year) => {
      allYears.add(parseInt(year));
    });
  });
  const sortedYears = Array.from(allYears).sort((a, b) => a - b);

  const entitiesWithDataInAllYears = filteredData.filter((entity) => {
    const entityYears = Object.keys(entity.yearly_data || {}).map((y) =>
      parseInt(y)
    );
    return sortedYears.every((year) => entityYears.includes(year));
  });

  const earliestYear = sortedYears[0];
  const latestYear = sortedYears[sortedYears.length - 1];

  const topMoversData = entitiesWithDataInAllYears
  .map((entity) => {
    const earliestYearData = entity.yearly_data?.[earliestYear];
    const latestYearData = entity.yearly_data?.[latestYear];

    if (
      !earliestYearData ||
      !latestYearData ||
      earliestYearData.publication_count === 0 ||  
      latestYearData.publication_count === 0 ||   
      earliestYearData.papers_with_data === 0 ||  
      latestYearData.papers_with_data === 0 ||     
      earliestYearData.citations === 0 ||       
      latestYearData.citations === 0               
    ) {
      return null; 
    }

    return calculateMover(entity, earliestYear, latestYear, viewType);
  })
  .filter((mover) => mover !== null) as TopMover[];

  const handleSort = (field: keyof TopMover) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const topMovers = [...topMoversData]
    .sort((a, b) => {
      if (sortField) {
        if (sortDirection === "asc") {
          return a[sortField] > b[sortField] ? 1 : -1;
        } else {
          return a[sortField] < b[sortField] ? 1 : -1;
        }
      }
      return 0;
    })
    .filter((item) =>
      searchQuery
        ? item.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    );

  const rows = topMovers.map((item, index) => (
    <Table.Tr key={index}>
      <Table.Td>
        <Text size="xs" style={{ fontSize: "0.75rem" }}>
          {item.name}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text
          size="xs"
          style={{ fontSize: "0.75rem" }}
          color={item.publicationChange >= 0 ? "teal" : "red"}
        >
          {item.publicationChange.toFixed(2)}%
        </Text>
      </Table.Td>
      <Table.Td>
        <Text
          size="xs"
          style={{ fontSize: "0.75rem" }}
          color={item.dataPapersChange >= 0 ? "teal" : "red"}
        >
          {item.dataPapersChange.toFixed(2)}%
        </Text>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Paper shadow="sm" p="md" radius="md" withBorder>
      <Stack gap="md">
        <Container size="md" p="sm">
          <TextInput
            placeholder="Search movers..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.currentTarget.value)}
            size="xs"
            mb="sm"
          />
          {topMovers.length > 0 ? (
            <ScrollArea h={430}>
              <Table style={{ minWidth: "100%", height: "450px" }}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th
                      onClick={() => handleSort("name")}
                      style={{
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        textAlign: "left",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Name{" "}
                      {sortField === "name" &&
                        (sortDirection === "asc" ? "▲" : "▼")}
                    </Table.Th>
                    <Table.Th
                      onClick={() => handleSort("publicationChange")}
                      style={{
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        textAlign: "left",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Publications{" "}
                      {sortField === "publicationChange" &&
                        (sortDirection === "asc" ? "▲" : "▼")}
                    </Table.Th>
                    <Table.Th
                      onClick={() => handleSort("dataPapersChange")}
                      style={{
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        textAlign: "left",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Data Papers{" "}
                      {sortField === "dataPapersChange" &&
                        (sortDirection === "asc" ? "▲" : "▼")}
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </ScrollArea>
          ) : (
            <Center>
              <Text size="xs">No matching movers found.</Text>
            </Center>
          )}
        </Container>
      </Stack>
    </Paper>
  );
};

export default TopMoversTable;