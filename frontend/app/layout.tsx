import { MantineProvider } from '@mantine/core';
import { Navbar } from '@/components/NavBar';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/carousel/styles.css';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
    <html lang="en" data-mantine-color-scheme="light">
      <head>
        <meta name="color-scheme" content="light" />
      </head>
      <body>
      <MantineProvider>
        <Navbar/>
        {children}
        </MantineProvider>
      </body>
    </html>
    
  );
}