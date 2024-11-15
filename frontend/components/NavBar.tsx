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

  return (
    <Paper 
      withBorder 
      radius={0}
      shadow="sm"
      pos="sticky"
      top={0}
      style={{ zIndex: 100 }}
    >
      <Container size="100%" px="md">
        <Group justify="space-between" wrap="nowrap" h={rem(60)}>
          {/* Logo */}
          <Button
            variant="subtle"
            color="dark"
            size="md"
            onClick={() => handleNavigation('/')}
          >
            <Text fw={700}>Discover</Text>
          </Button>

          {/* Desktop Navigation */}
          <Group gap="xs" visibleFrom="md" wrap="nowrap">
            {navigationItems.map((item) => (
              <Button
                key={item.href}
                variant={isActive(item.href) ? "light" : "subtle"}
                color={isActive(item.href) ? "blue" : "gray"}
                size="sm"
                onClick={() => handleNavigation(item.href)}
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