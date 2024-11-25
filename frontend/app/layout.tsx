'use client';

import { AppShell, MantineProvider, Box } from '@mantine/core';
import { Navbar } from '@/components/NavBar';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/carousel/styles.css';
import { useState } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened] = useState(false);

  return (
    <html lang="en">
      <body>
        <MantineProvider>
          <AppShell
            header={{ height: { base: 60, sm: 0 } }}  // Now 0 on desktop
            navbar={{
              width: { sm: 260 },
              breakpoint: 'sm',
              collapsed: { mobile: !opened }
            }}
            padding="md"
          >
            <AppShell.Header>
              <Box hiddenFrom="sm">
                <Navbar />
              </Box>
            </AppShell.Header>
            <AppShell.Navbar>
              <Box visibleFrom="sm">
                <Navbar />
              </Box>
            </AppShell.Navbar>
            <AppShell.Main>
              {children}
            </AppShell.Main>
          </AppShell>
        </MantineProvider>
      </body>
    </html>
  );
}