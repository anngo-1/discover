# Frontend Documentation

## Project Structure
```
frontend/
├── app/
│   ├── layout.tsx                 # Root layout component
│   ├── page.tsx                   # Home page
│   ├── works/                     # Works route
│   │   ├── components/            # Route-specific components
│   │   │   ├── FilterModal.tsx
│   │   │   └── ResearchTable.tsx
│   │   ├── presets/              # Initialization and configurations
│   │   │   └── works.tsx
│   │   ├── wrappers/             # API and data handling wrappers
│   │   │   ├── PaginationWrapper.tsx
│   │   │   ├── ResearchMetricsWrapper.tsx
│   │   │   └── FilterWrapper.tsx
│   │   └── page.tsx               # Works page component
│   ├── topics/                    # Topics route (unfinished)
│   │   ├── components/
│   │   ├── presets/
│   │   ├── wrappers/
│   │   └── page.tsx
│   ├── researchers/               # Researchers route (unfinished)
│   │   ├── components/
│   │   ├── presets/
│   │   ├── wrappers/
│   │   └── page.tsx
│   ├── journals/                  # Journals route (unfinished)
│   │   ├── components/
│   │   ├── presets/
│   │   ├── wrappers/
│   │   └── page.tsx
│   └── funding/                   # Funding route (unfinished)
│       ├── components/
│       ├── presets/
│       ├── wrappers/
│       └── page.tsx
├── components/                    # Reusable components 
│   ├── NavBar.tsx
│   ├── Filter.tsx
│   ├── MetricsCountTable.tsx
│   ├── QuickMetricCard.tsx
│   ├── QuickMetricsSection.tsx
│   └── charts/
│       ├── DoubleBarChart.tsx
│       └── StackedBarChart.tsx
├── hooks/                        # Custom hooks
│   └── getWorksMetricsData.tsx
└── libs/
    └── types.ts                  # TypeScript type definitions
```

## Architecture Overview

### Routing Structure
The application follows Next.js 13+ App Router convention with five main routes:

1. `/works` - Research works and publications
2. `/topics` - Research topics and subject areas
3. `/researchers` - Individual researcher profiles and metrics
4. `/journals` - Journal information and metrics
5. `/funding` - Research funding and grants

Each route follows the same organizational pattern:
- `page.tsx`: The main page component
- `components/`: Route-specific components
- `presets/`: Initialization variables and pre-configured settings
- `wrappers/`: Components that handle API calls and data fetching

### Component Categories

#### Reusable Components (`/components`)
Components in this directory can be used across multiple routes in the application. These include:
- UI elements (NavBar, Filter)
- Data visualization components (charts)
- Metric display components (QuickMetricCard, MetricsCountTable)

#### Route-Specific Components (`/app/[route]/components`)
Components that are tightly coupled to a specific route and aren't meant to be reused elsewhere.

#### Wrapper Components (`/app/[route]/wrappers`)
Higher-order components that:

- Handle API calls
- Manage data fetching
- Provide data context to child components
- Handle pagination and filtering logic

#### Preset Configurations (`/app/[route]/presets`)
Contains initialization variables and pre-configured settings specific to each route, such as:

- Default filter values
- Initial states
- Configuration objects

