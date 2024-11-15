# Root Layout Documentation
`app/layout.tsx`

## Overview
The root layout component serves as the main wrapper for the entire application, implementing the Mantine UI framework, the Navbar on each page, and necessary style configs.

## Features
- Implements Mantine Provider for global UI consistency
- Configures light color scheme
- Imports required Mantine CSS styles:
  - Core styles
  - Dates component styles
  - Notifications styles
  - Carousel styles

## Usage
This component is automatically used by Next.js to wrap all pages in the application. No manual implementation required.