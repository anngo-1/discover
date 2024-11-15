import { Container, Text, Space} from '@mantine/core';
import FilterWrapper from '@/app/works/wrappers/FilterWrapper';
import { initialFilters } from '@/app/works/presets/works';
export default function HomePage() {
  return (
    <div>
      <Container
        fluid
        px={24} 
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
