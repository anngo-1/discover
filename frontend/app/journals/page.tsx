import { Container, Text, Space} from '@mantine/core';
import FilterWrapper from '@/app/journals/wrappers/FilterWrapper';
import { initialFilters } from '@/app/journals/presets/works';
export default function HomePage() {
  return (
    <div>
      <Container
        fluid
        px={24} 
      >
        <Space h="md" />
        <Text c="dimmed">
          Publishers are organizations that produce and distribute journals
        </Text>
        <Space h="md" />
        <FilterWrapper
         initialFilters={initialFilters}  />
      </Container>
    </div>

  );
}
