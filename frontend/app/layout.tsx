'use client';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/carousel/styles.css';
import { AppShell, MantineProvider, Box, createTheme, LoadingOverlay } from '@mantine/core';
import { Navbar } from '@/components/NavBar';
import { useState, useEffect } from 'react';

const theme = createTheme({
  primaryColor: 'blue',
  primaryShade: 6,
  components: {
    AppShell: {
      styles: (theme: { white: string; }) => ({
        main: {
          transition: 'all 0.3s ease',
          backgroundColor: theme.white,
          borderLeft: 'none',
        },
        navbar: {
          transition: 'all 0.3s ease',
          border: 'none',
          '&:hover': {
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          }
        }
      })
    },
    LoadingOverlay: {
      styles: {
        overlay: {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(3px)',
        }
      }
    }
  }
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, setOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en" data-mantine-color-scheme="light">
      <head>
        <meta name="color-scheme" content="light" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <MantineProvider theme={theme}>
          <AppShell
            header={{ height: { base: 60, sm: 0 } }}
            navbar={{
              width: { sm: 280 },
              breakpoint: 'sm',
              collapsed: { mobile: !opened }
            }}
            padding="md"
            transitionDuration={300}
            transitionTimingFunction="ease"
            layout="alt"
          >
            <LoadingOverlay
              visible={isLoading}
              loaderProps={{
                type: "bars",
                color: "blue.6",
                size: "xl"
              }}
              overlayProps={{
                blur: 3,
                backgroundOpacity: 0.7,
              }}
            />
            <AppShell.Header
              className="transition-all duration-300 hover:shadow-md"
              style={{ backgroundColor: 'white' }}
            >
              <Box hiddenFrom="sm" className="h-full flex items-center">
                <Navbar opened={opened} onToggle={() => setOpened(o => !o)} />
              </Box>
            </AppShell.Header>
            <AppShell.Navbar
              className="transition-all duration-300 hover:shadow-lg"
              style={{
                backgroundColor: 'white',
              }}
            >
              <Box
                visibleFrom="sm"
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Navbar opened={opened} onToggle={() => setOpened(o => !o)} />
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