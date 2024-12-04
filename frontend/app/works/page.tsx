import { Container} from '@mantine/core';
import FilterWrapper from '@/app/works/wrappers/FilterWrapper';
import { initialFilters } from '@/app/works/presets/works';
export default function HomePage() {
  return (
    <div>
      <Container
        fluid
        px={24} 
      >
  
        <FilterWrapper
         initialFilters={initialFilters}  />
      </Container>
    </div>

  );
}
