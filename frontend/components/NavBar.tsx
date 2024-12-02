'use client';
import { 
  Paper, 
  Container,
  Burger,
  Drawer,
  Stack,
  Text,
  Button,
  Group,
  rem,
  Divider,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter, usePathname } from 'next/navigation';

const navigationItems = [
  { label: 'Works', href: '/works' },
  { label: 'Journals/Publishers', href: '/journals' },
  { label: 'Researchers', href: '/researchers' },
  { label: 'Topics', href: '/topics' },
  { label: 'Funding', href: '/funding' },
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
        size="xs"
        hiddenFrom="md"
        position="right"
        withCloseButton={false}
      >
        <Stack p="md" gap="md">
          <Group justify="space-between">
            <Text size="lg" fw={600}>Menu</Text>
            <Burger opened={opened} onClick={close} size="sm" />
          </Group>
          
          <Divider />
          
          <Stack gap="xs">
            {navigationItems.map((item) => (
              <Button
                key={item.href}
                variant={isActive(item.href) ? "light" : "subtle"}
                color={isActive(item.href) ? "blue" : "gray"}
                fullWidth
                onClick={() => handleNavigation(item.href)}
                styles={{
                  root: {
                    justifyContent: 'flex-start',
                    height: rem(42),
                  },
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
