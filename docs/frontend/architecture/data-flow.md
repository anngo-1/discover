# Frontend Data Flow

## Overview
The application follows a pattern centered around user-driven filter interactions. 

## Flow Sequence

### 1. Filter Initialization
- Each page loads with a predefined set of filters from its `presets` directory
- Initial filters determine the default data view presented to users
- Filter configurations are type-safe and follow interfaces defined in `libs/types.ts`

### 2. User Interaction & Filter Updates
- Users can modify filters through the FilterModal component
- Upon clicking "Apply Filters":
  - Filter state is updated
  - Changes propagate to the respective wrapper components

### 3. Data Fetching
- Wrapper components act as containers for data fetching logic
- They receive the updated filter state and:
  - Construct appropriate API requests with the filter state as a parameter
  - Transform API responses into component-ready data structures

### 4. Data Distribution
- Wrapper components distribute fetched data to their children through props
- Child components focus on data presentation
- Props follow TypeScript interfaces to ensure type safety

### 5. Data Display
- Child components render the received data using appropriate visualizations or layouts


This architecture ensures a clear separation of concerns, predictable data flow, and the reusability of the components used.
