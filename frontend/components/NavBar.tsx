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
import { useRouter, usePathname } from 'next/navigation';
import { Home, BookOpen, Users, Tags, Coins } from 'lucide-react';

const navigationItems = [
  { label: 'Research Output', href: '/works', icon: <Home size={20} /> },
  { label: 'Journals/Publishers', href: '/journals', icon: <BookOpen size={20} /> },
  { label: 'Researchers', href: '/researchers', icon: <Users size={20} /> },
  { label: 'Topics', href: '/topics', icon: <Tags size={20} /> },
  { label: 'Funding', href: '/funding', icon: <Coins size={20} /> },
];

interface NavbarProps {
  opened: boolean;
  onToggle: () => void;
}

export function Navbar({ opened, onToggle }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    router.push(path);
    onToggle(); 
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
          style={{
            borderRadius: '4px',
            backgroundColor: isActive(item.href) ? '#e6f7ff' : 'transparent',
            color: isActive(item.href) ? '#1e90ff' : '#666',
            border: '1px solid transparent',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            const target = e.currentTarget;
            if (!isActive(item.href)) {
              target.style.backgroundColor = '#f9f9f9';
              target.style.borderColor = '#ccc';
              target.style.transform = 'translateX(5px)';
            }
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget;
            if (!isActive(item.href)) {
              target.style.backgroundColor = 'transparent';
              target.style.borderColor = 'transparent';
              target.style.transform = 'translateX(0)';
            }
          }}
          onMouseDown={(e) => {
            const target = e.currentTarget;
            target.style.transform = 'translateX(5px) scale(0.98)';
          }}
          onMouseUp={(e) => {
            const target = e.currentTarget;
            target.style.transform = 'translateX(5px)';
          }}
        >
          <Group gap="sm">
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                color: isActive(item.href) ? '#1e90ff' : 'inherit',
                transition: 'all 0.2s ease',
              }}
            >
              {item.icon}
            </Box>
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
          <Burger opened={opened} onClick={onToggle} size="sm" />
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
        onClose={onToggle}
        size="75%"
        padding="md"
        title="Menu"
        hiddenFrom="sm"
        zIndex={1100}
        lockScroll={false}
      >
        <NavLinks />
      </Drawer>
    </>
  );
}