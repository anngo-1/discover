# Navigation Bar Documentation
`components/NavBar.tsx`

## Overview
A responsive navigation component that provides application-wide navigation with mobile support.

## Features
- Responsive design
- Mobile drawer navigation
- Active route highlighting
- Consistent styling
- Smooth transitions

## Navigation Items
```typescript
const navigationItems = [
  { label: 'Works', href: '/works' },
  { label: 'Journals/Publishers', href: '/journals' },
  { label: 'Researchers', href: '/researchers' },
  { label: 'Topics', href: '/topics' },
  { label: 'Funding', href: '/funding' }
];
```

## Components
### Desktop Navigation
- Horizontal button layout
- Active state indication
- Consistent spacing

### Mobile Navigation
- Hamburger menu trigger
- Drawer component
- Vertical button layout
- Close button

## Styling Features
- Sticky positioning
- Shadow effects
- Responsive breakpoints
- Transition animations

## Usage Example
```tsx
<Navbar />
```

