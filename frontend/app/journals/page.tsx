import { Container} from '@mantine/core';
import FilterWrapper from '@/app/journals/wrappers/FilterWrapper';
import { journalPredefinedFilters } from '@/app/journals/presets/journals';

export default function HomePage() {
  return (
    <div>
      <Container fluid px={24}>
        <FilterWrapper 
          initialFilters={journalPredefinedFilters[0].filters} 
        />
      </Container>
    </div>
  );
}