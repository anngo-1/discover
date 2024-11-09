'use client';

import { MantineProvider, createTheme } from '@mantine/core';

const theme = createTheme({
  primaryColor: 'blue',
  // You can also explicitly set light theme colors here

});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider 
      theme={theme} 
      defaultColorScheme="light"
      forceColorScheme="light" // This forces light mode
    >
      {children}
    </MantineProvider>
  );
}