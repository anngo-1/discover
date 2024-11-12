import { Container, Text, Space} from '@mantine/core';
import { Navbar } from '@/components/NavBar';
import { FilterWrapper } from '@/components/FilterWrapper';
import { initialFilters } from '@/app/works/presets/works';
export default function HomePage() {
  return (
    <div>
      <Navbar />
      <Container
        fluid
        px={24}  // Optional: removes padding from the sides
      >
        <Space h="md" />
        <Text c="dimmed">
          Works include journal articles, books, datasets, and theses. 
        </Text>
        <Space h="md" />
        <FilterWrapper
         initialFilters={initialFilters}  />
      </Container>
    </div>

  );
}
