import '@mantine/core/styles.css';

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
        {children}
      </body>
    </html>
  );
}