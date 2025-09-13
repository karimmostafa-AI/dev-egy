# Design Guidelines for Uniform Advantage Clone

## Design Approach
**Reference-Based Approach**: Following established medical uniform e-commerce design patterns with focus on professional healthcare aesthetic, clean navigation, and trust-building elements.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Navy Blue: 220 85% 25% (professional medical authority)
- Clean White: 0 0% 100% (medical cleanliness)
- Light Gray: 210 15% 96% (subtle backgrounds)

**Dark Mode:**
- Dark Navy: 220 45% 15%
- Charcoal: 210 10% 20%
- Light accent: 210 20% 85%

### B. Typography
- **Primary**: Inter or similar clean sans-serif via Google Fonts
- **Headers**: 600-700 weight for navigation and titles
- **Body**: 400-500 weight for product descriptions and content
- **Small text**: 14px for categories, 16px for body, 18-24px for headers

### C. Layout System
Using Tailwind spacing primitives: 2, 4, 6, 8, 12, 16
- `p-4` for general padding
- `gap-6` for component spacing
- `h-12` for navigation bars
- `w-8` for icons

### D. Component Library

**Three-Tier Navigation:**
1. **Top Bar** (h-10): Brand tabs on left with pill-style active states, utility links on right
2. **Main Header** (h-16): Logo left, centered search with rounded borders, account/cart icons right
3. **Category Menu** (h-12): Horizontal categories with subtle hover backgrounds and smooth dropdown animations

**Core Components:**
- Search bar with subtle shadow and focus states
- Dropdown menus with clean borders and hover highlights
- Product cards with clean imagery and pricing
- Modal overlays with backdrop blur
- Newsletter signup with form validation styling
- Countdown timers with bold typography
- Promotional banners with gradient backgrounds

### E. Navigation Behavior
- Sticky header navigation during scroll
- Smooth dropdown animations (200ms ease-in-out)
- Clear hover states with subtle color shifts
- Mobile: Hamburger menu with slide-in drawer
- Search autocomplete with clean suggestion styling

## Images
**Hero Section**: Large promotional banner showcasing medical professionals in uniforms
**Product Showcases**: High-quality lifestyle images of healthcare workers
**Category Cards**: Clean product photography with consistent lighting
**Newsletter Modal**: Professional medical team background imagery

## Key Design Principles
- Professional medical industry aesthetic
- Clear visual hierarchy for easy product discovery
- Trust-building through clean, organized layout
- Responsive design prioritizing mobile usability
- Accessibility-compliant color contrast ratios
- Consistent spacing and typography throughout