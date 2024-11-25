'use client';
import {
  Burger,
  Drawer,
  Stack,
  Text,
  UnstyledButton,
  Group,
  Box,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter, usePathname } from 'next/navigation';
import { Home, BookOpen, Users, Tags, Coins } from 'lucide-react';

const navigationItems = [
  { label: 'Research Output', href: '/works', icon: <Home size={20} /> },
  { label: 'Journals/Publishers', href: '/journals', icon: <BookOpen size={20} /> },
  { label: 'Researchers', href: '/researchers', icon: <Users size={20} /> },
  { label: 'Topics', href: '/topics', icon: <Tags size={20} /> },
  { label: 'Funding', href: '/funding', icon: <Coins size={20} /> },
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [opened, { toggle, close }] = useDisclosure(false);

  const handleNavigation = (path: string) => {
    router.push(path);
    close();
  };

  const isActive = (path: string) => pathname === path;

  const NavLinks = () => (
    <Stack gap="xs">
      {navigationItems.map((item) => (
        <UnstyledButton
          key={item.href}
          onClick={() => handleNavigation(item.href)}
          p="xs"
          display="block"
          w="100%"
          styles={(theme) => ({
            root: {
              borderRadius: theme.radius.sm,
              backgroundColor: isActive(item.href) ? theme.colors.blue[1] : 'transparent',
              color: isActive(item.href) ? theme.colors.blue[9] : theme.colors.gray[7],
              
              '&:hover': {
                backgroundColor: isActive(item.href) ? theme.colors.blue[2] : theme.colors.gray[1],
                transform: 'scale(1.02)',
                transition: 'all 0.1s ease-in-out',
              }
            }
          })}
        >
          <Group>
            {item.icon}
            <Text size="sm" fw={isActive(item.href) ? 500 : 400}>
              {item.label}
            </Text>
          </Group>
        </UnstyledButton>
      ))}
    </Stack>
  );

  return (
    <>
      {/* Mobile Header */}
      <Box
        hiddenFrom="sm"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: 'white',
          borderBottom: '1px solid #eee',
        }}
      >
        <Group h={60} px="md" justify="space-between">
          <Title order={4}>Discover</Title>
          <Burger opened={opened} onClick={toggle} size="sm" />
        </Group>
      </Box>

      {/* Desktop Sidebar */}
      <Box
        visibleFrom="sm"
        h="100%"
        w={260}
        style={{
          borderRight: '1px solid #eee',
          backgroundColor: 'white',
        }}
      >
        <Group h={60} px="md" style={{ borderBottom: '1px solid #eee' }}>
          <Title order={4}>Discover</Title>
        </Group>
        <Box p="md">
          <NavLinks />
        </Box>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        size="75%"
        padding="md"
        title="Menu"
        hiddenFrom="sm"
        zIndex={1100}
      >
        <NavLinks />
      </Drawer>
    </>
  );
}