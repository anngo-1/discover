# Discover Documentation

Welcome to the Discover documentation. This documentation covers the implementation and technical details of Discover, a research analytics platform.

## Frontend Architecture

The frontend is built using Next.js 13+ and follows a component-based architecture. Here are some helpful links:

- [Project Structure Overview](frontend/architecture/project-structure.md)
- [Data Flow Patterns](frontend/architecture/data-flow.md)

## Key Components

### Core Components
- [Navigation Bar](frontend/components/NavBar.md)
- [Filter System](frontend/components/Filter.md)
- [Metrics Display](frontend/components/MetricsCountTable.md)

### Data Visualization
- [Double Bar Chart](frontend/components/charts/DoubleBarChart.md)
- [Stacked Bar Chart](frontend/components/charts/StackedBarChart.md)

### Route-Specific Components
- [Works Filter Modal](frontend/app/routes/works/components/FilterModal.md)
- [Research Table](frontend/app/routes/works/components/ResearchTable.md)

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Visit `http://localhost:3000`

## Documentation Structure


  - `frontend/architecture` - System architecture and patterns
  - `frontend/core` - Home page and layout for all pages

The structure for the other pages matches the frontend directory of discover.