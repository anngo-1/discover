'use client'
import { useState } from 'react';
import { 
  Paper, 
  Container,
  Burger,
  Drawer,
  Stack,
  Text,
  Button,
  Group,
  Box,
  rem,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/navigation';

const navigationItems = [
  { label: 'Works', href: '/works' },
  { label: 'Journals/Publishers', href: '/journals' },
  { label: 'Researchers', href: '/researchers' },
  { label: 'Topics', href: '/topics' },
  { label: 'Funding', href: '/funding' },
];

export function Navbar() {
  const router = useRouter();
  const [opened, { toggle, close }] = useDisclosure(false);

  const handleNavigation = (path: string) => {
    router.push(path);
    close();
  };

  return (
    <Paper 
      withBorder 
      radius={0}
      shadow="sm"
      pos="sticky"
      top={0}
      style={{ zIndex: 100 }}
      w="100%"
    >
      <Container size="100%" px="md">
        {/* Desktop View */}
        <Group justify="space-between" wrap="nowrap" h={rem(60)}>
          <Text 
            size="lg" 
            fw={600}
            c="black"
            truncate
            hiddenFrom="sm"
          >
            Discover
          </Text>
          
          <Text 
            size="lg" 
            fw={600}
            c="black"
            truncate
            visibleFrom="sm"
          >
            Discover 
          </Text>

          {/* Desktop Navigation */}
          <Group gap="xs" visibleFrom="md" wrap="nowrap">
            {navigationItems.map((item) => (
              <Button
                key={item.href}
                variant="subtle"
                color="black"
                size="sm"
                onClick={() => handleNavigation(item.href)}
                styles={{
                  root: {
                    '&:hover': {
                      backgroundColor: 'var(--mantine-color-blue-1)',
                    },
                    whiteSpace: 'nowrap',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Group>

          {/* Mobile Menu Button */}
          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="md"
            size="sm"
          />
        </Group>
      </Container>

      <Drawer
  opened={opened}
  onClose={close}
  size="xs"
  hiddenFrom="sm"
  withinPortal={true}
  withCloseButton={true}
  position="right"
  zIndex={1000}
  styles={{
    header: {
      padding: 'var(--mantine-spacing-md)',
    },
    body: {
      padding: 'var(--mantine-spacing-md)',
    },
  }}
>
  <Stack gap="xs">
    <Text size="xl" fw={600} c="dark" mb="md">
      Tools
    </Text>
    
    <Stack gap="xs">
      {navigationItems.map((item) => (
        <Button
          key={item.href}
          variant="subtle"
          color="dark"
          fullWidth
          onClick={() => handleNavigation(item.href)}
          styles={{
            root: {
              justifyContent: 'flex-start',
              height: rem(42),
              fontWeight: 500,
              fontSize: 'var(--mantine-font-size-sm)',
              padding: 'var(--mantine-spacing-xs) var(--mantine-spacing-md)',
              '&:hover': {
                backgroundColor: 'var(--mantine-color-gray-1)',
              },
            },
            inner: {
              justifyContent: 'flex-start',
            }
          }}
        >
          {item.label}
        </Button>
      ))}
    </Stack>
  </Stack>
</Drawer>
    </Paper>
  );
}