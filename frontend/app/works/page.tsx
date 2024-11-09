import { Container, Title, Text, Space } from '@mantine/core';
import { Navbar } from '@/components/NavBar';
import { FilterWrapper } from '@/components/FilterWrapper';
import { Providers } from '../providers';

export default function HomePage() {
  return (
    <Providers>
      <Navbar />
      <Container
        fluid
        px={24}  // Optional: removes padding from the sides
      >
        <Space h = "md"/>
        <Text c="dimmed">
          Works are scholarly documents like journal articles, books, datasets, and theses.
        </Text>
        <Space h = "md"/>
        <FilterWrapper/>
      </Container>
    </Providers>
  );
}
