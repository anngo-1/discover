# Research Table Documentation
`app/works/components/ResearchTable.tsx`

## Overview
A component that displays research works in a card-based layout with infinite scroll capabilities.

## Features
- Card-based publication display
- Publication metadata display:
  - Title with link
  - Authors list
  - Publication date
  - Journal name
  - Citation count
  - DOI with link

## Interfaces
```typescript
interface Author {
  name: string;
}

interface Publication {
  id: string;
  title: string;
  authors: Author[] | null;
  publication_date: string;
  journal: string;
  cited_by_count: number;
  doi: string;
}

interface ResearchTableProps {
  publications: Publication[];    
}
```

## Child Components

### PublicationCard
A sub-component that renders individual publication entries with:
- Interactive hover effects
- Metadata badges
- External links
- Responsive layout

## Styling Features
- Shadow effects on hover
- Smooth transitions
- Responsive padding and spacing
- Consistent typography hierarchy
- Badge-based metadata display

## Usage Example
```tsx
<ResearchTable publications={[
  {
    id: "example-id",
    title: "Example Research Paper",
    authors: [{ name: "John Doe" }],
    publication_date: "2024-01-01",
    journal: "Example Journal",
    cited_by_count: 10,
    doi: "10.1234/example"
  }
]} />
```