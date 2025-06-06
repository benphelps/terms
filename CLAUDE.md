# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **Audiophile Terminology Guide** - an interactive reference website for audio enthusiasts. The site catalogs audiophile terms with detailed explanations, sentiment analysis, frequency associations, and test tracks for each term.

## Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## Architecture Overview

### Next.js App Router Structure

This application uses Next.js 15 with the App Router pattern:

- **Home page**: Interactive SPA at `/` (`src/app/page.tsx`) with search, filters, and frequency visualization
- **Term pages**: Static pages at `/[slug]/` (`src/app/[slug]/page.tsx`) with individual term details
- **Static generation**: Uses `generateStaticParams()` to pre-build all term pages at build time

### Core Data Architecture

**Data structure** (`src/data/`):
- `termsData.ts`: Main term definitions with rich HTML content and sentiment analysis
- `tracksData.ts`: Music track associations for demonstrating audio concepts  
- `frequencyMapping.ts`: Maps terms to frequency ranges for chart visualization
- `harmanCurve.ts`: Reference frequency response curve data

**Term schema** (`AudioTerm` interface in `src/types.ts`):
- Rich HTML content (rendered with `dangerouslySetInnerHTML`)
- Sentiment scoring and categorization (positive/negative/neutral)
- Related/opposite term references
- Frequency range associations for chart positioning

### Key Interactive Features

**Search & Filtering** (`src/hooks/`):
- **Fuzzy search**: Uses Fuse.js library across multiple term fields
- **Multi-dimensional filtering**: By sentiment categories and subcategories
- **URL parameter handling**: Search terms passed via `/?search=term` query params

**Data Visualization**:
- **Frequency Chart**: D3.js-powered interactive visualization plotting terms by frequency association
- **Click navigation**: Chart points navigate to term details or search results

**Music Integration**:
- **Global audio state**: Shared audio player preventing multiple simultaneous playback
- **Deezer API integration**: Uses CORS proxy (`whateverorigin.org`) for track previews
- **Cross-component coordination**: Global state management outside React for audio control

### Component Patterns

**Device-responsive behavior**:
- **Desktop**: Hover to expand term cards, single click to navigate  
- **Mobile**: Click to expand, click again to navigate
- **Detection**: Uses `'ontouchstart' in window` for reliable touch detection

**Navigation behavior**:
- **Smart related terms**: Checks if term exists in dictionary vs search query
- **Actual terms**: Navigate to `/[slug]/` 
- **Search terms**: Navigate to `/?search=[term]`
- **Back button**: Uses `document.referrer` detection for context-aware navigation

### State Management

**No external state library** - uses React hooks with:
- Custom hooks for search (`useSearch`), filtering (`useFilters`), and music (`useMusicPlayer`)
- Global audio state managed outside React for cross-component coordination
- Careful prop threading for component communication

### Technical Implementation Notes

**Content rendering**:
- Term descriptions contain HTML formatting requiring `dangerouslySetInnerHTML`
- Static page generation with proper SEO meta tags for each term

**Music player architecture**:
- Global `AudioState` object prevents conflicts between components
- Progress tracking with visual indicators across UI
- Automatic cleanup and state reset when switching tracks